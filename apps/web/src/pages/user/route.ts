import type { RouteRecordRaw } from 'vue-router'

export const userRoute: RouteRecordRaw = {
  path: '/user/:id',
  name: 'user',
  props: (route) => ({
    id: Number(route.params.id),
  }),
  component: () => import('./ui/UserPage.vue'),
}
