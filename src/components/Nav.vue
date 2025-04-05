<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Brand/Logo -->
      <div class="navbar-brand">
        <router-link to="/" class="navbar-logo">
          <img src="/logo.png" alt="DevSkill Logo" />
        </router-link>
      </div>

      <!-- Single Navigation List with Dynamic Classes -->
      <ul :class="[
        'navbar-links',
        { 'navbar-links-mobile': menuOpen && isMobile },
        { 'navbar-open': menuOpen && isMobile }
      ]">
        <li><router-link to="/contributors" @click="closeMenu">Contributors</router-link></li>
        <li><router-link to="/repositories" @click="closeMenu">Repositories</router-link></li>
        <li><router-link to="/trending" @click="closeMenu">Trending</router-link></li>
        <li><router-link to="/extensions" @click="closeMenu">Extensions</router-link></li>
        <li><router-link to="/about" @click="closeMenu">About</router-link></li>
      </ul>

      <!-- Mobile Menu Toggle (Hamburger Icon) -->
      <div class="navbar-toggle" @click="toggleMenu" v-if="isMobile">
        <span class="navbar-toggle-icon">{{ menuOpen ? '✖' : '☰' }}</span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false,
      isMobile: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  },
};
</script>

<style scoped>
/* General Navbar Styles */
.navbar {
  background-color: #007bff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  z-index: 100;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  box-sizing: border-box;
  padding: 0;
}

/* Container for content with padding */
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 15px;
  box-sizing: border-box;
}

/* Desktop Navigation Links (Default State) */
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
  background-color: #1abc9c;
  transform: scale(1.05);
}

/* Mobile Menu Toggle (Hamburger Icon) */
.navbar-toggle {
  display: none;
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 110;
  background: none;
  border: none;
  padding: 5px;
}

.navbar-toggle-icon {
  font-size: 30px;
  color: white;
  padding: 10px;
}

/* Mobile Navigation Links */
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
  z-index: 102;
  opacity: 0;
  visibility: hidden;
  transform: translateX(100%);
  transition: all 0.3s ease-in-out;
  pointer-events: none;
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
  pointer-events: auto;
}

/* Media Query for Mobile Devices */
@media (max-width: 768px) {
  .navbar {
    width: 100vw;
    left: 0;
    right: 0;
  }

  .navbar-container {
    padding: 14px 0; /* Remove horizontal padding to align with content */
  }

  .navbar-links {
    display: none;
  }

  .navbar-toggle {
    display: block;
    right: 0; /* Align with the edge since padding is removed */
  }

  .navbar-links-mobile {
    display: flex;
  }
}

/* Logo Styling */
.navbar-brand img {
  height: 40px;
}
</style>