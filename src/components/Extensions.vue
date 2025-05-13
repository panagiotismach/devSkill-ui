<template>
    <div>
      <h1>{{ header }} <span v-if="totalItems > 0">({{ totalItems }})</span></h1>
      <SearchBar 
        @search="fetchExtension($event)" 
        @filteredSearch="setFilteredSearch($event)" 
        @retrieve="fetchExtensions($event)" 
        :placeholder="'Search by Extension (e.g., js, java, py)'" 
      />
      <ExtensionsList v-if="!loading && extensions.length > 0"
        :key="currentPage"
        :extensions="extensions"
        :totalPages="totalPages"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @goToPage="handlePageChange($event)"
        @sort="sortExtensions($event)"
      />
      <p v-else-if="!loading && !error && extensions.length === 0">No extensions found</p>
      <PulseLoader v-else-if="loading" color="#007bff" />
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div class="chart-container" v-if="extensions.length > 0">
        <Chart :languages="true" :type="'extensions'" :header="headerChart.headerLanguages" />
        <Chart :languages="false" :type="'extensions'" :header="headerChart.headerExtensions"/>
      </div>
    </div>
  </template>
  
  <script>
  import SearchBar from './SearchBar.vue';
  import ExtensionsList from './ExtensionsList.vue';
  import Chart from './Chart.vue';
  import * as langmap from "lang-map";
  
  export default {
    components: { SearchBar, ExtensionsList, Chart },
    data() {
      return {
        extensions: [],
        totalPages: 0,
        pageSize: 10,
        currentPage: 0,
        totalItems: 0,
        loading: true,
        header: "File Extensions",
        extensionCache: {},
        headerChart: {
        headerLanguages: "Repository Languages",
        headerExtensions: "Repository Extensions",
      },
        filteredSearch: false,
        filterExtension: '',
        error: null,
        sortField : 'repoCount',
        sortDirection : 'desc'
      };
    },
    methods: {
      async fetchExtensions(page, sortOptions = {}) {
        this.loading = true;
        this.error = null;
  
        if (page?.retrieve) {
          this.clear();
          page = 0;
        }
  
        page = Number(page);
        if (isNaN(page) || page < 0) {
          page = 0;
        }
  
  
        if (this.extensionCache[page] && !this.filteredSearch) {
          console.log(`Loading page ${page} from cache`);
          this.extensions = [...this.extensionCache[page]];
          this.currentPage = page;
          this.loading = false;
          return;
        }

        const sortField = sortOptions.field || this.sortField;
       const sortDirection = sortOptions.direction || this.sortDirection;
  
        try {
          let response;
          if (!this.filteredSearch) {
            const path =  sortField ? `&type=${sortField}&function=${sortDirection}` : '';
            response = await this.$axios.get(`/retrieveExtensions?page=${page}&size=${this.pageSize}` + path );
          } else {
            const config = {
              headers: { "Content-Type": "application/json" }
            };
            const requestBody = { extension: this.filterExtension };
            response = await this.$axios.post(
              `/retrieveFilteredExtensions?page=${page}&size=${this.pageSize}`,
              requestBody,
              config
            );
          }
  
          // Map the API response to the expected structure
          this.extensions = response.data.extensions || []
          this.totalPages = response.data.totalPages || 0;
          this.pageSize = response.data.pageSize || 10;
          this.currentPage = Number(response.data.currentPage) || 0;
          this.totalItems = response.data.totalItems || 0;
          this.extensionCache[page] = [...this.extensions];
          console.log(`Cached page ${page} with ${this.extensions.length} extensions`);
          console.log('Mapped Extensions data after API fetch:', this.extensions);
          this.loading = false;
        } catch (error) {
          console.error(`Error fetching extensions for page ${page}:`, error);
          this.error = 'Failed to load extensions. Please try again.';
          this.loading = false;
          this.extensions = [];
          this.totalPages = 0;
          this.currentPage = 0;
          this.totalItems = 0;
        }
      },
      sortExtensions({ field }) {
      this.sortField = field;
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' :  'desc';
      this.extensionCache = {}; 
      
      this.fetchExtensions(this.currentPage, { field: this.sortField, direction: this.sortDirection });
    },
      async fetchExtension(query) {
        this.loading = true;
        this.error = null;
  
        this.filterExtension = query.selectedLanguage || query.query || '';
        this.filteredSearch = !!this.filterExtension;
  
        console.log(`Fetching extension with filter: ${this.filterExtension}`);
  
        if (this.filteredSearch) {
          this.extensionCache = {};
          console.log('Cleared cache due to filter change');
        }
  
        try {
          let response;
          if (!this.filterExtension) {
            response = await this.$axios.get(`/retrieveExtensions?page=0&size=${this.pageSize}`);
          } else {
            const config = {
              headers: { "Content-Type": "application/json" }
            };
            const requestBody = { extension: this.filterExtension };
            response = await this.$axios.post(
              `/retrieveFilteredExtensions?page=0&size=${this.pageSize}`,
              requestBody,
              config
            );
          }

  
          // Map the API response to the expected structure
          this.extensions = response.data.extensions || []
          this.totalPages = response.data.totalPages || 0;
          this.pageSize = response.data.pageSize || 10;
          this.currentPage = Number(response.data.currentPage) || 0;
          this.totalItems = response.data.totalItems || 0;
          this.extensionCache[0] = [...this.extensions];
          console.log(`Cached page 0 with ${this.extensions.length} extensions`);
          this.loading = false;
        } catch (error) {
          console.error('Error fetching extension:', error);
          this.error = 'Failed to load extension. Please try again.';
          this.loading = false;
          this.extensions = [];
          this.totalPages = 0;
          this.currentPage = 0;
          this.totalItems = 0;
        }
      },
      setFilteredSearch(filteredSearch) {
        if (this.filteredSearch !== filteredSearch) {
          this.filteredSearch = filteredSearch;
          if (filteredSearch) {
            this.extensionCache = {};
          }
        }
      },
      handlePageChange(newPage) {
        console.log(`Handling page change to page ${newPage}`);
        this.currentPage = newPage;
        this.fetchExtensions(newPage);
      },
      clear() {
        this.extensions = [];
        this.totalPages = 0;
        this.pageSize = 10;
        this.currentPage = 0;
        this.totalItems = 0;
        this.extensionCache = {};
        this.filteredSearch = false;
        this.filterExtension = '';
        this.error = null;
        console.log('Cleared state');
      },
      initExtensions() {
        this.fetchExtensions(this.currentPage, { field :this.sortField, direction: this.sortDirection});
      }
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.initExtensions();
      });
    }
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
  
    h1 {
      font-size: 1.5rem;
      text-align: center;
    }
  }
  </style>