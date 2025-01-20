<template>
  <div id="app">
    <Nav></Nav>
    <router-view></router-view>
  </div>
</template>

<script>
import Nav from './components/Nav.vue';
import axios from 'axios';

export default {
  components: { Nav },
  data() {
    return {
      repositories: [],
      contributors: [],
    };
  },
  methods: {
    async fetchContributors(repoId) {
      try {
        const response = await axios.get(`https://api.example.com/repositories/${repoId}/contributors`);
        this.contributors = response.data;
      } catch (error) {
        console.error('Error fetching contributors:', error);
      }
    },
  }};
</script>
