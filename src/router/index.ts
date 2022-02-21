import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Api from '../views/Api.vue'
import About from '../views/About.vue'
import Services from '../views/Services.vue'
import Portfolio from '../views/Portfolio.vue'
import GSCodeExample from '../views/GSCodeExample.vue'
import Wallets from '../views/Wallets.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
    {
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio
  },
  {
    path: '/api',
    name: 'Api',
    component: Api
  },
  {
    path: '/services',
    name: 'Services',
    component: Services
  },
  {
    path: '/wallets',
    name: 'Wallets',
    component: Wallets
  },
  {
    path: '/gscodeexample',
    name: 'GSCodeExample',
    component: GSCodeExample
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

