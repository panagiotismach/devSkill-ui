<template>
  <h1>{{ header }} <span v-if="this.tolatRepo > 0">({{tolatRepo}})</span></h1>
  <SearchBar @search="fetchRepository($event)" @filteredSearch="setfilteredSearch($event)" @retrieve="fetchRepositories($event)" :placeholder="'Insert Repository Name or Url'" />
  <RepositoryList v-if="!loading && repositories.length > 0"
    :repositories="repositories" 
    :totalPages="totalPages" 
    :pageSize="pageSize" 
    :currentPage="currentPage"  
    @goToPage=" isTrending ? fetchRepositories($event) : fetchTrendingRepositories($event)" 
  />
  
  <p v-else-if="!loading && !error && repositories.length===0"> No results</p>
  <PulseLoader v-else-if="loading" color="#007bff"></PulseLoader>
  <div v-else-if="error" class="error-message">{{ error }}</div>
  <!-- <div class="chart-container" v-if="repositories.length > 0">
    <Chart :languages="true" :type="'repositories'" :header="headerChart.headerLanguages" />
    <Chart :languages="false" :type="'repositories'" :header="headerChart.headerExtensions"/>
  </div> -->
  <div class="chart-container" v-if="repositories.length > 0">
    <Chart :languages="false" :type="'repositories'" :header="'Top 5 Repositories based on contributors'"/>
  </div>
</template>

<script>
import SearchBar from './SearchBar.vue';
import RepositoryList from './RepositoryList.vue';
import RepositoryDetails from './RepositoryDetails.vue';
import Chart from './Chart.vue';

export default {
  props:{
    isTrending:{
      type: Boolean,
      required: false,
      default: false,
    }
  },
  components: { SearchBar, RepositoryList, RepositoryDetails, Chart },
  data() {
    return {
      repositories: [],
      totalPages: 0,
      pageSize: 0,
      currentPage: 0,
      loading: true,
      tolatRepo: 0,
      header: "",
      headerChart: {
        headerLanguages: "",
        headerExtensions: "",
      },
      repositoryCache: {}, // Cache to store repositories by page number
      filteredSearch: false,
      language: '',
      error: null
    };
  },
  methods: {
    async fetchRepositories(object) {

      this.loading = true;
      this.error = null;

      if(object?.retrieve){
        this.clear();
        object = this.currentPage
      }


      // Check if the page data is already cached
      if (this.repositoryCache[object] && this.filteredSearch === false) {
        this.repositories = this.repositoryCache[object];
        this.currentPage = object;
        this.loading = false;
        console.log(`Loaded page ${c} from cache`);
        return;
      }

      try {

        let response;

        if(!this.filteredSearch){
           response = await this.$axios.get(`/retrieveRepositories?page=${object}`);
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
              `/retrieveFilteredRepositories?page=${object}`,
              requestBody, 
              config
             );
        }
        
        this.repositories = response.data.repositories;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.tolatRepo = response.data.totalItems
        this.loading = false;


        // Cache the fetched repositories
        this.repositoryCache[object] = response.data.repositories;
      } catch (error) {
        this.error = 'Failed to load repositories. Please try again.';
        this.loading = false;
      }
    },
    async fetchRepository(query) {

      this.loading = true;
      this.error = null;

      let response;

      this.language = query.selectedLanguage !== undefined ? query.selectedLanguage : '';

      try {
        if(!query.selectedLanguage && query.query){
           response = await this.$axios.get(`/retrieveRepository?name=${query.query}&url=${query.query}`);
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
              "/retrieveFilteredRepositories",
              requestBody, 
              config
             );
        }
        
        this.repositories = response.data.repositories != undefined ?  response.data.repositories : [];
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.tolatRepo = response.data.totalItems
        this.loading = false;


        
      } catch (error) {
        this.error = 'Failed to load repositories. Please try again.';
        this.loading = false;
      }
    },
    setfilteredSearch(filteredSearch){
      this.filteredSearch = filteredSearch;
    },
    async fetchTrendingRepositories(page) {

      this.loading = true;
      this.error = null;

      try {
        const response = await this.$axios.get(`/retrieveTrendingRepositories?page=${page}`);
        this.repositories = response.data.repositories != undefined ?  response.data.repositories : [];
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.tolatRepo = response.data.totalItems
        this.loading = false;

        
      } catch (error) {
        this.error = 'Failed to load trending repositories. Please try again.';
        this.loading = false;
      }
},
clear(){
   this.repositories = [];
    this.totalPages = 0;
    this.pageSize = 0;
    this.currentPage = 0;
    this.tolatRepo = 0
    this.repositoryCache = {};
    this.filteredSearch = false
    this.language = ''
},
initRepositories(that){
    that.repositories = [];
    that.totalPages = 0;
    that.pageSize = 0;
    that.currentPage = 0;
    that.tolatRepo = 0
    that.repositoryCache = {};
      if(that.isTrending){
        that.fetchTrendingRepositories(that.currentPage);
        that.header = "Trending Repositories";
        that.headerChart.headerLanguages = 'Trending Repository Languages';
        that.headerChart.headerExtensions = 'Trending Repository Extensions';
    }else{
      that.fetchRepositories(that.currentPage);
      that.header = "Open Source Repositories";
      that.headerChart.headerLanguages = 'Repository Languages';
        that.headerChart.headerExtensions = 'Repository Extensions';
    }
  }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.initRepositories(vm)
    });
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
