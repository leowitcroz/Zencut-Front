import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';

// Calculado uma vez, no carregamento da página — o hostname já é o certo
// nesse momento (cada domínio/subdomínio carrega sua própria instância do app).
const hostnameInicial = window.location.hostname;
const ehDominioPrincipalInicial = hostnameInicial === 'zencut.com.br' || hostnameInicial === 'www.zencut.com.br' || hostnameInicial === 'localhost';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../views/Login.vue'),
      meta: { layout: 'AuthLayout', guest: true }
    },
    // 🟢 Rota para CLIENTES da Barbearia criarem suas contas
    {
      path: '/registro',
      component: () => import('../views/RegistroCliente.vue'),
      meta: { layout: 'AuthLayout', guest: true }
    },
    // 🟢 Rota do Painel do Cliente Final
    {
      path: '/meu-perfil',
      component: () => import('../views/cliente/PerfilCliente.vue'),
      meta: { layout: 'ClientLayout', auth: true } // Usa AuthLayout para esconder o menu lateral do sistema
    },
    {
      path: '/horarios',
      component: () => import('../views/Horarios.vue'),
      meta: { layout: 'MainLayout', auth: true }
    },
    {
      path: '/home',
      component: () => import('../views/Home.vue'),
      meta: { layout: 'MainLayout', auth: true }
    },
    {
      path: '/adm/lojas',
      component: () => import('../views/adm/GestaoLojas.vue'),
      meta: { layout: 'MainLayout', auth: true }
    },
    {
      path: '/financeiro',
      component: () => import('../views/Financeiro.vue'),
      meta: { layout: 'MainLayout', auth: true }
    },
    {
      path: '/estoque',
      component: () => import('../views/Estoque.vue'),
      meta: { layout: 'MainLayout', auth: true }
    },
    {
      path: '/planos',
      component: () => import('../views/Planos.vue'),
      meta: { layout: 'MainLayout', auth: true }
    },
    {
      path: '/agendamentos',
      component: () => import('../views/Agendamentos.vue'),
      meta: { layout: 'MainLayout', auth: true }
    },
    {
      path: '/perfil',
      component: () => import('../views/MeuPerfil.vue'),
      meta: { layout: 'MainLayout', auth: true }
    },
    // Raiz do site: no domínio principal é a landing da ZenCut (propaganda da
    // plataforma); em cada subdomínio de loja é a landing pública DAQUELA
    // barbearia (vitrine pros clientes dela, antes de logar). Ver beforeEach.
    {
      path: '/',
      component: ehDominioPrincipalInicial
        ? () => import('../views/Landing.vue')
        : () => import('../views/LandingLoja.vue'),
      meta: { layout: 'PublicLayout' }
    }
  ]
});



// Middleware de Proteção (O Segurança da Porta)
router.beforeEach(async (to, from, next) => {



  const hostname = window.location.hostname;
  const isMainDomain = hostname === 'zencut.com.br' || hostname === 'www.zencut.com.br' || hostname === 'localhost';

  // 🛑 1. SE FOR O DOMÍNIO PRINCIPAL: segue (a landing page e o /login vivem aqui)
  if (isMainDomain) {
    // nada a validar — domínio principal não pertence a nenhuma loja específica
  }

  // 🛑 2. SE FOR UM SUBDOMÍNIO: Valida na API antes de mostrar qualquer coisa!
  else {
    // Pega a primeira parte da URL (ex: 'car' de car.localhost)
    const subdomain = hostname.split('.')[0];
    const tenantValidado = sessionStorage.getItem(`tenant_valido_${subdomain}`);

    // Detecta se estamos em desenvolvimento para definir a URL de "fuga" em caso de erro
    const isDev = import.meta.env.DEV || hostname.includes('localhost');
    const portaAtual = window.location.port ? `:${window.location.port}` : '';
    const fallbackUrl = isDev ? `http://localhost${portaAtual}` : 'https://zencut.com.br';

    if (!tenantValidado) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/tenants/info/${subdomain}`);

        if (!response.ok) {
          // Se o tenant não existe, joga para a URL correta dependendo do ambiente
          window.location.href = fallbackUrl;
          return;
        }

        // Se deu 200, o tenant existe! Salva na sessão
        sessionStorage.setItem(`tenant_valido_${subdomain}`, 'true');

        const info = await response.json();
        // Guarda também se é a própria loja do dono da plataforma (ex: subdomínio
        // "plataforma") — usado pra barrar o /registro nesse subdomínio específico.
        sessionStorage.setItem(`tenant_plataforma_${subdomain}`, info?.ehPlataformaPropria ? 'true' : 'false');

      } catch (error) {
        console.error("Erro ao validar tenant no router:", error);
        // Em caso de erro na rede ou API fora do ar, joga para a raiz correta
        window.location.href = fallbackUrl;
        return;
      }
    }
  }



  // 1. O TRUQUE MÁGICO: Se vier token pela URL no redirecionamento, salva no cookie da casa nova!
  if (to.query.sync_token) {
    // Extrai os valores com segurança garantindo que sejam Strings (evitando o erro do TypeScript)
    const syncToken = Array.isArray(to.query.sync_token) ? to.query.sync_token[0] : to.query.sync_token;
    const syncTenant = Array.isArray(to.query.sync_tenant) ? to.query.sync_tenant[0] : to.query.sync_tenant;

    if (syncToken && syncTenant) {
      Cookies.set('access_token', syncToken as string, { expires: 7 });
      Cookies.set('tenant_id', syncTenant as string, { expires: 7 });
    }

    if (to.query.sync_features) {
      const features = Array.isArray(to.query.sync_features) ? to.query.sync_features[0] : to.query.sync_features;
      if (features) {
        const decodedFeatures = decodeURIComponent(features as string);
        localStorage.setItem('tenant_features', decodedFeatures);
      }
    }

    // Limpa a URL para esconder o token e recarrega a página limpa
    return next({ path: to.path, query: {} });
  }

  // 2. Lê direto do cookie
  const token = Cookies.get('access_token');
  const isAuthenticated = !!token;

  // 🧠 CÉREBRO DO GUARD: Descobre quem é o usuário logado lendo o Token
  let isCliente = false;
  let isFuncionarioComum = false; // role=2: só pode ver o próprio perfil/agenda/financeiro
  if (isAuthenticated && token) {
    try {
      const parts = token.split('.');

      // Verificamos se o pedaço do meio realmente existe para acalmar o TypeScript
      if (parts.length >= 2 && parts[1]) {
        // O "as string" dá a garantia final que o atob() precisa
        const payload = JSON.parse(atob(parts[1] as string));
        isCliente = payload.userType === 'CLIENTE';
        isFuncionarioComum = payload.tipo === 'FUNCIONARIO' && payload.role === 2;
      }
    } catch (e) {
      console.error("Erro ao decodificar token JWT", e);
    }
  }
  // 2.1 Raiz do site: pra visitante não-logado, mostra a landing certa (da
  // ZenCut no domínio principal, ou da própria loja no subdomínio dela).
  // Usuário já autenticado sempre cai direto no painel dele.
  if (to.path === '/') {
    if (isAuthenticated) {
      return next(isCliente ? '/meu-perfil' : '/home');
    }
    if (!isMainDomain) {
      const subdomain = hostname.split('.')[0];
      const isSubdominioReservado = subdomain === 'adm' || subdomain === 'admin';
      const ehPlataformaPropria = sessionStorage.getItem(`tenant_plataforma_${subdomain}`) === 'true';
      // Subdomínio "adm"/"admin" ou a própria loja do dono da plataforma não têm
      // vitrine de cliente — continua indo direto pro login, como antes.
      if (isSubdominioReservado || ehPlataformaPropria) {
        return next('/home');
      }
    }
    return next();
  }

  // 2.2 Cadastro de cliente final (/registro) só existe dentro do subdomínio de uma
  // barbearia cliente de verdade — é o cliente dela se cadastrando, não uma barbearia
  // nova se cadastrando na plataforma. Barbearia nova é sempre via contato comercial
  // (ver Landing.vue). O subdomínio da própria loja do dono da plataforma (ex:
  // "plataforma") também não conta como barbearia cliente.
  if (to.path === '/registro') {
    const subdomain = hostname.split('.')[0];
    const ehPlataformaPropria = !isMainDomain && sessionStorage.getItem(`tenant_plataforma_${subdomain}`) === 'true';
    if (isMainDomain || ehPlataformaPropria) {
      return next('/login');
    }
  }

  // 3. Regras de Entrada e Blindagem
  if (to.meta.auth && !isAuthenticated) {
    // Tenta ir pra rota protegida sem token -> Chuta pro Login
    next('/login');
  }
  else if (to.meta.guest && isAuthenticated) {
    // Tenta ir pro Login já tendo token -> Redirecionamento Inteligente!
    next(isCliente ? '/meu-perfil' : '/home');
  }
  else if (isAuthenticated && isCliente && to.meta.layout === 'MainLayout') {
    // 🛡️ SEGURANÇA MÁXIMA: Se o CLIENTE tentar acessar /home ou /financeiro (que usam MainLayout),
    // ele é chutado imediatamente de volta para o perfil dele!
    next('/meu-perfil');
  }
  else if (isAuthenticated && isFuncionarioComum && to.path !== '/perfil') {
    // 🛡️ Funcionário comum (role 2) só enxerga "Meu Perfil" (que já tem as abas
    // de Agendamentos e Financeiro DELE). Dashboard, Agenda geral, Planos e
    // Financeiro da loja são exclusivos do Dono/Admin.
    next('/perfil');
  }
  else {
    next();
  }
});

export default router;