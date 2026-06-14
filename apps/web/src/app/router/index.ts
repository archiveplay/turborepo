import { createRouter, createWebHistory } from 'vue-router'
import { userRoute } from '@/pages/user/route'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [userRoute],
})

export default router
