<template>
  <h1>{{ header }}</h1>
  <SearchBar @search="fetchRepository($event)" :placeholder="'Insert Repository Name or Url'" />
  <RepositoryList v-if="!loading && repositories.length > 0"
    :repositories="repositories" 
    :totalPages="totalPages" 
    :pageSize="pageSize" 
    :currentPage="currentPage"  
    @goToPage=" isTrending ? fetchRepositories($event) : fetchTrendingRepositories($event)" 
  />
  <p v-else-if="!loading && repositories.length===0"> No results</p>
  <PulseLoader v-else-if="loading" color="#007bff"></PulseLoader>
</template>

<script>
import SearchBar from './SearchBar.vue';
import RepositoryList from './RepositoryList.vue';
import RepositoryDetails from './RepositoryDetails.vue';

export default {
  props:{
    isTrending:{
      type: Boolean,
      required: false,
      default: false,
    }
  },
  components: { SearchBar, RepositoryList, RepositoryDetails },
  data() {
    return {
      repositories: [],
      totalPages: 0,
      pageSize: 0,
      currentPage: 0,
      loading: true,
      header: "",
      repositoryCache: {}, // Cache to store repositories by page number
    };
  },
  methods: {
    async fetchRepositories(page) {

      this.loading = true;

      // Check if the page data is already cached
      if (this.repositoryCache[page]) {
        this.repositories = this.repositoryCache[page];
        this.currentPage = page;
        this.loading = false;
        console.log(`Loaded page ${page} from cache`);
        return;
      }

      try {
        const response = await this.$axios.get(`http://localhost:8080/retrieveRepositories?page=${page}`);
        this.repositories = response.data.repositories;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.loading = false;

        // Cache the fetched repositories
        this.repositoryCache[page] = response.data.repositories;
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    },
    async fetchRepository(query) {

      this.loading = true;

      try {
        const response = await this.$axios.get(`http://localhost:8080/retrieveRepository?name=${query}&url=${query}`);
        this.repositories = response.data.repositories;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.loading = false;
        
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    },
    async fetchTrendingRepositories(page) {

      this.loading = true;

      try {
        const response = await this.$axios.get(`http://localhost:8080/retrieveTrendingRepositories?page=${page}`);
        this.repositories = response.data.repositories;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.loading = false;
        
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
},
initRepositories(that){
    that.repositories = [];
    that.totalPages = 0;
    that.pageSize = 0;
    that.currentPage = 0;
    that.repositoryCache = {};
      if(that.isTrending){
        that.fetchTrendingRepositories(that.currentPage);
        that.header = "Trending Repositories";
    }else{
      that.fetchRepositories(that.currentPage);
      that.header = "Open Source Repositories";
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
