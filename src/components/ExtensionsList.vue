<template>
    <div class="extensions-table-container">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Extension</th>
              <th>Language</th>
              <th>File Count</th>
              <th>Repositories Using</th>
              <th>Most Recent Use</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="extension in extensions"
              :key="extension.name || 'extension-' + Math.random()"
              class="extension-row"
            >
              <td data-label="Extension">{{ extension.name || 'N/A' }}</td>
              <td data-label="Extension">{{ extension.language || 'N/A' }}</td>
              <td data-label="File Count">{{ extension.fileCount ?? '0' }}</td>
              <td data-label="Repositories Using">{{ extension.repoCount ?? '0' }}</td>
              <td data-label="Most Recent Use">{{ extension.lastUsed || 'N/A' }}</td>
              <td data-label="Actions">
                <button @click.stop="fetchDetails(extension)">View Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div class="pagination-controls">
        <button :disabled="currentPage === 0" @click="goToPage(currentPage - 1)">Previous</button>
        <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages - 1" @click="goToPage(currentPage + 1)">Next</button>
      </div>
  
      <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>Extension Details</h2>
          <div class="detail-section">
            <p><strong>Extension:</strong> {{ selectedExtension.name || 'N/A' }}</p>
            <p><strong>Total Files:</strong> {{ selectedExtension.fileCount ?? '0' }}</p>
            <p><strong>Repositories:</strong> {{ selectedExtension.repoCount ?? '0' }}</p>
            <p><strong>Last Used:</strong> {{ selectedExtension.lastUsed || 'N/A' }}</p>
          </div>
          <button @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      extensions: {
        type: Array,
        required: true,
        default: () => []
      },
      totalPages: {
        type: Number,
        required: true,
        default: 1
      },
      pageSize: {
        type: Number,
        required: true,
        default: 10
      },
      currentPage: {
        type: Number,
        required: true,
        default: 0
      }
    },
    data() {
      return {
        modalVisible: false,
        selectedExtension: null
      };
    },
    methods: {
      fetchDetails(extension) {
        this.selectedExtension = extension;
        this.modalVisible = true;
      },
      closeModal() {
        this.modalVisible = false;
        this.selectedExtension = null;
      },
      goToPage(pageNumber) {
        console.log(`Emitting goToPage event for page ${pageNumber}`);
        if (pageNumber >= 0 && pageNumber < this.totalPages) {
          this.$emit('goToPage', pageNumber);
        }
      }
    }
  };
  </script>
  
  <style scoped>
/* Container for the entire table */
.extensions-table-container {
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

@media (max-width: 800px) {
  .table-wrapper {
    overflow-x: hidden; /* Disable horizontal scrolling on mobile */
  }
}

table {
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
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
  padding: 6px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
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

.modal-content ul li, .modal-content div {
  color: #213547;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
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
@media (max-width: 800px) {
  table {
    min-width: unset !important; /* Force override */
    width: 100% !important;
    border-radius: 0; /* Remove border-radius from table in mobile */
    background-color: transparent; /* Background applied to tr instead */
  }

  th,
  td {
    padding: 8px 10px;
    font-size: 14px;
  }

  thead {
    display: none;
  }

  tr {
    display: block;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding: 15px 10px; /* Increased padding for better spacing */
    background-color: #fff; /* Moved from table to tr */
    border-radius: 4px; /* Moved from table to tr */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  td {
    display: flex; /* Use flexbox for better alignment */
    align-items: center; /* Vertically center content */
    text-align: right;
    position: relative;
    padding: 8px 10px; /* Adjusted padding */
    font-size: 14px;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal; /* Allow text to wrap */
    max-width: 100%; /* Ensure content doesn't overflow */
  }

  td:before {
    content: attr(data-label);
    flex: 0 0 50%; /* Increased width for label to accommodate longer text */
    text-align: left;
    font-weight: bold;
    font-size: 14px;
    white-space: normal; /* Allow label to wrap */
    overflow: visible; /* Ensure label is fully visible */
    text-overflow: clip; /* Prevent truncation of label */
  }

  /* Removed the separator between td elements */
  td:not(:last-child) {
    border-bottom: none; /* Remove the line between elements */
  }

  td:last-child {
    text-align: center;
    padding: 10px 0; /* Adjusted padding for the button */
  }

  td:last-child button {
    margin: 0 auto;
    padding: 6px 12px; /* Slightly larger button */
    font-size: 12px;
    max-width: 120px; /* Increased max-width for better fit */
  }

  button {
    padding: 6px 12px;
    font-size: 12px;
  }

  .pagination-controls {
    flex-wrap: wrap;
    gap: 5px;
    padding: 0 10px;
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

@media (max-width: 480px) {
  th,
  td {
    padding: 6px 8px;
    font-size: 12px;
  }

  td:before {
    flex: 0 0 45%; /* Slightly reduce label width on very small screens */
    font-size: 12px;
  }

  td:last-child button {
    max-width: 100px; /* Adjusted for smaller screens */
    padding: 5px 10px;
    font-size: 11px;
  }

  .pagination-controls button {
    padding: 3px 6px;
    font-size: 9px;
  }

  .pagination-controls span {
    font-size: 9px;
  }
}
</style>