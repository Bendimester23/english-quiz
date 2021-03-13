import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import SetName from '../views/SetName.vue'
import Dashboard from '../views/Dashboard.vue'
import Quiz from '../views/Quiz.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: `/setname`,
    name: `SetName`,
    component: SetName
  }, {
    path: `/dashboard`,
    name: `Dashboard`,
    component: Dashboard
  }, {
    path: `/quiz`,
    name: `Quiz`,
    component: Quiz
  }
]

const router = new VueRouter({
  routes
})

export default router
