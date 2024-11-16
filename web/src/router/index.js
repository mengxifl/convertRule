import { config } from '@/configs/api.js'
import { createRouter, createWebHistory } from 'vue-router'
import convert from './convert.js'


const routes = [
  convert,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})




export default router
