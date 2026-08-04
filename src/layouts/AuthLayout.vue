<template>
    <div class="auth-shell d-flex" style="min-height: 100vh;">
        <!-- Painel de marca (telas grandes) -->
        <div class="auth-brand-panel d-none d-lg-flex flex-column justify-content-between p-5"
            :style="{ background: gradientePainel, color: corTextoPainel }">
            <div class="position-relative">
                <h2 v-if="mostrarNomeLoja" class="fw-bold mb-0">{{ nomeLoja }}</h2>
                <h2 v-else class="fw-bold mb-0"><ZenCutLogo variant="light" /></h2>
            </div>
            <div class="position-relative">
                <h1 class="fw-bold display-6 mb-3">{{ tituloPainel }}</h1>
                <p class="mb-0" :class="{ 'text-warning': corTextoPainel === '#ffffff' }" style="max-width: 380px;">
                    {{ descricaoPainel }}
                </p>
            </div>
            <p class="position-relative small mb-0" style="opacity: .65;">&copy; {{ anoAtual }} ZenCut</p>
        </div>

        <!-- Formulário -->
        <div class="flex-grow-1 d-flex align-items-center justify-content-center p-4 auth-form-side">
            <div class="w-100" style="max-width: 420px;">
                <div class="text-center mb-4 d-lg-none">
                    <h2 v-if="mostrarNomeLoja" class="fw-bold">{{ nomeLoja }}</h2>
                    <h2 v-else class="fw-bold"><ZenCutLogo variant="dark" /></h2>
                </div>
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ZenCutLogo from '@/components/ZenCutLogo.vue';
import { corContrastante } from '@/utils/cor.js';

const anoAtual = new Date().getFullYear();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// --- Marca padrão ZenCut (domínio principal / subdomínio "adm" ou "plataforma") ---
const mostrarNomeLoja = ref(false);
const nomeLoja = ref('');
const corPrimaria = ref('#0D1B2A');
const corSecundaria = ref('#0D6EFD');
const tituloPainel = ref('Gerencie sua barbearia com simplicidade.');
const descricaoPainel = ref('Agendamentos, planos de assinatura, comissões da equipe e financeiro em um só lugar.');

const gradientePainel = computed(() => `linear-gradient(155deg, ${corPrimaria.value} 0%, ${corSecundaria.value} 130%)`);
// O gradiente vai de corPrimaria a corSecundaria — usa a primária (que domina
// a maior parte da área, por causa do ângulo) pra decidir o texto.
const corTextoPainel = computed(() => corContrastante(corPrimaria.value));

onMounted(async () => {
    const hostname = window.location.hostname;
    const partes = hostname.split('.');
    const isMainDomain = hostname === 'zencut.com.br' || hostname === 'www.zencut.com.br' || hostname === 'localhost';
    const isSubdominioReservado = partes[0] === 'adm' || partes[0] === 'admin';

    // Domínio principal ou subdomínio reservado do super admin: mantém a marca ZenCut padrão.
    if (isMainDomain || isSubdominioReservado) return;

    try {
        const res = await axios.get(`${API_URL}/tenants/info/${partes[0]}`);
        const dados = res.data;

        // Subdomínio "plataforma" (a própria loja do dono da plataforma): também mantém a marca ZenCut.
        if (dados?.ehPlataformaPropria) return;

        mostrarNomeLoja.value = true;
        nomeLoja.value = dados.nomeNegocio;
        if (dados.corPrimaria) corPrimaria.value = dados.corPrimaria;
        if (dados.corSecundaria) corSecundaria.value = dados.corSecundaria;
        if (dados.loginTitulo) tituloPainel.value = dados.loginTitulo;
        if (dados.loginDescricao) descricaoPainel.value = dados.loginDescricao;
    } catch (e) {
        console.error('Não foi possível carregar a personalização da loja', e);
    }
});
</script>

<style scoped>
.auth-brand-panel {
    flex: 0 0 42%;
    max-width: 560px;
    overflow: hidden;
    position: relative;
}

.auth-brand-panel::before,
.auth-brand-panel::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
}

.auth-brand-panel::before {
    width: 420px;
    height: 420px;
    top: -140px;
    right: -140px;
}

.auth-brand-panel::after {
    width: 300px;
    height: 300px;
    bottom: -100px;
    left: -80px;
    background: rgba(255, 193, 7, 0.08);
}

.auth-form-side {
    background: #F6F7FB;
}
</style>
