import type { RouteRecordRaw } from 'vue-router'

export const userRoute: RouteRecordRaw = {
  path: '/user/:id',
  name: 'user',
  component: () => import('./ui/UserPage.vue'),
}
