<template>
  <form class="search-container" @submit.prevent="handleSearch">
    <input
      v-model="query"
      @keyup.enter="handleSearch"
      :placeholder="placeholder"
      :required="!selectedLanguage ? true : false"
      class="search-input"
    />
    <button type="submit" class="search-button">
      <font-awesome-icon icon="search" class="search-icon" /> Search
    </button>
    
    <!-- Filter Icon (Font Awesome) -->
    <font-awesome-icon
      icon="filter"
      class="filter-icon"
      @click="openFilterModal"
    />

    <span v-if="selectedLanguage && filteredSearch" class="selected-filter">
      {{ selectedLanguage }}
      <font-awesome-icon icon="times-circle" class="clear-filter-icon" @click="clear" />
    </span>

    <span class="selected-filter">
      Clear All Filters
      <font-awesome-icon
      icon="times-circle"
      class="clear-filter-icon"
      @click="clear"
     />
    </span>
  
    
  
    <!-- Modal for Language Filter -->
    <div v-if="showModal" class="modal-overlay" @click="closeFilterModal">
      <div class="modal-content" @click.stop>
        <h3>Select Language</h3>
        <select v-model="selectedLanguage" class="language-dropdown">
          <option value="">Select Language</option>
          <option v-for="(extension, i) in allExtensions" :key="i" :value="extension">
              {{ extension }}
            </option>
        </select>
        <p v-if="languageError" class="error-message">Please select a language!</p>
        <div class="modal-actions">
          <button class="apply-btn" @click="applyFilter">Apply</button>
          <button class="cancel-btn" @click="closeFilterModal">Cancel</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  props: ['placeholder'],
  data() {
    return { 
      query: '',
      selectedLanguage: '', // Store the selected language
      allExtensions: null,
     famous: [
  { code: 'js', name: 'JavaScript', popularity: 1 },
  { code: 'py', name: 'Python', popularity: 2 },
  { code: 'java', name: 'Java', popularity: 3 },
  { code: 'cpp', name: 'C++', popularity: 4 },
   ],
      showModal: false, // To toggle the modal visibility
      languageError: false,
      filteredSearch: false,
    };
  },
  methods: {
    handleSearch() {
      this.$emit('search', {query:this.query, selectedLanguage: this.selectedLanguage});
    },
    openFilterModal() {
      this.showModal = true;
    },
    closeFilterModal() {
      this.showModal = false;
    },
    async findAllExtensions(){
      try{
        const response = await this.$axios.get(`/findAllExtensions`);

           this.allExtensions = response.data.sort((a, b) => {
          const isAFamous = this.famous.some(f => f.code === a);
          const isBFamous = this.famous.some(f => f.code === b);

          return isBFamous - isAFamous;
});

    
      }catch(e){
         console.log(e)
      }
    },
    applyFilter() {
      if(this.selectedLanguage){
        this.languageError = false;
        this.filteredSearch = true;
        this.$emit('filteredSearch', this.filteredSearch);
        console.log(this.selectedLanguage)
        this.$emit('applyFilter',  this.selectedLanguage);
        this.closeFilterModal(); // Close modal after applying filter
      }else{
        this.languageError = true;
      }

    },
    clear(){

      if(this.query || this.selectedLanguage){
        this.query = '';
        this.selectedLanguage = '';
      this.filteredSearch = false;
      this.$emit('filteredSearch', this.filteredSearch);
      this.$emit('retrieve', {retrieve: true});
      }
     
    }
  },
  created(){
    this.findAllExtensions();
  }
};
</script>

<style scoped>
/* Container for search elements */
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap; /* Prevents wrapping */
  gap: 10px; /* Ensures space between elements */
  width: 100%;
}

/* Styling for input field */
.search-input {
  padding: 12px 15px;
  font-size: 16px;
  border: 2px solid #007bff; /* Light blue border */
  border-radius: 8px;
  outline: none;
  width: 100%; /* Ensures it takes full width */
  max-width: 300px; /* Max width of input */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 10px; /* Adds space for smaller screens */
  flex-grow: 1; /* Allows the input to expand while keeping buttons aligned */
  max-width: 300px;
}

.search-input::placeholder {
  color: #aaa;
  font-style: italic;
}

.search-input:focus {
  border-color: #1e70b8; /* Darker blue when focused */
  box-shadow: 0 0 5px rgba(30, 112, 184, 0.5); /* Light blue glow on focus */
}

/* Styling for search button */
.search-button {
  background-color: #007bff; /* Light blue background */
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  min-width: 120px; /* Ensures the button is not too small */
  max-width: 300px; /* Max width of button */
}

.search-button:hover {
  background-color: #1e70b8; /* Darker blue on hover */
  transform: scale(1.05);
}

.search-icon {
  margin-right: 8px;
  font-size: 18px;
}

/* Styling for the filter icon */
.filter-icon {
  font-size: 20px;
  color: #007bff;
  cursor: pointer;
  margin-left: 10px; /* Adjust spacing */
  flex-shrink: 0; /* Prevent icons from shrinking */
}


.filter-icon:hover {
  color: #1e70b8;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Language dropdown */
.language-dropdown {
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 2px solid #73b9ff;
  background-color: white;
  width: 100%;
  margin-bottom: 15px;
}

.language-dropdown:focus {
  border-color: #1e70b8;
  box-shadow: 0 0 5px rgba(30, 112, 184, 0.5);
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: space-between;
}

.selected-filter {
  display: flex;
  align-items: center;
  background-color: #1e3a8a; /* Dark blue background */
  color: white;
  padding: 6px 12px;
  border-radius: 20px; /* Makes it rounded */
  font-size: 14px;
  font-weight: bold;
  text-transform: capitalize;
  margin-left: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.selected-filter:hover {
  background-color: #25409c; /* Slightly lighter blue */
}

/* Styling for the close icon */
.clear-filter-icon {
  margin-left: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2); /* Light transparent background */
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.clear-filter-icon:hover {
  background: rgba(255, 255, 255, 0.4); /* Brighter background on hover */
}


.apply-btn,
.cancel-btn {
  background-color: #73b9ff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 10px;
}

.apply-btn:hover,
.cancel-btn:hover {
  background-color: #1e70b8;
}

/* Add responsiveness */
@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    align-items: center;
    margin: 20px 10px; /* Adds margin to sides for smaller screens */
  }

  .search-input {
    width: 100%; /* Ensures the input takes full width */
    max-width: 250px; /* Limits the maximum width for input */
    margin-bottom: 15px;
  }

  .search-button {
    width: 100%; /* Makes the button take full width */
    max-width: 250px; /* Limits the maximum width for button */
  }

  .filter-icon {
    font-size: 18px;
    margin-left: 0;
  }

  .modal-content {
    width: 90%;
  }
}

@media (max-width: 480px) {
  .search-input {
    width: 100%; /* Ensures full width for very small screens */
    max-width: 200px; /* Limits the width further for very small screens */
  }

  .search-button {
    width: 100%; /* Ensures full width for the button */
    max-width: 200px; /* Matches the button width to the input */
  }

  .filter-icon {
    font-size: 16px;
  }
}
</style>
