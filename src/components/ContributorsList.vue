<template>
  <div class="contributor-table-container">
    <!-- Wrapper for horizontal scrolling -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Github Username</th>
            <th>Email</th>
            <th>Repositories</th>
            <th>Contributions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contributor in contributors"
            :key="contributor.id"
            @click="selectContributor(contributor.id)"
            class="contributor-row"
          >
            <td>{{ contributor.fullName }}</td>
            <td>{{ contributor.githubUsername }}</td>
            <td>{{ contributor.email }}</td>
            <td>
              <button @click.stop="showModal(contributor, 'repositories')">View Details</button>
            </td>
            <td>
              <button @click.stop="showModal(contributor, 'contributions')">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Next</button>
    </div>

    <!-- Modal for showing details -->
    <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div v-if="type == 'repositories'">
          <h2>All Repositories</h2>
          <ul v-if="selectedContributor?.repositories?.length">
            <li v-for="repository in selectedContributor.repositories" :key="repository.repoName">
              {{ repository.repoName }}
            </li>
          </ul>
          <p v-else>No repositories found.</p>
        </div>
        <div v-else>
          <h2>Contributions ({{ selectedContributor?.contributions.length }})</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Extensions</th>
                  <th>Insertions</th>
                  <th>Deletions</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(contribution, index) in selectedContributor?.contributions || []" :key="index">
                  <td>{{ selectedContributor.email }}</td>
                  <td>{{ contribution[0] }}</td>
                  <td>{{ contribution[1] }}</td>
                  <td>{{ contribution[2] }}</td>
                  <td>{{ contribution[3] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Chart :languages="true" :type="'contributions'" :contributions="selectedContributor?.contributions" />
        </div>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>

import Chart from './Chart.vue';

export default {
  props: ['contributors', 'totalPages', 'pageSize', 'currentPage'],
  components: {Chart},
  data() {
    return {
      modalVisible: false,
      selectedContributor: null,
      type: ''
    };
  },
  methods: {
    selectContributor(contributorId) {
      this.$emit('selectContributor', contributorId);
    },
    showModal(contributor, type) {
      this.selectedContributor = contributor;
      if (type == 'repositories') {
        this.fetchRepositoriesForContributor(contributor);
      } else {
        this.fetchContributionsPerContributor(contributor);
      }
      this.type = type;
      this.modalVisible = true;
    },
    async fetchRepositoriesForContributor(contributor) {
      try {
        const response = await this.$axios.get(`/retrieveContributorsRepositories?conId=${contributor.id}`);
        this.selectedContributor.repositories = response.data.repositories;
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    },
    async fetchContributionsPerContributor(contributor) {
      try {
        const response = await this.$axios.get(`/findContributionsPerContributor?conId=${contributor.id}`);
        this.selectedContributor.contributions = response.data;
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    },
    closeModal() {
      this.modalVisible = false;
      this.selectedContributor = null;
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.$emit('goToPage', pageNumber);
      }
    },
  },
};
</script>

<style scoped>
/* Container for the entire table */
.contributor-table-container {
  width: 100%;
  padding: 20px 0;
  box-sizing: border-box;
}

/* Wrapper for horizontal scrolling */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 20px;
}

table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

thead {
  background-color: #f4f6f9;
  color: #333;
  font-size: 16px;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
}

td {
  font-size: 14px;
  color: #555;
}

tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}

/* Button Styles */
button {
  padding: 6px 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 900px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  max-height: 80vh; /* Limits the modal height to 80% of viewport height */
  overflow-y: auto; /* Allows modal to scroll vertically if content overflows */
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

/* Remove bullets from li in the repositories modal */
.modal-content ul {
  list-style-type: none; /* Removes the bullets */
  padding-left: 0; /* Removes default padding to align with the container */
}

/* Ensure the contributions table in the modal has vertical scrolling */
.table-container {
  max-height: 60vh; /* Sets a maximum height for the table container */
  overflow-y: auto; /* Enables vertical scrolling for the table container */
}

.modal-content table {
  width: 100%; /* Ensures the table takes full width */
  border-collapse: collapse;
  min-width: 600px; /* Minimum width to trigger horizontal scrolling if content is wide */
}

.modal-content th,
.modal-content td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap; /* Prevents text wrapping */
}

.modal-content thead {
  background-color: #f4f4f4;
}

.modal-content button {
  margin-top: 10px;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-controls button {
  padding: 8px 16px;
  margin: 0 5px;
  font-size: 14px;
}

.pagination-controls span {
  font-size: 14px;
  align-self: center;
}

/* Responsive Styles */
@media (max-width: 768px) {
  table {
    min-width: 600px;
  }

  .modal-content table {
    min-width: 400px; /* Adjust minimum width for smaller screens */
  }

  th,
  td {
    padding: 8px 10px;
    font-size: 12px;
  }

  .modal-content {
    max-height: 90vh; /* Adjust modal height for smaller screens */
  }

  .table-container {
    max-height: 50vh; /* Adjust table container height for smaller screens */
  }
}
</style>