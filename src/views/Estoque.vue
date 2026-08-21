<template>
    <div class="container-fluid position-relative">

        <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">
            <div ref="toastRef" class="toast align-items-center text-white border-0" role="alert" aria-live="assertive"
                aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i :class="toastIcon" class="me-2"></i> {{ toastMessage }}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                        aria-label="Close"></button>
                </div>
            </div>
        </div>

        <div class="row mb-4 border-bottom pb-3">
            <div class="col-12 d-flex justify-content-between align-items-center flex-wrap">
                <div>
                    <h2 class="fw-bold text-dark mb-1"><i class="bi bi-boxes text-warning me-2"></i> Controle de Estoque</h2>
                    <p class="text-muted mb-0">Consulte as quantidades e os detalhes cadastrados de cada item.</p>
                </div>
                <button class="btn btn-outline-secondary fw-bold shadow-sm mt-3 mt-md-0" @click="router.push('/home')">
                    <i class="bi bi-arrow-left me-1"></i> Voltar ao Painel
                </button>
            </div>
        </div>

        <div v-if="tenantStore.carregado && !temModuloProdutos" class="alert alert-warning border-0 shadow-sm d-flex align-items-center p-4">
            <i class="bi bi-lock-fill fs-1 me-4 text-warning"></i>
            <div>
                <h5 class="fw-bold mb-1">Recurso Indisponível no seu Plano</h5>
                <p class="mb-2">O módulo de Produtos & Estoque não está ativo no seu plano atual ({{ planoAtual }}).</p>
                <button class="btn btn-warning fw-bold btn-sm">Fazer Upgrade Agora</button>
            </div>
        </div>

        <div v-else class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom-0 pt-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <ul class="nav nav-pills bg-light p-1 rounded-3">
                    <li class="nav-item">
                        <button class="nav-link rounded-3 small fw-bold" :class="{ active: filtroTipoProduto === 'TODOS' }"
                            @click="filtroTipoProduto = 'TODOS'">Todos</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link rounded-3 small fw-bold" :class="{ active: filtroTipoProduto === 'PRODUTO' }"
                            @click="filtroTipoProduto = 'PRODUTO'">Produtos</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link rounded-3 small fw-bold" :class="{ active: filtroTipoProduto === 'CONSUMIVEL' }"
                            @click="filtroTipoProduto = 'CONSUMIVEL'">Consumíveis</button>
                    </li>
                </ul>
                <button @click="carregarProdutos" class="btn btn-sm btn-outline-secondary border-0">
                    <i class="bi bi-arrow-clockwise me-1"></i> Atualizar
                </button>
            </div>

            <div class="card-body p-0">
                <div class="text-center py-5" v-if="carregandoProdutos">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>

                <div v-else-if="produtosFiltrados.length > 0" class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light sticky-top">
                            <tr>
                                <th class="px-4 border-0">Item</th>
                                <th class="border-0">Tipo</th>
                                <th class="border-0">Detalhes</th>
                                <th class="border-0">Valor</th>
                                <th class="border-0 text-center" style="width: 170px;">Estoque Disponível</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="prod in produtosFiltrados" :key="prod.id">
                                <td class="px-4 fw-bold text-dark">{{ prod.nome }}</td>
                                <td>
                                    <span class="badge"
                                        :class="prod.tipo === 'PRODUTO' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning'">
                                        {{ prod.tipo === 'PRODUTO' ? 'Produto' : 'Consumível' }}
                                    </span>
                                </td>
                                <td>
                                    <div v-if="prod.caracteristicas && Object.keys(prod.caracteristicas).length > 0"
                                        class="d-flex flex-wrap gap-1" style="max-width: 360px;">
                                        <span v-for="(valor, chave) in prod.caracteristicas" :key="chave"
                                            class="badge bg-light text-secondary border fw-normal" style="font-size: 0.7rem;">
                                            {{ chave }}: <strong class="text-dark">{{ valor }}</strong>
                                        </span>
                                    </div>
                                    <small v-else class="text-muted fst-italic">Sem detalhes cadastrados</small>
                                </td>
                                <td class="fw-bold text-success">{{ formatarMoeda(prod.valor) }}</td>
                                <td class="pe-4">
                                    <div class="input-group input-group-sm">
                                        <input type="number" class="form-control text-center fw-bold" v-model="prod.estoque"
                                            min="0">
                                        <button class="btn btn-outline-success" @click="salvarEstoque(prod, $event)"
                                            title="Salvar quantidade">
                                            <i class="bi bi-check2"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="text-center py-5 text-muted">
                    <i class="bi bi-box-seam display-4 d-block mb-3 opacity-25"></i>
                    <p class="mb-0">Nenhum item nesta categoria.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast } from 'bootstrap';
import { useTenantStore } from '../stores/tenant';

const router = useRouter();
const tenantStore = useTenantStore();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getConfig = () => ({ headers: { 'Authorization': `Bearer ${Cookies.get('access_token')}`, 'x-tenant-id': Cookies.get('tenant_id') } });
const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const temModuloProdutos = computed(() => tenantStore.hasProdutos);
const planoAtual = computed(() => tenantStore.planoSaaS);

const toastRef = ref(null);
const toastInstance = ref(null);
const toastMessage = ref('');
const toastIcon = ref('');

const showToast = (msg, type = 'success') => {
    if (!toastRef.value) return;
    toastMessage.value = msg;
    if (type === 'success') {
        toastRef.value.className = 'toast align-items-center text-bg-success border-0';
        toastIcon.value = 'bi bi-check-circle-fill me-2';
    } else {
        toastRef.value.className = 'toast align-items-center text-bg-danger border-0';
        toastIcon.value = 'bi bi-exclamation-octagon-fill me-2';
    }
    if (!toastInstance.value) toastInstance.value = new Toast(toastRef.value);
    toastInstance.value.show();
};

const produtos = ref([]);
const carregandoProdutos = ref(false);
const filtroTipoProduto = ref('TODOS');

const produtosFiltrados = computed(() => {
    if (filtroTipoProduto.value === 'TODOS') return produtos.value;
    return produtos.value.filter(p => p.tipo === filtroTipoProduto.value);
});

const carregarProdutos = async () => {
    if (!temModuloProdutos.value) return;
    carregandoProdutos.value = true;
    try {
        const response = await axios.get(`${API_URL}/produtos`, getConfig());
        produtos.value = response.data;
    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar os produtos.', 'danger');
    } finally {
        carregandoProdutos.value = false;
    }
};

const salvarEstoque = async (prod, evt) => {
    const btn = evt.currentTarget;
    try {
        await axios.put(`${API_URL}/produtos/${prod.id}`, { estoque: Number(prod.estoque) }, getConfig());
        showToast('Estoque atualizado!', 'success');
        btn.classList.replace('btn-outline-success', 'btn-success');
        btn.innerHTML = '<i class="bi bi-check-all text-white"></i>';
        setTimeout(() => {
            btn.classList.replace('btn-success', 'btn-outline-success');
            btn.innerHTML = '<i class="bi bi-check2"></i>';
        }, 1500);
    } catch (error) {
        showToast('Falha ao atualizar estoque no banco.', 'danger');
    }
};

// O MainLayout já busca as permissões da loja uma única vez por sessão e
// guarda na store — aqui só lemos o resultado, sem refazer o fetch nem
// mostrar loading próprio.
const iniciarSeLiberado = () => {
    if (temModuloProdutos.value) carregarProdutos();
};

onMounted(() => {
    if (toastRef.value) toastInstance.value = new Toast(toastRef.value);

    if (tenantStore.carregado) {
        iniciarSeLiberado();
    } else {
        // Navegação direta pra /estoque (URL digitada, F5) — a store ainda
        // não resolveu; reage assim que o MainLayout terminar de buscar.
        const pararDeObservar = watch(() => tenantStore.carregado, (carregado) => {
            if (carregado) { iniciarSeLiberado(); pararDeObservar(); }
        });
    }
});
</script>
