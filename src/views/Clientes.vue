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
                    <h2 class="fw-bold text-dark mb-1"><i class="bi bi-people-fill text-primary me-2"></i> Clientes</h2>
                    <p class="text-muted mb-0">Todos os clientes cadastrados, status do plano e dados de contato.</p>
                </div>
                <button class="btn btn-outline-secondary fw-bold shadow-sm mt-3 mt-md-0" @click="router.push('/home')">
                    <i class="bi bi-arrow-left me-1"></i> Voltar ao Painel
                </button>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3">
            <div class="card-body">
                <label class="fw-bold small text-muted mb-2 d-block">Buscar Cliente</label>
                <input type="text" class="form-control" placeholder="Nome, e-mail ou telefone..."
                    v-model="busca" @input="onBuscaInput">
            </div>
        </div>

        <div class="text-center py-5" v-if="carregando">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="clientes.length === 0" class="text-center py-5 text-muted">
            <i class="bi bi-people display-4 d-block mb-3 opacity-25"></i>
            <p class="mb-0">{{ busca.trim() ? 'Nenhum cliente encontrado com esse termo.' : 'Nenhum cliente cadastrado ainda.' }}</p>
        </div>

        <div v-else class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="px-3">Cliente</th>
                            <th>Contato</th>
                            <th>Plano</th>
                            <th>Status</th>
                            <th>Vencimento</th>
                            <th class="text-end px-3">Agendamentos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in clientes" :key="c.id">
                            <td class="px-3 fw-bold">{{ c.nome }}</td>
                            <td>
                                <div class="small">{{ c.email || '—' }}</div>
                                <div class="small text-muted">{{ c.telefone || '—' }}</div>
                            </td>
                            <td>{{ c.assinatura?.nomePlano || '—' }}</td>
                            <td>
                                <span class="badge" :class="statusBadgeClass(c)">{{ statusLabel(c) }}</span>
                            </td>
                            <td>{{ c.assinatura ? formatarData(c.assinatura.dataFim) : '—' }}</td>
                            <td class="text-end px-3">{{ c.totalAgendamentos }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="d-flex justify-content-between align-items-center p-3 border-top" v-if="totalClientes > porPagina">
                <small class="text-muted">{{ totalClientes }} cliente(s) — página {{ paginaAtual }} de {{ totalPaginas }}</small>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-secondary" :disabled="paginaAtual <= 1"
                        @click="irParaPagina(paginaAtual - 1)">
                        <i class="bi bi-chevron-left"></i> Anterior
                    </button>
                    <button type="button" class="btn btn-outline-secondary" :disabled="paginaAtual >= totalPaginas"
                        @click="irParaPagina(paginaAtual + 1)">
                        Próxima <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast } from 'bootstrap';

const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getConfig = () => ({ headers: { 'Authorization': `Bearer ${Cookies.get('access_token')}`, 'x-tenant-id': Cookies.get('tenant_id') } });
const formatarData = (d) => new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

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

const clientes = ref([]);
const carregando = ref(true);
const busca = ref('');
const totalClientes = ref(0);
const paginaAtual = ref(1);
const porPagina = 15;
let timeoutBusca = null;

const totalPaginas = computed(() => Math.max(1, Math.ceil(totalClientes.value / porPagina)));

const statusLabel = (c) => {
    if (!c.assinatura) return 'Sem plano';
    if (!c.assinatura.ativo || c.assinatura.status === 'Cancelado') return 'Cancelado';
    if (new Date(c.assinatura.dataFim) < new Date()) return 'Vencido';
    return 'Ativo';
};

const statusBadgeClass = (c) => {
    const label = statusLabel(c);
    if (label === 'Ativo') return 'bg-success-subtle text-success border border-success-subtle';
    if (label === 'Vencido') return 'bg-danger-subtle text-danger border border-danger-subtle';
    if (label === 'Cancelado') return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    return 'bg-light text-muted border';
};

const carregarClientes = async () => {
    carregando.value = true;
    try {
        const response = await axios.get(`${API_URL}/clientes`, {
            params: {
                busca: busca.value.trim() || undefined,
                skip: (paginaAtual.value - 1) * porPagina,
                take: porPagina,
            },
            ...getConfig()
        });
        clientes.value = response.data.data || [];
        totalClientes.value = response.data.total || 0;
    } catch (error) {
        console.error(error);
        clientes.value = [];
        showToast(error.response?.data?.message || 'Erro ao buscar clientes.', 'danger');
    } finally {
        carregando.value = false;
    }
};

const onBuscaInput = () => {
    if (timeoutBusca) clearTimeout(timeoutBusca);
    timeoutBusca = setTimeout(() => {
        paginaAtual.value = 1;
        carregarClientes();
    }, 400);
};

const irParaPagina = (pagina) => {
    if (pagina < 1 || pagina > totalPaginas.value) return;
    paginaAtual.value = pagina;
    carregarClientes();
};

onMounted(() => {
    if (toastRef.value) toastInstance.value = new Toast(toastRef.value);
    carregarClientes();
});
</script>
