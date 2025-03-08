<template>
  <div class="repo-table-container">
    <!-- Wrapper for horizontal scrolling -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Url</th>
            <th>Creation Date</th>
            <th>Last Commit Date</th>
            <th>Extensions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="repo in this.repositories"
            :key="repo.id"
            class="repo-row"
          >
            <td>{{ repo.repoName }}</td>
            <td>{{ repo.repoUrl }}</td>
            <td>{{ repo.creation_date }}</td>
            <td>{{ repo.last_commit_date }}</td>
            <td>
              <!-- Show only the first 10 extensions -->
              {{ repo.extensions?.slice(0, 10).join(', ') }}
              <span v-if="repo?.extensions?.length > 10">... <a href="#" @click.stop="showModal(repo)">See All</a></span>
            </td>
            <td>
              <button @click.stop="fetchContributors(repo)">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button :disabled="currentPage === 0" @click="goToPage(currentPage - 1)">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages - 1 }}</span>
      <button :disabled="currentPage === totalPages - 1" @click="goToPage(currentPage + 1)">Next</button>
    </div>

    <!-- Modal for showing all extensions -->
    <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2 v-if="modalType === 'extensions'">All Extensions</h2>
        <h2 v-if="modalType === 'contributors'">Contributors</h2>
        <div v-if="modalType === 'extensions'">
          {{ selectedRepo.extensions }}
        </div>
        <ul v-if="modalType === 'contributors'">
          <li v-for="contributor in this.selectedRepo.contributors" :key="contributor.id">
            {{ contributor.fullName }}
          </li>
        </ul>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['repositories', 'totalPages', 'pageSize', 'currentPage'],
  data() {
    return {
      modalVisible: false,
      selectedRepo: null,
      modalType: '', // 'extensions' or 'contributors'
    };
  },
  methods: {
    async fetchContributors(repo) {
      this.selectedRepo = repo;
      this.modalType = 'contributors';
      this.modalVisible = true;

      try {
        const response = await this.$axios.get(`/retrieveContributorsForRepository?repoId=${this.selectedRepo.id}`);
        this.selectedRepo.contributors = response.data.contributors;
      } catch (error) {
        console.error('Failed to fetch contributors:', error);
        this.contributors = [];
      }
    },
    showModal(repo) {
      this.selectedRepo = repo;
      this.modalType = 'extensions';
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
      this.selectedRepo = null;
      this.contributors = [];
    },
    goToPage(pageNumber) {
      if (pageNumber >= 0 && pageNumber < this.totalPages) {
        // Emit the new page number to parent component to update `currentPage`
        this.$emit('goToPage', pageNumber);
      }
    },
  },
};
</script>


<style scoped>
/* Container for the entire table */
.repo-table-container {
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
  min-width: 1200px;
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
    min-width: 1000px;
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
