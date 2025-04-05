<template>
  <h1>Contributors <span v-if="totalContributor > 0"> ({{ totalContributor }}) </span></h1>
  <SearchBar @search="fetchContributor" @filteredSearch="setfilteredSearch($event)" @retrieve="fetchContributors($event)" :placeholder="'Insert Name or Githubs Username'" />
  <ContributorsList v-if="!loading && contributors.length > 0" 
    :contributors="contributors" 
    :totalPages="totalPages" 
    :pageSize="pageSize" 
    :currentPage="currentPage"  
    @selectCont="fetchContributors" 
    @goToPage="fetchContributors($event)" 
  />
  <p v-else-if="!loading && !error && contributors.length===0"> No results</p>
  <PulseLoader v-else-if="loading" color="#007bff"></PulseLoader>
  <div v-else-if="error" class="error-message">{{ error }}</div>
  <div class="chart-container" v-if="contributors.length > 0">
    <Chart :languages="true" :type="'contributors'" :header="'Top 5 Contributors based on changes'"/>
  </div>
</template>

<script>
import SearchBar from './SearchBar.vue';
import ContributorsList from './ContributorsList.vue';
import Chart from './Chart.vue';

export default {
  components: { SearchBar, ContributorsList, Chart  },
  data() {
    return {
      contributors: [],
      totalPages: 0,
      pageSize: 0,
      currentPage: 0,
      totalContributor: 0,
      loading: true,
      contributorsCache: {}, // Cache to store repositories by page number
      filteredSearch: false,
      language: '',
      error: null
    };
  },
  methods: {
    async fetchContributors(object) {

      this.loading = true;
      this.error = null;



      if(object?.retrieve){
        this.clear();
        object = this.currentPage
      }

      // Check if the page data is already cached
      if (this.contributorsCache[object] && this.filteredSearch === false) {
        this.contributors = this.contributorsCache[object];
        this.currentPage = object;
        this.loading = false;
        console.log(`Loaded page ${object} from cache`);
        return;
      }

      try {

        let response;
        

      
        if(!this.filteredSearch){
           response = await this.$axios.get(`/retrieveContributors?page=${object}`);
        }else{
          const config = {
              headers: {
                  "Content-Type": "application/json"
              }
          };

          const requestBody = {
              language: this.language
          };


           response = await this.$axios.post(
              `/retrieveFilteredContributors?page=${object}`,
              requestBody, 
              config
             );
        }
        
        this.contributors = response.data.contributors;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.totalContributor = response.data.totalItems;
        this.loading = false;

        // Cache the fetched repositories
        this.contributorsCache[object] = response.data.contributors;
      } catch (error) {
        this.error = 'Failed to load contributors. Please try again.';
        this.loading = false;
      }
    },
    setfilteredSearch(filteredSearch){
      this.filteredSearch = filteredSearch;
    },
    async fetchContributor(query) {

      this.loading = true;
      this.error = null;

      let response;

      this.language = query.selectedLanguage !== undefined ? query.selectedLanguage : '';


      try {
        if(!this.language && query.query){
           response = await this.$axios.get(`/retrieveContributor?name=${query.query}&username=${query.query}`);
        }else if (query.selectedLanguage){

          const config = {
              headers: {
                  "Content-Type": "application/json"
              }
          };

          const requestBody = {
              language: query.selectedLanguage
          };

           response = await this.$axios.post(
              "/retrieveFilteredContributors",
              requestBody, 
              config
             );
        }

        console.log(response)
        
        this.contributors = response.data.contributors;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.totalContributor = response.data.totalItems
        this.loading = false;
        
      } catch (error) {
        this.error = 'Failed to load contributors. Please try again.';
        this.loading = false;
      }
    },
    clear(){
    this.contributors = [];
    this.totalPages = 0;
    this.pageSize = 0;
    this.currentPage = 0;
    this.totalContributor = 0
    this.contributorsCache = {};
    this.filteredSearch = false
    this.language = ''
  }
  },
  created() {
    this.fetchContributors(this.currentPage);
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.chart-container .chart {
  max-width: 50%;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 10px 0;
  border-left: 4px solid #c62828;
  font-weight: 500;
}

@media (max-width: 768px) {
  .chart-container {
    flex-direction: column;
  }

  .chart-container .chart {
    max-width: 100%;
  }
}
</style>
