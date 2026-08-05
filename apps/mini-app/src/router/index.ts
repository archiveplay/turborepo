import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from '@/pages/IndexPage.vue';
import InitDataPage from '@/pages/InitDataPage.vue';
import ThemeParamsPage from '@/pages/ThemeParamsPage.vue';
import LaunchParamsPage from '@/pages/LaunchParamsPage.vue';
import TonConnectPage from '@/pages/TonConnectPage.vue';
import IconTonConnect from '@/components/IconTonConnect.vue';
import ApiRequestPage from '@/pages/ApiRequestPage.vue';

export const routes = [
  {
    path: '/',
    name: 'index',
    component: IndexPage,
  },
  {
    path: '/init-data',
    name: 'init-data',
    component: InitDataPage,
    meta: {
      title: 'Init Data',
    },
  },
  {
    path: '/theme-params',
    name: 'theme-params',
    component: ThemeParamsPage,
    meta: {
      title: 'Theme Params',
    },
  },
  {
    path: '/launch-params',
    name: 'launch-params',
    component: LaunchParamsPage,
    meta: {
      title: 'Launch Params',
    },
  },
  {
    path: '/ton-connect',
    name: 'ton-connect',
    component: TonConnectPage,
    meta: {
      icon: IconTonConnect,
      title: 'TON Connect',
    },
  },
  {
    path: '/api-request',
    name: 'api-request',
    component: ApiRequestPage,
    meta: {
      title: 'API request check',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
