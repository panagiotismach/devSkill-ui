<template>
  <form class="search-container" @submit.prevent="handleSearch">
    <input
      v-model="query"
      @keyup.enter="handleSearch"
      :placeholder="placeholder"
      required
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
    
    <!-- Modal for Language Filter -->
    <div v-if="showModal" class="modal-overlay" @click="closeFilterModal">
      <div class="modal-content" @click.stop>
        <h3>Select Language</h3>
        <select v-model="selectedLanguage" class="language-dropdown">
          <option value="">All Languages</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
          <option value="Ruby">Ruby</option>
          <!-- Add more languages as needed -->
        </select>
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
      showModal: false, // To toggle the modal visibility
    };
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.query);
    },
    openFilterModal() {
      this.showModal = true;
    },
    closeFilterModal() {
      this.showModal = false;
    },
    applyFilter() {
      this.$emit('applyFilter',  this.selectedLanguage);
      this.closeFilterModal(); // Close modal after applying filter
    },
  },
};
</script>

<style scoped>
/* Container for search elements */
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  gap: 10px; /* Space between input and button */
  flex-wrap: wrap; /* Ensures the items wrap on smaller screens */
  width: 100%; /* Ensure the container takes up full width */
  box-sizing: border-box;
}

/* Styling for input field */
.search-input {
  padding: 12px 15px;
  font-size: 16px;
  border: 2px solid #73b9ff; /* Light blue border */
  border-radius: 8px;
  outline: none;
  width: 100%; /* Ensures it takes full width */
  max-width: 300px; /* Max width of input */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 10px; /* Adds space for smaller screens */
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
  background-color: #73b9ff; /* Light blue background */
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
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
  margin-left: 15px;
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

.apply-btn,
.cancel-btn {
  background-color: #73b9ff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
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
