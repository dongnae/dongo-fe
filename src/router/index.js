import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Survey from "@/views/Survey";
import Admin from "@/views/Admin";
import ErrorPage from "@/views/ErrorPage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/survey/:id',
    name: 'Survey',
    component: Survey,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/*',
    name: 'Error',
    component: ErrorPage,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
