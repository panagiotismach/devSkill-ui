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
            <th>Actions</th>
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
              <button @click.stop="showModal(contributor)">View Details</button>
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

    <!-- Modal for showing all repositories -->
    <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>All Repositories</h2>
        
        <ul v-if="selectedContributor && selectedContributor.repositories && selectedContributor.repositories.length > 0">
          <li v-for="repository in selectedContributor.repositories" :key="repository.repoName">{{ repository.repoName }}</li>
        </ul>
        <p v-else>Can not find any Repositories</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['contributors', 'totalPages', 'pageSize', 'currentPage'],
  data() {
    return {
      modalVisible: false,
      selectedContributor: null,
    };
  },
  methods: {
    selectContributor(contributorId) {
      this.$emit('selectContributor', contributorId);
    },
    showModal(contributor) {
      this.selectedContributor = contributor;
      this.fetchRepositoriesForContributor(contributor);  // Fetch repositories for the selected contributor
      this.modalVisible = true;
    },
    async fetchRepositoriesForContributor(contributor) {
      try {
        const response = await this.$axios.get(`http://localhost:8080/retrieveContributorsRepositories?conId=${contributor.id}`);
        // Store repositories inside selectedContributor
        this.selectedContributor.repositories = response.data.repositories;
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    },
    closeModal() {
      this.modalVisible = false;
      this.selectedContributor = null;  // Clear the selected contributor when closing the modal
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.$emit('goToPage', pageNumber);  // Trigger pagination update
      }
    },
  },
};
</script>

<style scoped>
/* Container for the entire table */
.contributor-table-container {
  width: 100%;
  margin: 0;
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

th, td {
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
  width: 450px;
  max-width: 90%;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.modal-content ul {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
  max-height: 200px;
  overflow-y: auto;
}

.modal-content li {
  padding: 8px 0;
  font-size: 16px;
  color: #555;
}

.modal-content button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #0056b3;
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

  th, td {
    padding: 8px 10px;
    font-size: 12px;
  }

  button {
    padding: 8px 16px;
    font-size: 12px;
  }

  .pagination-controls button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
