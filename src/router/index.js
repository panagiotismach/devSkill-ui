import { createRouter, createWebHistory } from 'vue-router';
import Repositories from '../components/Repositories.vue';
import About from '../components/About.vue';
import Contributors from '../components/Contributors.vue';
import error404 from '../components/404.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Repositories,
  },
  {
    path: '/repositories',
    name: 'Repositories',
    component: Repositories,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/contributors',
    name: 'Contributors',
    component: Contributors,
  },
  {
    path: '/trending',
    name: 'Trending',
    component: Repositories,
    props: { isTrending: true }, // Pass a static prop
  },
  {
    path: '/404',
    name: 'error404',
    component: error404,
  },
  {
    // Catch-all route for undefined paths
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: error404,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;  // Make sure this line is here to export the router
