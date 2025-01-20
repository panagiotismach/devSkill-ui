<template>
    <Nav></Nav>
    <div class="page-container">
      <div class="content-center">
        <img src="/404.png" alt="404 Not Found" class="error-image" />
        <p class="error-message">Oops! The page you're looking for doesn't exist.</p>
        <button @click="goHome" class="home-button">Go to Home</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goHome() {
        this.$router.push('/'); // Redirect to the home route
      },
    },
  };
  </script>
  
  <style scoped>
  /* Overall Page Container */
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    text-align: center;
    font-family: 'Arial', sans-serif;
    background-color: #ffffff; /* White background */
  }
  
  /* Content Center Alignment */
  .content-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  /* Error Image */
  .error-image {
    max-width: 400px; /* Restrict image size for better layout */
    width: 80%; /* Ensure responsiveness */
    height: auto; /* Maintain aspect ratio */
    margin-bottom: 20px; /* Space between image and text */
  }
  
  /* Error Message */
  .error-message {
    font-size: 18px;
    color: #555; /* Subtle text color */
    margin-bottom: 20px;
    line-height: 1.5;
  }
  
  /* Home Button */
  .home-button {
    padding: 12px 24px;
    background-color: #007bff; /* Primary blue color */
    color: white;
    border: none;
    border-radius: 25px; /* Rounded button for modern look */
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  .home-button:hover {
    background-color: #0056b3; /* Darker blue for hover effect */
    transform: scale(1.05); /* Slight zoom effect on hover */
  }
  
  .home-button:active {
    transform: scale(0.95); /* Button press effect */
  }
  </style>
  