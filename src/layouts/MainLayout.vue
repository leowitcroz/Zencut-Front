<template>
    <div class="d-flex" :class="{ 'tenant-themed': !isSuperAdmin }" :style="temaInlineStyle" style="min-height: 100vh;">
        <!-- SIDEBAR FIXA (telas médias/grandes) -->
        <div class="bg-dark text-white d-none d-md-block" style="width: 250px; flex-shrink: 0;">
            <div class="p-3 text-center border-bottom border-secondary">
                <h4 v-if="isSuperAdmin" class="fw-bold m-0"><ZenCutLogo variant="light" /></h4>
                <h4 v-else class="fw-bold m-0 text-truncate">{{ nomeLoja || 'Minha Loja' }}</h4>
                <small v-if="isSuperAdmin" class="text-info">Super Admin</small>
                <small v-else class="text-white-50">Painel do Negócio</small>
            </div>

            <nav class="nav flex-column p-2 mt-3">
                <router-link v-for="item in menuItemsVisiveis" :key="item.to" :to="item.to"
                    class="nav-link text-white mb-2 py-2 rounded">
                    <i :class="item.icone" class="me-2"></i> {{ item.label }}
                </router-link>
            </nav>
        </div>

        <!-- MENU EM GAVETA (telas pequenas) -->
        <div class="offcanvas offcanvas-start bg-dark text-white d-md-none" tabindex="-1" id="sidebarNavMobile"
            aria-labelledby="sidebarNavMobileLabel">
            <div class="offcanvas-header border-bottom border-secondary">
                <h4 v-if="isSuperAdmin" class="fw-bold m-0" id="sidebarNavMobileLabel"><ZenCutLogo variant="light" /></h4>
                <h4 v-else class="fw-bold m-0 text-truncate" id="sidebarNavMobileLabel">{{ nomeLoja || 'Minha Loja' }}</h4>
                <button type="button" class="btn-close" :class="{ 'btn-close-white': !isSuperAdmin && corTextoSidebarEhClaro }"
                    data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body p-2">
                <small v-if="isSuperAdmin" class="text-info d-block mb-2 px-2">Super Admin</small>
                <small v-else class="text-white-50 d-block mb-2 px-2">Painel do Negócio</small>
                <nav class="nav flex-column">
                    <router-link v-for="item in menuItemsVisiveis" :key="item.to" :to="item.to"
                        class="nav-link text-white mb-2 py-2 rounded" data-bs-dismiss="offcanvas">
                        <i :class="item.icone" class="me-2"></i> {{ item.label }}
                    </router-link>
                </nav>
            </div>
        </div>

        <div class="flex-grow-1 bg-light d-flex flex-column" style="min-width: 0;">
            <nav class="navbar navbar-expand-lg navbar-white bg-white border-bottom px-4 py-3">
                <div class="container-fluid px-0">
                    <button class="btn btn-outline-secondary d-md-none me-3" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#sidebarNavMobile" aria-controls="sidebarNavMobile" aria-label="Abrir menu">
                        <i class="bi bi-list fs-4"></i>
                    </button>
                    <span v-if="isSuperAdmin" class="navbar-brand d-md-none fw-bold flex-grow-1"><ZenCutLogo variant="dark" /></span>
                    <span v-else class="navbar-brand d-md-none fw-bold flex-grow-1 text-truncate">{{ nomeLoja || 'Minha Loja' }}</span>
                    <div class="ms-auto d-flex align-items-center">
                        <span class="me-3 d-none d-sm-inline">
                            Olá, <strong>{{ isSuperAdmin ? 'Administrador' : (funcionarioRole === 1 ? 'Dono' : 'Funcionário') }}</strong>
                        </span>
                        <button @click="handleLogout" class="btn btn-outline-danger btn-sm fw-bold">
                            <i class="bi bi-box-arrow-right"></i> Sair
                        </button>
                    </div>
                </div>
            </nav>

            <main class="p-4 flex-grow-1">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useTenantStore } from '@/stores/tenant';
import axios from 'axios';
import Cookies from 'js-cookie';
import ZenCutLogo from '@/components/ZenCutLogo.vue';
import { corContrastante } from '@/utils/cor.js';

const auth = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const getConfig = () => ({ headers: { 'Authorization': `Bearer ${Cookies.get('access_token')}`, 'x-tenant-id': Cookies.get('tenant_id') } });

// Estado do tenant vive na store (não em refs locais) — o MainLayout não
// remonta entre navegações dentro da área logada, então essa busca roda só
// UMA VEZ por sessão; as páginas filhas (Planos, Agendamentos, Estoque,
// Clientes...) leem esse mesmo estado direto da store em vez de refazer o
// fetch e mostrar um loading próprio — se o item já está visível no menu,
// é porque esse fetch já confirmou o acesso.
const tenantStore = useTenantStore();
const {
    isSuperAdmin, funcionarioRole, nomeLoja, corPrimaria, corSecundaria,
    hasFinanceiro, hasAgendamento, hasAssinaturas, hasProdutos, hasVendas,
} = storeToRefs(tenantStore);

// O Financeiro geral da loja é só pra Dono/Admin (1) ou Espectador/Sócio (6) —
// mesma regra que o backend usa em validarAdmin(). Funcionário padrão (2) não vê
// esse item quebrado no menu; ele tem o dele próprio em "Meu Perfil".
const podeVerFinanceiroGeral = computed(() => funcionarioRole.value === 1 || funcionarioRole.value === 6);

// Funcionário comum (role 2) só tem "Meu Perfil" — lá dentro já tem as abas de
// Agendamentos e Financeiro filtradas pra ele mesmo. Dashboard, Agenda geral,
// Planos e Financeiro da loja são exclusivos do Dono/Admin/Espectador.
const isFuncionarioComum = computed(() => funcionarioRole.value === 2);

// Converte hex pra "r, g, b" — necessário pra combinar com bg-opacity-* do
// Bootstrap (ex: o avatar do Perfil usa bg-primary bg-opacity-10; sem o rgb
// separado, a única saída seria pintar o fundo 100% opaco e esconder o ícone).
const hexParaRgb = (hex) => {
    const limpo = (hex || '').replace('#', '');
    const num = parseInt(limpo.length === 3 ? limpo.split('').map(c => c + c).join('') : limpo, 16);
    if (Number.isNaN(num)) return '13, 27, 42';
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
};

const temaInlineStyle = computed(() => {
    if (isSuperAdmin.value) return {};
    return {
        '--tenant-primary': corPrimaria.value,
        '--tenant-primary-rgb': hexParaRgb(corPrimaria.value),
        '--tenant-primary-text': corContrastante(corPrimaria.value),
        '--tenant-secondary': corSecundaria.value,
        '--tenant-secondary-rgb': hexParaRgb(corSecundaria.value),
        '--tenant-secondary-text': corContrastante(corSecundaria.value),
    };
});

// Usado no ícone de fechar da gaveta (.btn-close): esse ícone é uma imagem, não
// texto, então não dá pra resolver via CSS var — precisa trocar a classe mesmo.
const corTextoSidebarEhClaro = computed(() => corContrastante(corPrimaria.value) === '#ffffff');

// Lista única dos itens do menu, reaproveitada na sidebar fixa (desktop) e na gaveta (mobile)
const menuItemsVisiveis = computed(() => {
    const itens = [
        { to: '/home', icone: 'bi bi-house-door', label: 'Dashboard', mostrar: !isFuncionarioComum.value },
        { to: '/financeiro', icone: 'bi bi-currency-dollar', label: 'Financeiro', mostrar: isSuperAdmin.value || (hasFinanceiro.value && podeVerFinanceiroGeral.value) },
        { to: '/agendamentos', icone: 'bi bi-calendar-event', label: 'Agenda', mostrar: !isSuperAdmin.value && !isFuncionarioComum.value && hasAgendamento.value },
        { to: '/clientes', icone: 'bi bi-people-fill', label: 'Clientes', mostrar: !isSuperAdmin.value && !isFuncionarioComum.value },
        { to: '/planos', icone: 'bi bi-award', label: 'Planos', mostrar: !isSuperAdmin.value && !isFuncionarioComum.value && hasAssinaturas.value },
        { to: '/minha-vitrine', icone: 'bi bi-shop-window', label: 'Minha Vitrine', mostrar: !isSuperAdmin.value && funcionarioRole.value === 1 },
        { to: '/adm/lojas', icone: 'bi bi-buildings-fill', label: 'Central de Lojas', mostrar: isSuperAdmin.value },
        { to: '/perfil', icone: 'bi bi-person-circle', label: 'Meu Perfil', mostrar: true },
    ];
    return itens.filter(item => item.mostrar);
});

// Logo depois do login (principalmente no redirecionamento entre domínios do
// dono de loja), o cookie às vezes ainda não está 100% "pronto" pra primeira
// leitura — sem isso o menu lateral nascia vazio e só se corrigia com um
// F5 manual. Uma retentativa curta resolve sem precisar disso.
const buscarComRetentativa = async (fn, tentativas = 2, esperaMs = 600) => {
    try {
        return await fn();
    } catch (e) {
        if (tentativas <= 1) throw e;
        await new Promise(r => setTimeout(r, esperaMs));
        return buscarComRetentativa(fn, tentativas - 1, esperaMs);
    }
};

onMounted(async () => {
    try {
        const response = await buscarComRetentativa(() => axios.get(`${API_URL}/funcionarios/me`, getConfig()));
        isSuperAdmin.value = response.data.isPlatformOwner === true;
        funcionarioRole.value = response.data.role;
    } catch (e) {
        console.error("Erro ao verificar permissões do usuário:", e);
    }

    // Se não for o dono da plataforma, busca os módulos liberados pro plano da própria loja
    if (!isSuperAdmin.value) {
        try {
            const tenantId = Cookies.get('tenant_id');
            if (tenantId) {
                const response = await buscarComRetentativa(() => axios.get(`${API_URL}/tenants/${tenantId}/plano`, getConfig()));
                hasFinanceiro.value = response.data.moduloFinanceiro === true;
                hasAgendamento.value = response.data.moduloAgendamento === true;
                hasAssinaturas.value = response.data.moduloAssinaturas === true;
                hasProdutos.value = response.data.moduloProdutos === true;
                hasVendas.value = response.data.moduloVendas === true;
                nomeLoja.value = response.data.nomeNegocio || '';
                if (response.data.corPrimaria) corPrimaria.value = response.data.corPrimaria;
                if (response.data.corSecundaria) corSecundaria.value = response.data.corSecundaria;
                tenantStore.planoSaaS = response.data.planoSaaS || 'BASICO';
            }
        } catch (e) {
            console.error("Erro ao buscar permissões dos módulos:", e);
        }
    }
    tenantStore.carregado = true;
});

// A Nova Lógica Inteligente de Logout
const handleLogout = () => {
    auth.logout();

    // auth.logout() já remove os cookies host-only (o normal desde que o login
    // parou de setar domain: '.zencut.com.br'). A remoção COM esse domain aqui
    // embaixo é só limpeza defensiva de cookies antigos que alguém ainda possa
    // ter no navegador de antes desse ajuste (duram até 7 dias) — sem ela, esse
    // cookie legado sobreviveria ao "Sair" e a pessoa continuaria autenticada.
    Cookies.remove('access_token', { domain: '.zencut.com.br' });
    Cookies.remove('access_token');
    Cookies.remove('tenant_id', { domain: '.zencut.com.br' });
    Cookies.remove('tenant_id');

    // Isso aqui é só sobre QUAL subdomínio a pessoa estava (não sobre ser ou não dono da plataforma)
    const currentHost = window.location.host;
    if (currentHost.startsWith('adm.') || currentHost.startsWith('admin.')) {
        const baseHost = currentHost.replace(/^adm\.|^admin\./, '');
        window.location.href = `${window.location.protocol}//${baseHost}/login`;
    } else {
        window.location.href = '/login';
    }
};
</script>

<style scoped>
.nav-link {
    transition: all 0.2s ease-in-out;
}

.nav-link:hover,
.router-link-active {
    background-color: rgba(255, 255, 255, 0.1);
    font-weight: bold;
    padding-left: 1rem !important;
}
</style>