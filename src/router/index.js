import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RoomView from '../views/RoomView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/room/:id',
    name: 'room',
    component: RoomView
  },
]

const router = new VueRouter({
  base: import.meta.env.BASE_URL,
  routes
})

export default router
