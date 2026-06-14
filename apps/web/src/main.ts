import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './app/router'
import App from './app/App.vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, {
  queryClient: new QueryClient(),
})

app.mount('#app')
