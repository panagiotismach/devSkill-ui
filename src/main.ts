import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'; 
import axios from 'axios';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Adding FontAwesome icon to the library
library.add(faSearch);
library.add(faFilter);

const app = createApp(App);

// Registering FontAwesome component globally
app.component('font-awesome-icon', FontAwesomeIcon);

// Registering the PulseLoader component globally
app.component('PulseLoader', PulseLoader); // Access PulseLoader as a property of VueSpinner

// Using the router
app.use(router);

// Make axios globally available in the app
app.config.globalProperties.$axios = axios;

app.mount('#app');
