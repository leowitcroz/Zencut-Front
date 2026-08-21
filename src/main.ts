import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/theme.scss'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'

// Se um chunk lazy (rota ainda não visitada nesta sessão) já foi apagado do
// servidor por um deploy mais novo, o import dinâmico falha e a navegação
// trava sem erro visível pra quem está usando. Um reload único resolve —
// busca o index.html + os hashes atuais de novo. O sessionStorage evita
// loop infinito caso o problema seja outra coisa.
window.addEventListener('vite:preloadError', () => {
  if (sessionStorage.getItem('reload_apos_preload_error')) return;
  sessionStorage.setItem('reload_apos_preload_error', '1');
  window.location.reload();
});

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Só monta depois que a navegação inicial (com o guard assíncrono do router)
// termina — sem isso, o App.vue chega a renderizar um instante com o layout
// padrão (MainLayout, com o menu) antes da rota real ser resolvida.
router.isReady().then(() => {
  app.mount('#app')
  // Montou com sucesso — libera o reload automático pra poder agir de novo
  // numa falha futura genuína (não é a mesma que acabou de ser recuperada).
  sessionStorage.removeItem('reload_apos_preload_error');
})
