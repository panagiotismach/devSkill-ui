<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Brand/Logo -->
      <div class="navbar-brand">
        <router-link to="/repositories" class="navbar-logo"><img src="/logo.png" alt="Logo" /></router-link>
      </div>

      <!-- Navigation Links (Standard for larger screens) -->
      <ul :class="[ {'navbar-links': !menuOpen},{'navbar-links-mobile': menuOpen}, { 'navbar-open': menuOpen },]">
        <li><router-link to="/repositories">Repositories</router-link></li>
        <li><router-link to="/trending">Trending</router-link></li>
        <li><router-link to="/contributors">Contributors</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul>

      <!-- Mobile Menu Toggle -->
      <div class="navbar-toggle" @click="toggleMenu">
        <span class="navbar-toggle-icon">{{ menuOpen ? '✖' : '☰' }}</span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false, // Mobile menu state
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen; // Toggle mobile menu visibility
    },

  },
};
</script>

<style scoped>
/* General Navbar Styles */
.navbar {
  background-color: #509eec;
  padding: 14px 28px;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding-right: 30px;
}

/* Desktop and Mobile Links */
.navbar-links {
  list-style: none;
  display: flex;
  margin: 0;
}

.navbar-links li {
  margin-left: 30px;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  padding: 8px 14px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.navbar-links a:hover {
  background-color: #1abc9c; /* Hover color */
  transform: scale(1.05);
}

/* Mobile Menu */
.navbar-toggle {
  display: none;
  cursor: pointer;
  z-index: 101;
}

.navbar-toggle-icon {
  font-size: 30px;
}

.navbar-links-mobile {
  list-style: none;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #2c3e50;
  width: 100%;
  height: 100vh;
  padding: 60px 20px;
  box-sizing: border-box;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateX(100%);
  transition: all 0.3s ease-in-out;
}

.navbar-links-mobile li {
  margin-bottom: 30px;
}

.navbar-links-mobile a {
  color: white;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  padding: 15px 0;
  transition: background-color 0.3s ease;
}

.navbar-links-mobile a:hover {
  background-color: #16a085;
}

/* Show Mobile Menu when open */
.navbar-links-mobile.navbar-open {
  opacity: 1;
  visibility: visible;
  transform: translateX(0%);
}

/* Media Query for Mobile Devices */
@media (max-width: 768px) {

  .navbar-links{
    display: none;
  }

  .navbar-toggle {
    display: block; /* Show the mobile toggle */
  }
}
</style>
