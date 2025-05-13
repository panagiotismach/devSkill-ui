import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import axios from 'axios'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faFilter, faTimesCircle, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { API_BASE_URL } from './config.ts'

// Add FontAwesome icons in a single call
library.add(faSearch, faFilter, faTimesCircle, faSort, faSortUp, faSortDown)

// Create app instance
const app = createApp(App)

// Global component registrations
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('PulseLoader', PulseLoader) // Still suggesting kebab-case for consistency

// Configure axios with base URL
axios.defaults.baseURL = API_BASE_URL
app.config.globalProperties.$axios = axios // Keeping your preferred $axios

// Use plugins
app.use(router)

// Mount app
app.mount('#app')