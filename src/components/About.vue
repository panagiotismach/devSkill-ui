<template>
  <div class="about-page">
    <h1 class="page-title">About Open Source Repositories</h1>
    <p class="intro">
      Welcome to the <strong>Open Source Repositories</strong> platform! 
      This project is designed to help developers and contributors explore, 
      manage, and interact with open-source repositories from around the world.
    </p>

    <h2 class="section-title">Features</h2>
    <ul class="feature-list">
      <li>Search for repositories by name, technology, or other criteria.</li>
      <li>View detailed information about each repository, including creation date, last commit, and file extensions.</li>
      <li>Navigate through repositories effortlessly with pagination controls.</li>
      <li>Explore contributors for selected repositories.</li>
    </ul>

    <h2 class="section-title">Mission</h2>
    <p class="content">
      Our mission is to make open-source projects more accessible to developers worldwide.
      By offering a platform to discover repositories and engage with contributors, 
      we strive to encourage collaboration and innovation in the open-source community.
    </p>

    <h2 class="section-title">Recognition of Developer Skills through Mining Open Source Repositories</h2>
    <p class="content">
      Open-source repositories host a multitude of both private and collaborative projects from a vast portion of the developer community. 
      This makes them a valuable source for recognizing developers in the job market. 
      Theses in this field aim to develop automated methods for extracting developer skills through the projects and code they contribute to, 
      as well as identifying trends in the field.
    </p>

    <h2 class="section-title">Acknowledgment</h2>
    <p class="content">
      This application was implemented by <strong>Panagiotis Machairas</strong> 
      as part of his Master’s thesis for the 
      <strong>Master’s Degree in Software Development</strong> 
      at the <strong>University of Macedonia</strong>.
    </p>

    <div class="publication-container">
      <button class="btn-primary" @click="showPublication">View Publication</button>
    </div>

    <!-- Modal for Publication -->
    <div v-if="isModalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">Publication</h2>
        <p class="modal-text">
          This thesis focuses on recognizing developer skills through the mining of open-source repositories. 
          It explores automated methods for extracting skills through the projects and code that developers contribute to, 
          as well as trends emerging within the open-source ecosystem.
        </p>
        <button class="btn-secondary" @click="closeModal">Close</button>
      </div>
    </div>

    <router-link to="/" class="back-link">Back to Home</router-link>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  data() {
    return {
      isModalVisible: false,
    };
  },
  methods: {
    showPublication() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
};
</script>

<style scoped>
/* Page layout */
.about-page {
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
  color: #333;
  background: linear-gradient(135deg, #f3f4f6 0%, #e1e8f0 100%);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Title and Section Styles */
.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #34495e;
  margin-top: 40px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.intro, .content {
  font-size: 18px;
  color: #555;
  line-height: 1.7;
  margin-bottom: 30px;
}

.feature-list {
  list-style-type: disc;
  margin-left: 30px;
  font-size: 18px;
  color: #555;
}

.feature-list li {
  padding-bottom: 10px;
}

/* Buttons */
.btn-primary {
  background-color: #3498db;
  color: white;
  padding: 14px 30px;
  font-size: 18px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-3px);
}

.btn-primary:active {
  transform: translateY(2px);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
  padding: 12px 25px;
  font-size: 16px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  transform: translateY(-3px);
}

.btn-secondary:active {
  transform: translateY(2px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: #fff;
  padding: 40px;
  border-radius: 10px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: modalAnimation 0.5s ease-in-out;
}

.modal-title {
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 20px;
}

.modal-text {
  font-size: 18px;
  color: #555;
  line-height: 1.7;
}

@keyframes modalAnimation {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Link Style */
.back-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 18px;
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 15px;
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

.back-link:hover {
  background-color: #ecf0f1;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .about-page {
    padding: 20px;
  }

  .page-title {
    font-size: 32px;
  }

  .section-title {
    font-size: 24px;
  }

  .feature-list {
    font-size: 16px;
  }

  .btn-primary {
    padding: 12px 25px;
    font-size: 16px;
  }

  .btn-secondary {
    padding: 10px 20px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .about-page {
    padding: 20px;
  }

  .page-title {
    font-size: 28px;
  }

  .section-title {
    font-size: 22px;
  }

  .feature-list {
    font-size: 14px;
  }

  .modal-content {
    width: 90%;
    padding: 20px;
  }

  .modal-title {
    font-size: 22px;
  }

  .modal-text {
    font-size: 16px;
  }

  .btn-primary {
    padding: 12px 25px;
    font-size: 16px;
  }

  .btn-secondary {
    padding: 10px 20px;
    font-size: 14px;
  }

  .back-link {
    font-size: 16px;
  }
}
</style>
