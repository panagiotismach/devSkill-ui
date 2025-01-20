<template>
  <h1>Contributors</h1>
  <SearchBar @search="fetchContributor" :placeholder="'Insert Name or Githubs Username'" />
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
</template>

<script>
import SearchBar from './SearchBar.vue';
import ContributorsList from './ContributorsList.vue';

export default {
  components: { SearchBar, ContributorsList  },
  data() {
    return {
      contributors: [],
      totalPages: 0,
      pageSize: 0,
      currentPage: 0,
      loading: true,
      contributorsCache: {}, // Cache to store repositories by page number
    };
  },
  methods: {
    async fetchContributors(page) {

      this.loading = true;

      // Check if the page data is already cached
      if (this.contributorsCache[page]) {
        this.contributors = this.contributorsCache[page];
        this.currentPage = page;
        this.loading = false;
        console.log(`Loaded page ${page} from cache`);
        return;
      }

      try {
        const response = await this.$axios.get(`http://localhost:8080/retrieveContributors?page=${page}`);
        this.contributors = response.data.contributors;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.loading = false;

        // Cache the fetched repositories
        this.contributorsCache[page] = response.data.contributors;
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    },
    async fetchContributor(query) {

      this.loading = true;

      try {
        const response = await this.$axios.get(`http://localhost:8080/retrieveRepository?name=${query}&url=${query}`);
        this.contributors = response.data.repositories;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
        this.loading = false;
        
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    },
  },
  created() {
    this.fetchContributors(this.currentPage);
  },
};
</script>
