import { createApp } from 'vue'
import App from './App.vue'
import { setupDirectives } from './directives'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupGlobalDiscreteApi } from './utils'
import '@arco-design/web-vue/dist/arco.css'
import 'nprogress/nprogress.css'
import '@/styles/reset.css'
import '@/styles/global.css'
import 'uno.css'

async function bootstrap() {
  const app = createApp(App)
  setupStore(app)
  setupDirectives(app)
  await setupRouter(app)
  app.mount('#app')
  setupGlobalDiscreteApi()
}

bootstrap()
