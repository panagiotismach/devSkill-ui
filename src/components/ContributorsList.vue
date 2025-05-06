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
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contributor in contributors"
            :key="contributor.id"
            @click="selectContributor(contributor.id)"
            class="contributor-row"
          >
            <td data-label="Name">{{ contributor.fullName }}</td>
            <td data-label="Github Username">{{ contributor.githubUsername }}</td>
            <td data-label="Email">{{ contributor.email }}</td>
            <td data-label="Repositories">
              <button @click.stop="showModal(contributor, 'repositories')">View Details</button>
            </td>
            <td data-label="Changes">
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
          <h2>Changes ({{ selectedContributor?.contributions.length }})</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Extensions</th>
                  <th>Language</th>
                  <th>Insertions</th>
                  <th>Deletions</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(contribution, index) in selectedContributor?.mappedContributions || []" :key="index">
                  <td>{{ selectedContributor.email }}</td>
                  <td data-label="Extensions">{{ contribution[0] }}</td>
                  <td data-label="Language">{{ contribution[4] }}</td>
                  <td data-label="Insertions">{{ contribution[1] }}</td>
                  <td data-label="Deletions">{{ contribution[2] }}</td>
                  <td data-label="Total">{{ contribution[3] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Chart :languages="true" :type="'contributions'" :contributions="selectedContributor?.contributions" :header="'Top 5 Extensions by Contributions'"/>
        </div>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from './Chart.vue';
import * as langmap from "lang-map";

export default {
  props: ['contributors', 'totalPages', 'pageSize', 'currentPage'],
  components: { Chart },
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

        this.selectedContributor.contributions = response.data

        this.selectedContributor.mappedContributions = response.data.map((contribution) => {
        const language = langmap.languages(contribution[0]); // Map extension to language
        return [
          contribution[0], // Extension
          contribution[1], // Insertions
          contribution[2], // Deletions
          contribution[3], // Total
          language ? language[0] : "Unknown" // Add language as the 5th element
        ];
    });

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

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
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
  padding: 15px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px; /* Reduced max-width for smaller modal */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-height: 60vh; /* Reduced max-height for smaller modal */
  overflow-y: auto;
  box-sizing: border-box;
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

/* Remove bullets from li in the repositories modal */
.modal-content ul {
  list-style-type: none;
  padding-left: 0;
}

.modal-content ul li {
  color: #213547; /* Dark gray for contrast against white background */
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
}

/* Ensure the contributions table in the modal has vertical and horizontal scrolling */
.table-container {
  max-height: 40vh; /* Reduced height to fit smaller modal */
  overflow-y: auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Modal table styling with fixed width for horizontal scroll */
.modal-content table {
  width: 1000px; /* Fixed width larger than modal to force horizontal scroll */
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: none;
}

/* Basic cell styling */
.modal-content th,
.modal-content td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
  white-space: nowrap;
}

/* Basic header styling */
.modal-content thead {
  background-color: #f4f4f4;
  color: #333;
}

/* Remove extra styling for rows */
.modal-content tr {
  background-color: transparent;
}

/* Ensure buttons in modal are unaffected */
.modal-content button {
  margin-top: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
}

.pagination-controls button {
  padding: 8px 16px;
  margin: 0 5px;
  font-size: 14px;
}

.pagination-controls span {
  font-size: 14px;
  align-self: center;
  padding: 0 5px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .contributor-table-container {
    padding: 10px 0;
  }

  .table-wrapper {
    overflow-x: hidden;
  }

  table {
    min-width: unset;
    width: 100%;
    display: block;
  }

  thead {
    display: none;
  }

  tr {
    display: block;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding: 15px 10px;
  }

  td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    position: relative;
    padding: 8px 10px;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
    color: #555;
  }

  td:before {
    content: attr(data-label);
    font-weight: bold;
    font-size: 14px;
    color: #333;
    flex: 0 0 40%;
    text-align: left;
  }

  td:last-child,
  td:nth-last-child(2) {
    justify-content: center;
    padding: 8px 10px;
  }

  td:last-child button,
  td:nth-last-child(2) button {
    margin: 5px 0;
    width: 100%;
    max-width: 200px;
  }

  th,
  td {
    font-size: 12px;
  }

  .modal-content {
    width: 95%;
    max-width: 500px; /* Smaller max-width for mobile */
    max-height: 70vh; /* Slightly larger height for mobile usability */
    padding: 10px;
  }

  .modal-content h2 {
    font-size: 16px;
    margin-bottom: 8px;
  }

  /* Modal table maintains fixed width for horizontal scroll */
  .modal-content table {
    width: 1000px; /* Keep fixed width for horizontal scroll */
    display: table;
  }

  .modal-content thead {
    display: table-header-group;
  }

  .modal-content tr {
    display: table-row;
  }

  .modal-content td {
    display: table-cell;
    padding: 6px;
    font-size: 12px;
    white-space: nowrap;
    border: 1px solid #ddd;
  }

  .modal-content td:before {
    content: none;
  }

  .table-container {
    max-height: 35vh; /* Reduced height for smaller modal on mobile */
    overflow-x: auto;
  }

  .pagination-controls {
    flex-wrap: wrap;
    gap: 5px;
    padding: 0 10px;
    justify-content: center;
  }

  .pagination-controls button {
    padding: 4px 8px;
    font-size: 10px;
    margin: 0;
  }

  .pagination-controls span {
    font-size: 10px;
    padding: 0 5px;
  }
}
</style>