<template>
  <h1>Contributors <span v-if="totalContributor > 0"> ({{ totalContributor }}) </span></h1>
  <SearchBar @search="fetchContributor" @filteredSearch="setfilteredSearch($event)" @retrieve="fetchContributors($event)" :placeholder="'Insert Name or Githubs Username'" />
  <ContributorsList v-if="!loading" 
    :contributors="contributors" 
    :totalPages="totalPages" 
    :pageSize="pageSize" 
    :currentPage="currentPage"  
    @selectCont="fetchContributors" 
    @goToPage="fetchContributors($event)" 
  />
  <p v-else-if="!loading && contributors.length===0"> No results</p>
  <PulseLoader v-else-if="loading" color="#007bff"></PulseLoader>
  <Chart :languages="true" :type="'contributors'" :header="'Top 5 Contributors based on changes'"/>
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
      language: ''
    };
  },
  methods: {
    async fetchContributors(object) {

      this.loading = true;



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
        console.error('Error fetching repositories:', error);
      }
    },
    setfilteredSearch(filteredSearch){
      this.filteredSearch = filteredSearch;
    },
    async fetchContributor(query) {

      this.loading = true;

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
        console.error('Error fetching repositories:', error);
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
