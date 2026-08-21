<template>
    <div class="card border-0 shadow-lg rounded-4 p-4 p-md-5 position-relative login-card">

        <div class="text-center mb-4">
            <span v-if="carregandoInfo" class="spinner-border spinner-border-sm text-primary" role="status"></span>
            <template v-else>
                <h4 class="fw-bold mb-1">Bem-vindo(a) de volta</h4>
                <p class="text-muted small mb-0">Entre na sua conta <span class="fw-semibold text-primary">{{ nomeNegocio }}</span></p>
            </template>
        </div>

        <form @submit.prevent="handleLogin">
            <div class="mb-3">
                <label class="form-label small fw-semibold text-uppercase text-muted">E-mail</label>
                <div class="position-relative">
                    <i class="bi bi-envelope input-icon"></i>
                    <input v-model="form.email" type="email" class="form-control form-control-lg ps-5 rounded-3"
                        placeholder="seu@email.com" required>
                </div>
            </div>
            <div class="mb-4">
                <label class="form-label small fw-semibold text-uppercase text-muted">Senha</label>
                <div class="position-relative">
                    <i class="bi bi-lock input-icon"></i>
                    <input v-model="form.password" type="password" class="form-control form-control-lg ps-5 rounded-3"
                        placeholder="********" required>
                </div>
            </div>
            <button :disabled="loading" class="btn btn-primary btn-lg w-100 mb-3 fw-bold rounded-3 login-btn">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                    aria-hidden="true"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>

            <p v-if="exibirRegistro" class="text-center small mb-0">
                Ainda não tem conta? <router-link to="/registro" class="fw-bold text-decoration-none">Crie uma
                    agora</router-link>
            </p>
        </form>

        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055;">
            <div id="loginToast" class="toast align-items-center border-0 text-white" :class="toastClass" role="alert"
                ref="toastRef">
                <div class="d-flex">
                    <div class="toast-body">
                        <i :class="toastIcon"></i> {{ toastMessage }}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto"
                        data-bs-dismiss="toast"></button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast } from 'bootstrap';

const router = useRouter();
const loading = ref(false);
const carregandoInfo = ref(true);

const form = reactive({
    email: '',
    password: ''
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// --- ESTADOS DO TOAST ---
const toastRef = ref(null);
let bsToast = null;
const toastMessage = ref('');
const toastClass = ref('');
const toastIcon = ref('');

// --- ESTADOS DINÂMICOS DA TELA ---
const nomeNegocio = ref('ZenCut'); // Nome padrão caso não tenha subdomínio
const exibirRegistro = ref(false);
// ID real do tenant deste subdomínio — mandado no login pra restringir a busca
// por e-mail a ESTA loja. Sem isso, duas lojas com a mesma combinação de
// e-mail (uma como cliente, outra como funcionário) podiam fazer o login de
// uma vazar pra conta da outra.
const tenantIdAtual = ref('');

const hostname = window.location.hostname;
const partes = hostname.split('.');
// Mesmo critério do router: domínio principal (com ou sem www) e localhost puro
// nunca são o subdomínio de uma loja específica.
const isMainDomain = hostname === 'zencut.com.br' || hostname === 'www.zencut.com.br' || hostname === 'localhost';

// Validação de domínio e busca de nome
const configurarTelaPorSubdominio = async () => {
    // Cadastro só existe dentro do subdomínio de uma barbearia (cliente dela se
    // cadastrando). No domínio principal ou no subdomínio adm/admin, nunca mostra —
    // barbearia nova entra em contato comercial, não se autocadastra.
    const ehSubdominioReservado = partes[0] === 'adm' || partes[0] === 'admin';
    const temSubdominio = !isMainDomain;

    if (temSubdominio) {
        exibirRegistro.value = !ehSubdominioReservado;
        const subdomain = partes[0]; // Pega a palavra 'alcateia' por exemplo (ou 'adm'/'admin')

        const aplicarDados = (dados) => {
            if (dados && dados.nomeNegocio) {
                nomeNegocio.value = dados.nomeNegocio;
            }
            if (dados?.id) {
                tenantIdAtual.value = dados.id;
            }
            // Esse subdomínio é a própria loja do dono da plataforma (ex: "plataforma"),
            // não uma barbearia cliente de verdade — nunca oferece autocadastro aqui.
            if (dados?.ehPlataformaPropria) {
                exibirRegistro.value = false;
            }
        };

        // O router.beforeEach já buscou e guardou esses dados antes desse
        // componente montar — reaproveita em vez de refazer o mesmo fetch (que
        // além de desperdiçar uma requisição, atrasava o nome da loja aparecer).
        const cache = sessionStorage.getItem(`tenant_info_${subdomain}`);
        if (cache) {
            try {
                aplicarDados(JSON.parse(cache));
            } catch (e) {
                console.error("Cache de tenant corrompido", e);
            }
        } else {
            try {
                const res = await axios.get(`${API_URL}/tenants/info/${subdomain}`);
                aplicarDados(res.data);
            } catch (e) {
                console.error("Não foi possível carregar os dados da barbearia", e);
            }
        }
    } else {
        // Domínio principal (zencut.com.br) — portal global, sem subdomínio
        // conhecido ainda. Login aqui faz busca por e-mail sem restrição de
        // tenant (é assim que o dono consegue logar sem saber a própria URL —
        // ver comentário no handleLogin).
        exibirRegistro.value = false;
    }

    carregandoInfo.value = false;
};

onMounted(() => {
    if (toastRef.value) {
        bsToast = new Toast(toastRef.value);
    }
    configurarTelaPorSubdominio();
});

const showToast = (msg, type = 'success') => {
    toastMessage.value = msg;
    toastClass.value = type === 'success' ? 'bg-success' : 'bg-danger';
    toastIcon.value = type === 'success' ? 'bi-check-circle-fill me-2' : 'bi-exclamation-octagon-fill me-2';
    if (bsToast) bsToast.show();
};

const handleLogin = async () => {
    try {
        loading.value = true;

        const response = await axios.post(`${API_URL}/auth/login`, {
            email: form.email,
            senha: form.password
        }, tenantIdAtual.value ? { headers: { 'x-tenant-id': tenantIdAtual.value } } : undefined);

        // Extraímos as propriedades que vêm da sua API
        const { token, tenantId, subdomain, usuario, features, tenant } = response.data;
        const accessToken = token?.accessToken || response.data.access_token;

        const isLocalhost = hostname === 'localhost' || hostname.endsWith('.localhost');
        const jaEstaNoSubdominio = hostname.startsWith(`${subdomain}.`);

        // CÉREBRO DOS MÓDULOS: Pega de onde vier (tenant, features ou direto no response)
        const dadosModulos = tenant || features || response.data;
        const featuresCodificadas = encodeURIComponent(JSON.stringify(dadosModulos || {}));

        showToast('Logado com sucesso!', 'success');

        setTimeout(() => {
            try {
                // Caso 1: ADM tentando logar fora do subdomínio dele
                if (usuario?.role === 1 && subdomain && !jaEstaNoSubdominio) {
                    if (isLocalhost) {
                        window.location.href = `http://${subdomain}.localhost:5173/home?sync_token=${accessToken}&sync_tenant=${tenantId}&sync_features=${featuresCodificadas}`;
                    } else {
                        window.location.href = `https://${subdomain}.zencut.com.br/home?sync_token=${accessToken}&sync_tenant=${tenantId}&sync_features=${featuresCodificadas}`;
                    }
                }
                // Caso 2: Login no lugar certo
                else {
                    // Cookie "host-only" (sem domain): vale só pro hostname atual,
                    // não pra TODOS os subdomínios da zencut. Cada loja tem sessão
                    // isolada — inclusive o domínio principal. Sem isso, logar numa
                    // loja e depois só trocar a URL pra outro subdomínio (ou pro
                    // domínio principal) mantinha a pessoa autenticada lá, com a
                    // sessão da loja errada. O dono que loga sem saber o próprio
                    // subdomínio já foi redirecionado no "Caso 1" acima ANTES de
                    // chegar aqui, então esse cookie sempre nasce no lugar certo.
                    Cookies.set('access_token', accessToken, { expires: 7 });
                    Cookies.set('tenant_id', tenantId, { expires: 7 });

                    // SALVA NO LOCALSTORAGE COM A ESTRUTURA PARA O MENU LATERAL LER
                    if (dadosModulos) {
                        localStorage.setItem('tenant_features', JSON.stringify(dadosModulos));
                    }

                    router.push('/home');
                }
            } catch (err) {
                console.error('Erro no redirecionamento após login:', err);
                loading.value = false; // Garante que destrave se algo falhar aqui
            }
        }, 1000);

    } catch (e) {
        const mensagemErro = e.response?.data?.message || 'Verifique as suas credenciais.';
        showToast(`Erro no login: ${mensagemErro}`, 'danger');
        console.error('Detalhes do erro:', e);
        loading.value = false;
    }
};
</script>

<style scoped>
.login-card {
    background: #fff;
}

.input-icon {
    position: absolute;
    left: 1.1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
}

.login-btn {
    background: linear-gradient(135deg, #0D6EFD 0%, #0b5ed7 100%);
    border: none;
    transition: transform .15s ease, box-shadow .15s ease;
}

.login-btn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(13, 110, 253, .3);
}
</style>