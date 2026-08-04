import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/theme.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Só monta depois que a navegação inicial (com o guard assíncrono do router)
// termina — sem isso, o App.vue chega a renderizar um instante com o layout
// padrão (MainLayout, com o menu) antes da rota real ser resolvida.
router.isReady().then(() => {
  app.mount('#app')
})
