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
                    <h2 class="fw-bold text-dark mb-1"><i class="bi bi-card-list text-primary me-2"></i> Todos os Agendamentos</h2>
                    <p class="text-muted mb-0">Consulte, edite, conclua ou cancele os agendamentos do seu negócio.</p>
                </div>
                <button class="btn btn-outline-secondary fw-bold shadow-sm mt-3 mt-md-0" @click="router.push('/home')">
                    <i class="bi bi-arrow-left me-1"></i> Voltar ao Painel
                </button>
            </div>
        </div>

        <div v-if="tenantStore.carregado && !temModuloAgendamento" class="alert alert-warning border-0 shadow-sm d-flex align-items-center p-4">
            <i class="bi bi-lock-fill fs-1 me-4 text-warning"></i>
            <div>
                <h5 class="fw-bold mb-1">Recurso Indisponível no seu Plano</h5>
                <p class="mb-2">O módulo de Agendamentos Online não está ativo no seu plano atual ({{ planoAtual }}).</p>
                <button class="btn btn-warning fw-bold btn-sm">Fazer Upgrade Agora</button>
            </div>
        </div>

        <div v-else class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom-0 pt-3">
                <div class="row align-items-end g-3">
                    <div class="col-md-5">
                        <label class="form-label fw-bold text-muted small text-uppercase">Período</label>
                        <div class="input-group shadow-sm">
                            <span class="input-group-text bg-white border-end-0"><i class="bi bi-calendar3"></i></span>
                            <input type="date" class="form-control border-start-0 ps-0" v-model="filtroDataInicio"
                                @change="carregarAgendamentos">
                            <span class="input-group-text bg-white border-0">até</span>
                            <input type="date" class="form-control border-start-0 ps-0" v-model="filtroDataFim"
                                @change="carregarAgendamentos">
                            <button class="btn btn-white border-0 bg-white text-primary fw-bold"
                                @click="resetFiltro">Hoje</button>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <ul class="nav nav-pills bg-light p-1 rounded-3">
                            <li class="nav-item">
                                <button class="nav-link rounded-3 small fw-bold" :class="{ active: filtroStatus === 'TODOS' }"
                                    @click="filtroStatus = 'TODOS'">Todos</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link rounded-3 small fw-bold" :class="{ active: filtroStatus === 'agendado' }"
                                    @click="filtroStatus = 'agendado'">Agendados</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link rounded-3 small fw-bold" :class="{ active: filtroStatus === 'concluido' }"
                                    @click="filtroStatus = 'concluido'">Concluídos</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link rounded-3 small fw-bold" :class="{ active: filtroStatus === 'cancelado' }"
                                    @click="filtroStatus = 'cancelado'">Cancelados</button>
                            </li>
                        </ul>
                    </div>
                    <div class="col-md-2 text-md-end">
                        <button class="btn btn-outline-secondary shadow-sm w-100" @click="carregarAgendamentos">
                            <i class="bi bi-arrow-clockwise me-1"></i> Atualizar
                        </button>
                    </div>
                </div>
            </div>

            <div class="card-body p-0">
                <div class="text-center py-5" v-if="carregandoAgendamentos">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>

                <div v-else-if="agendamentosFiltrados.length > 0" class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light sticky-top">
                            <tr>
                                <th class="border-0 px-4 py-3">Data / Hora</th>
                                <th class="border-0 py-3">Cliente</th>
                                <th class="border-0 py-3">Profissional</th>
                                <th class="border-0 py-3">Serviço</th>
                                <th class="border-0 py-3">Cobrança</th>
                                <th class="border-0 py-3 text-center">Status</th>
                                <th class="border-0 text-end px-4 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="agenda in agendamentosFiltrados" :key="agenda.id">
                                <td class="px-4 text-nowrap">
                                    <span class="d-block fw-bold text-dark">{{ formatarDataPtBr(agenda.horario.data) }}</span>
                                    <small class="text-muted"><i class="bi bi-clock me-1"></i> {{ agenda.horario.horaInicio }}</small>
                                </td>
                                <td class="fw-medium">{{ agenda.cliente ? agenda.cliente.nome : agenda.nomeCliente }}</td>
                                <td class="text-muted">{{ agenda.funcionario.nome }}</td>
                                <td>
                                    <span class="d-block text-truncate" style="max-width: 200px;">{{ agenda.servico }}</span>
                                    <small class="text-success fw-bold">{{ formatarMoeda(agenda.valor) }}</small>
                                </td>
                                <td>
                                    <span class="badge" :class="classeTipoCobranca(agenda.tipo)">{{ labelTipoCobranca(agenda) }}</span>
                                </td>
                                <td class="text-center">
                                    <span class="badge rounded-pill px-3 py-2" :class="corStatus(agenda.status)">{{ agenda.status.toUpperCase() }}</span>
                                </td>
                                <td class="text-end px-4 text-nowrap">
                                    <template v-if="agenda.status === 'agendado'">
                                        <button @click="abrirModalEdicao(agenda)"
                                            class="btn btn-sm btn-outline-primary rounded-circle shadow-sm me-1" title="Editar">
                                            <i class="bi bi-pencil-fill"></i>
                                        </button>
                                        <button @click="concluirAgendamento(agenda.id)"
                                            class="btn btn-sm btn-success rounded-circle shadow-sm me-1" title="Concluir">
                                            <i class="bi bi-check2-all"></i>
                                        </button>
                                        <button @click="cancelarAgendamento(agenda.id)"
                                            class="btn btn-sm btn-light text-danger rounded-circle shadow-sm" title="Cancelar">
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </template>
                                    <template v-else>
                                        <span class="text-muted small"><i class="bi bi-lock-fill"></i> Fechado</span>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="text-center py-5 text-muted">
                    <i class="bi bi-calendar2-x display-4 d-block mb-3 opacity-25"></i>
                    <h5>Nenhum agendamento encontrado.</h5>
                </div>
            </div>
        </div>

        <!-- MODAL: EDITAR AGENDAMENTO -->
        <div class="modal fade" ref="modalEdicaoRef" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="bi bi-pencil-fill me-2"></i> Editar Agendamento</h5>
                        <button type="button" class="btn-close btn-close-white" @click="fecharModalEdicao" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 bg-light" v-if="agendamentoEditando">
                        <form @submit.prevent="salvarEdicao">
                            <div class="row g-3 mb-4">
                                <div class="col-md-12">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Cliente</label>
                                    <input type="text" class="form-control form-control-lg" disabled
                                        :value="agendamentoEditando.cliente ? agendamentoEditando.cliente.nome : agendamentoEditando.nomeCliente">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Profissional</label>
                                    <select v-model="formEdicao.funcionarioId" class="form-select form-select-lg"
                                        @change="buscarHorariosParaEdicao" required>
                                        <option v-for="membro in equipeParaAgendamento" :key="membro.id" :value="membro.id">{{ membro.nome }}</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Data</label>
                                    <input v-model="formEdicao.data" type="date" class="form-control form-control-lg"
                                        :min="getHoje()" @change="buscarHorariosParaEdicao" required>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted text-uppercase">Horários Disponíveis</label>
                                <div v-if="carregandoHorariosEdicao" class="text-primary small">
                                    <span class="spinner-border spinner-border-sm me-2"></span> Buscando horários...
                                </div>
                                <div v-else-if="horariosParaEdicao.length === 0" class="alert alert-warning border-0 py-2">
                                    Nenhum horário livre encontrado para esta data.
                                </div>
                                <div v-else class="d-flex flex-wrap gap-2">
                                    <div v-for="horario in horariosParaEdicao" :key="horario.id" class="form-check p-0">
                                        <input type="radio" class="btn-check" :id="'edit_hora_' + horario.id"
                                            :value="horario.id" v-model="formEdicao.horarioId" required>
                                        <label class="btn btn-outline-primary" :for="'edit_hora_' + horario.id">{{ horario.horaInicio }}</label>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted text-uppercase">Serviços Desejados</label>
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body p-2" style="max-height: 200px; overflow-y: auto;">
                                        <label v-for="servico in servicosCatalogo" :key="servico.id"
                                            class="d-flex align-items-center mb-2 p-3 rounded border border-light w-100 m-0"
                                            :for="'edit_srv_' + servico.id">
                                            <input class="form-check-input m-0 flex-shrink-0" type="checkbox"
                                                :value="servico.id" :id="'edit_srv_' + servico.id"
                                                v-model="formEdicao.servicoIds" style="transform: scale(1.3);">
                                            <div class="ms-3 d-flex justify-content-between w-100 align-items-center mt-1">
                                                <span class="fw-bold text-dark">{{ servico.nome }}</span>
                                                <span class="text-success fw-bold bg-success bg-opacity-10 px-2 py-1 rounded">
                                                    {{ formatarMoeda(servico.valor) }}
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="row align-items-center bg-white p-3 rounded-3 shadow-sm border mt-4 mx-0">
                                <div class="col-md-6 mb-3 mb-md-0">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Pagamento</label>
                                    <select v-model="formEdicao.formaPagamento" class="form-select border-0 bg-light" required>
                                        <option value="DINHEIRO">Dinheiro (Local)</option>
                                        <option value="PIX">PIX (Local)</option>
                                        <option value="CARTAO">Cartão (Local)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 text-end">
                                    <span class="text-muted small d-block">Valor Total Estimado</span>
                                    <h3 class="fw-bold text-success mb-0">{{ formatarMoeda(valorTotalEdicao) }}</h3>
                                </div>
                            </div>

                            <div class="mt-4 text-end">
                                <button type="button" class="btn btn-light me-2" @click="fecharModalEdicao">Cancelar</button>
                                <button type="submit" class="btn btn-primary fw-bold px-4"
                                    :disabled="salvandoEdicao || formEdicao.servicoIds.length === 0 || !formEdicao.horarioId">
                                    <span v-if="salvandoEdicao" class="spinner-border spinner-border-sm me-2"></span>
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmModal ref="confirmModalRef" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast, Modal } from 'bootstrap';
import ConfirmModal from '../components/ConfirmModal.vue';
import { ehContaAdmin } from '../utils/funcionarios.js';
import { useTenantStore } from '../stores/tenant';

const router = useRouter();
const tenantStore = useTenantStore();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getConfig = () => ({ headers: { 'Authorization': `Bearer ${Cookies.get('access_token')}`, 'x-tenant-id': Cookies.get('tenant_id') } });
const getHoje = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().split('T')[0]; };
const getHoraAtual = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
const formatarDataPtBr = (isoString) => isoString ? new Date(isoString).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';
const corStatus = (status) => status === 'concluido' ? 'bg-success text-white' : status === 'cancelado' ? 'bg-danger text-white' : 'bg-primary-subtle text-primary border border-primary-subtle';

const classeTipoCobranca = (tipo) => {
    if (tipo === 'PLANO_TOTAL') return 'bg-success-subtle text-success border border-success-subtle';
    if (tipo === 'PARCIAL') return 'bg-warning-subtle text-warning border border-warning-subtle';
    return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
};
const labelTipoCobranca = (agenda) => {
    if (agenda.tipo === 'PLANO_TOTAL') return `Plano: ${agenda.planoAplicado || ''}`;
    if (agenda.tipo === 'PARCIAL') return `Parcial (Plano: ${agenda.planoAplicado || ''})`;
    return 'Avulso';
};

const confirmModalRef = ref(null);

const temModuloAgendamento = computed(() => tenantStore.hasAgendamento);
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
    } else if (type === 'warning') {
        toastRef.value.className = 'toast align-items-center text-bg-warning text-dark border-0';
        toastIcon.value = 'bi bi-exclamation-triangle-fill me-2';
    } else {
        toastRef.value.className = 'toast align-items-center text-bg-danger border-0';
        toastIcon.value = 'bi bi-exclamation-octagon-fill me-2';
    }
    if (!toastInstance.value) toastInstance.value = new Toast(toastRef.value);
    toastInstance.value.show();
};

const listaAgendamentos = ref([]);
const carregandoAgendamentos = ref(false);
const filtroDataInicio = ref(getHoje());
const filtroDataFim = ref(getHoje());
const filtroStatus = ref('TODOS');

const equipe = ref([]);
// A conta "Admin {loja}" administra, não presta serviço nem marca horário —
// não deve aparecer como opção de profissional pra reagendar.
const equipeParaAgendamento = computed(() => equipe.value.filter(f => !ehContaAdmin(f.nome)));
const servicosCatalogo = ref([]);

const agendamentosFiltrados = computed(() => {
    if (filtroStatus.value === 'TODOS') return listaAgendamentos.value;
    return listaAgendamentos.value.filter(a => a.status === filtroStatus.value);
});

const resetFiltro = () => {
    filtroDataInicio.value = getHoje();
    filtroDataFim.value = getHoje();
    carregarAgendamentos();
};

const carregarAgendamentos = async () => {
    if (!temModuloAgendamento.value) return;
    carregandoAgendamentos.value = true;
    try {
        const response = await axios.get(`${API_URL}/agendamentos`, { params: { inicio: filtroDataInicio.value, fim: filtroDataFim.value }, ...getConfig() });
        listaAgendamentos.value = response.data;
    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar os agendamentos.', 'danger');
    } finally {
        carregandoAgendamentos.value = false;
    }
};

const carregarEquipeEServicos = async () => {
    try {
        const [resEquipe, resServicos] = await Promise.all([
            axios.get(`${API_URL}/funcionarios`, getConfig()),
            axios.get(`${API_URL}/servicos`, getConfig())
        ]);
        equipe.value = resEquipe.data;
        servicosCatalogo.value = resServicos.data;
    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar profissionais/serviços.', 'danger');
    }
};

const concluirAgendamento = async (id) => {
    const ok = await confirmModalRef.value.confirmar('Deseja marcar este agendamento como CONCLUÍDO?', { titulo: 'Concluir agendamento', variante: 'primary', textoConfirmar: 'Concluir' });
    if (!ok) return;
    try {
        await axios.patch(`${API_URL}/agendamentos/${id}`, { status: 'concluido' }, getConfig());
        showToast('Agendamento concluído!', 'success');
        await carregarAgendamentos();
    } catch (error) {
        showToast('Erro ao concluir agendamento.', 'danger');
    }
};

const cancelarAgendamento = async (id) => {
    const ok = await confirmModalRef.value.confirmar('Deseja realmente CANCELAR este agendamento?', { titulo: 'Cancelar agendamento', textoConfirmar: 'Cancelar Agendamento' });
    if (!ok) return;
    try {
        await axios.patch(`${API_URL}/agendamentos/${id}/cancelar`, {}, getConfig());
        showToast('Agendamento cancelado com sucesso.', 'success');
        await carregarAgendamentos();
    } catch (error) {
        showToast('Erro ao cancelar agendamento.', 'danger');
    }
};

// =========================================================================
// EDIÇÃO DE AGENDAMENTO
// =========================================================================
const modalEdicaoRef = ref(null);
let bsModalEdicao = null;
const agendamentoEditando = ref(null);
const horariosParaEdicao = ref([]);
const carregandoHorariosEdicao = ref(false);
const salvandoEdicao = ref(false);

const formEdicao = ref({
    funcionarioId: '',
    data: '',
    horarioId: '',
    servicoIds: [],
    formaPagamento: 'PIX'
});

const valorTotalEdicao = computed(() =>
    servicosCatalogo.value
        .filter(s => formEdicao.value.servicoIds.includes(s.id))
        .reduce((total, s) => total + Number(s.valor), 0)
);

// Tenta casar o texto salvo em "servico" (ex: "Corte + Barba") com os IDs reais do catálogo
const casarServicosPeloNome = (textoServico) => {
    if (!textoServico) return [];
    const nomes = textoServico.split(' + ').map(n => n.trim());
    return servicosCatalogo.value
        .filter(s => nomes.includes(s.nome))
        .map(s => s.id);
};

const abrirModalEdicao = async (agenda) => {
    agendamentoEditando.value = agenda;
    formEdicao.value = {
        funcionarioId: agenda.funcionarioId,
        data: agenda.horario.data.split('T')[0],
        horarioId: agenda.horarioId,
        servicoIds: casarServicosPeloNome(agenda.servico),
        formaPagamento: agenda.formaPagamento || 'PIX'
    };

    if (!bsModalEdicao) bsModalEdicao = new Modal(modalEdicaoRef.value);
    bsModalEdicao.show();

    await buscarHorariosParaEdicao();
};

const fecharModalEdicao = () => {
    bsModalEdicao?.hide();
};

const buscarHorariosParaEdicao = async () => {
    if (!formEdicao.value.funcionarioId || !formEdicao.value.data) return;
    carregandoHorariosEdicao.value = true;
    horariosParaEdicao.value = [];
    try {
        const response = await axios.get(`${API_URL}/funcionarios/${formEdicao.value.funcionarioId}/horarios`, { params: { inicio: formEdicao.value.data, fim: formEdicao.value.data }, ...getConfig() });
        const horarioAtualDoAgendamento = agendamentoEditando.value?.horarioId;
        const ehHoje = formEdicao.value.data === getHoje();
        const horaAtual = getHoraAtual();

        horariosParaEdicao.value = (response.data.horarios || []).filter(h => {
            // O horário que já pertence a este agendamento sempre pode ser mantido
            if (h.id === horarioAtualDoAgendamento) return true;
            if (h.disponivel !== true) return false;
            if (ehHoje && h.horaInicio <= horaAtual) return false;
            return true;
        });

        // Se o horário atual não estiver mais na lista (ex: mudou de funcionário), limpa a seleção
        if (!horariosParaEdicao.value.some(h => h.id === formEdicao.value.horarioId)) {
            formEdicao.value.horarioId = '';
        }
    } catch (error) {
        showToast('Erro ao carregar horários disponíveis.', 'danger');
    } finally {
        carregandoHorariosEdicao.value = false;
    }
};

const salvarEdicao = async () => {
    salvandoEdicao.value = true;
    try {
        await axios.patch(`${API_URL}/agendamentos/${agendamentoEditando.value.id}`, {
            funcionarioId: formEdicao.value.funcionarioId,
            horarioId: formEdicao.value.horarioId,
            servicoIds: formEdicao.value.servicoIds,
            formaPagamento: formEdicao.value.formaPagamento
        }, getConfig());

        showToast('Agendamento atualizado com sucesso!', 'success');
        fecharModalEdicao();
        await carregarAgendamentos();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao atualizar agendamento.', 'danger');
    } finally {
        salvandoEdicao.value = false;
    }
};

// O MainLayout já busca as permissões da loja uma única vez por sessão e
// guarda na store — aqui só lemos o resultado, sem refazer o fetch nem
// mostrar loading próprio. Se "Agenda" apareceu no menu, é porque esse
// acesso já foi confirmado.
const iniciarSeLiberado = () => {
    if (temModuloAgendamento.value) {
        Promise.all([carregarAgendamentos(), carregarEquipeEServicos()]);
    }
};

onMounted(() => {
    if (toastRef.value) toastInstance.value = new Toast(toastRef.value);

    if (tenantStore.carregado) {
        iniciarSeLiberado();
    } else {
        // Navegação direta pra /agendamentos (URL digitada, F5) — a store
        // ainda não resolveu; reage assim que o MainLayout terminar de buscar.
        const pararDeObservar = watch(() => tenantStore.carregado, (carregado) => {
            if (carregado) { iniciarSeLiberado(); pararDeObservar(); }
        });
    }
});
</script>
