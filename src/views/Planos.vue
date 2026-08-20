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
                    <h2 class="fw-bold text-dark mb-1"><i class="bi bi-award-fill text-primary me-2"></i> Planos de
                        Assinatura</h2>
                    <p class="text-muted mb-0">Monte seus próprios planos e assine seus clientes neles.</p>
                </div>
                <button class="btn btn-outline-secondary fw-bold shadow-sm mt-3 mt-md-0" @click="router.push('/home')">
                    <i class="bi bi-arrow-left me-1"></i> Voltar ao Painel
                </button>
            </div>
        </div>

        <div v-if="carregandoPermissoes" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="!temModuloAssinaturas" class="alert alert-warning border-0 shadow-sm d-flex align-items-center p-4">
            <i class="bi bi-lock-fill fs-1 me-4 text-warning"></i>
            <div>
                <h5 class="fw-bold mb-1">Recurso Indisponível no seu Plano</h5>
                <p class="mb-0">O módulo de Planos de Assinatura não está ativo no seu plano atual. Entre em contato
                    com o suporte para fazer o upgrade.</p>
            </div>
        </div>

        <div v-else>
            <ul class="nav nav-pills bg-light p-1 rounded-3 mb-4 d-inline-flex">
                <li class="nav-item">
                    <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'PLANOS' }"
                        @click="abaAtiva = 'PLANOS'">
                        <i class="bi bi-award me-1"></i> Meus Planos
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'ASSINATURAS' }"
                        @click="abaAtiva = 'ASSINATURAS'">
                        <i class="bi bi-person-check me-1"></i> Assinaturas
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'HISTORICO' }"
                        @click="abaAtiva = 'HISTORICO'; carregarHistoricoRenovacoes()">
                        <i class="bi bi-clock-history me-1"></i> Histórico de Renovações
                    </button>
                </li>
            </ul>

            <!-- ========================= ABA: MEUS PLANOS ========================= -->
            <div v-if="abaAtiva === 'PLANOS'">
                <div class="d-flex justify-content-end mb-3">
                    <button class="btn btn-success fw-bold shadow-sm" @click="abrirModalNovoPlano">
                        <i class="bi bi-plus-lg me-1"></i> Novo Plano
                    </button>
                </div>

                <div class="text-center py-5" v-if="carregandoPlanos">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>

                <div v-else-if="planos.length === 0" class="text-center py-5 text-muted">
                    <i class="bi bi-award display-4 d-block mb-3 opacity-25"></i>
                    <p class="mb-0">Nenhum plano criado ainda. Clique em "Novo Plano" para começar.</p>
                </div>

                <div v-else class="row g-3">
                    <div class="col-md-6 col-xl-4" v-for="plano in planos" :key="plano.id">
                        <div class="card border-0 shadow-sm h-100" :class="{ 'opacity-50': !plano.ativo }">
                            <div class="card-body d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="fw-bold text-dark mb-0">{{ plano.nome }}</h5>
                                    <span class="badge" :class="plano.ativo ? 'bg-success' : 'bg-secondary'">
                                        {{ plano.ativo ? 'Ativo' : 'Inativo' }}
                                    </span>
                                </div>
                                <h3 class="fw-bold text-primary mb-3">{{ formatarMoeda(plano.valorMensal) }}<small
                                        class="text-muted fs-6 fw-normal">/mês</small></h3>

                                <div class="mb-2">
                                    <span class="badge bg-primary-subtle text-primary border">
                                        <i class="bi" :class="plano.ilimitado ? 'bi-infinity' : 'bi-123'"></i>
                                        {{ plano.ilimitado ? 'Uso ilimitado' : `${plano.qtdCreditos} uso(s) por mês` }}
                                    </span>
                                </div>

                                <div class="mb-2">
                                    <span class="badge bg-light text-dark border">
                                        <i class="bi bi-calendar-week me-1"></i> {{ descreverDias(plano.diasPermitidos) }}
                                    </span>
                                </div>

                                <div class="flex-grow-1 mb-3">
                                    <small class="text-muted d-block mb-1">Serviços inclusos:</small>
                                    <div v-if="plano.servicos.length === 0" class="text-muted small fst-italic">Nenhum
                                        serviço vinculado</div>
                                    <div class="d-flex flex-wrap gap-1" v-else>
                                        <span class="badge bg-light text-secondary border fw-normal"
                                            v-for="s in plano.servicos" :key="s.id">{{ s.nome }}</span>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                                    <small class="text-muted">{{ plano._count?.assinaturas || 0 }} assinante(s)</small>
                                    <div>
                                        <button class="btn btn-sm text-primary" @click="abrirModalEdicaoPlano(plano)">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button class="btn btn-sm text-danger" @click="excluirPlano(plano)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========================= ABA: ASSINATURAS ========================= -->
            <div v-else-if="abaAtiva === 'ASSINATURAS'">
                <div class="card border-0 shadow-sm mb-3">
                    <div class="card-body">
                        <label class="fw-bold small text-muted mb-2 d-block">Buscar Cliente</label>
                        <input type="text" class="form-control"
                            placeholder="Nome, e-mail ou telefone... (deixe em branco para ver todos)"
                            v-model="buscaCliente" @input="onBuscaClienteInput">

                        <div class="text-center text-muted small mt-3" v-if="buscandoClientes">
                            <span class="spinner-border spinner-border-sm me-2"></span> Carregando...
                        </div>

                        <template v-else>
                            <div class="list-group mt-2" v-if="clientesEncontrados.length > 0">
                                <button type="button" class="list-group-item list-group-item-action"
                                    v-for="c in clientesEncontrados" :key="c.id" @click="selecionarCliente(c)">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="fw-bold">{{ c.nome }}</span>
                                        <span class="badge bg-light text-dark border" v-if="c.assinatura">{{
                                            c.assinatura.nomePlano }}</span>
                                    </div>
                                    <small class="text-muted">{{ c.email || c.telefone || 'Sem contato cadastrado'
                                        }}</small>
                                </button>
                            </div>

                            <div class="text-muted small mt-2 fst-italic" v-else>
                                {{ buscaCliente.trim() ? 'Nenhum cliente encontrado com esse termo.' : 'Nenhum cliente cadastrado ainda.' }}
                            </div>

                            <div class="d-flex justify-content-between align-items-center mt-3"
                                v-if="totalClientes > porPagina">
                                <small class="text-muted">{{ totalClientes }} cliente(s) — página {{ paginaAtual }}
                                    de {{ totalPaginas }}</small>
                                <div class="btn-group btn-group-sm">
                                    <button type="button" class="btn btn-outline-secondary" :disabled="paginaAtual <= 1"
                                        @click="irParaPagina(paginaAtual - 1)">
                                        <i class="bi bi-chevron-left"></i> Anterior
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary"
                                        :disabled="paginaAtual >= totalPaginas" @click="irParaPagina(paginaAtual + 1)">
                                        Próxima <i class="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="card border-0 shadow-sm" v-if="clienteSelecionado">
                    <div class="card-body">
                        <h5 class="fw-bold mb-3">{{ clienteSelecionado.nome }}</h5>

                        <div v-if="clienteSelecionado.assinatura" class="alert alert-light border mb-3">
                            <strong>Plano atual:</strong> {{ clienteSelecionado.assinatura.nomePlano }} —
                            {{ clienteSelecionado.assinatura.creditosRestantes }} crédito(s) restante(s)
                            <button class="btn btn-sm btn-outline-danger float-end" @click="cancelarAssinatura">
                                Cancelar assinatura
                            </button>
                        </div>

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="small fw-bold">Plano</label>
                                <select class="form-select" v-model="formAssinatura.planoId">
                                    <option value="" disabled>Selecione um plano...</option>
                                    <option v-for="p in planosAtivos" :key="p.id" :value="p.id">{{ p.nome }} ({{
                                        formatarMoeda(p.valorMensal) }}/mês)</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="small fw-bold">Duração (meses)</label>
                                <input type="number" min="1" class="form-control" v-model="formAssinatura.mesesDePlano">
                            </div>
                            <div class="col-md-3">
                                <label class="small fw-bold">Forma de Pagamento</label>
                                <select class="form-select" v-model="formAssinatura.formaPagamento">
                                    <option value="DINHEIRO">Dinheiro</option>
                                    <option value="PIX">PIX</option>
                                    <option value="CARTAO">Cartão</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="small fw-bold">Data de Início</label>
                                <input type="date" class="form-control" v-model="formAssinatura.dataInicio">
                            </div>
                        </div>

                        <button class="btn btn-success fw-bold mt-3" :disabled="!formAssinatura.planoId || salvandoAssinatura"
                            @click="assinarCliente">
                            <span v-if="salvandoAssinatura" class="spinner-border spinner-border-sm me-2"></span>
                            Assinar Plano
                        </button>
                    </div>
                </div>
            </div>

            <!-- ========================= ABA: HISTÓRICO DE RENOVAÇÕES ========================= -->
            <div v-else>
                <div class="text-center py-5" v-if="carregandoHistorico">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>

                <div v-else-if="historicoRenovacoes.length === 0" class="text-center py-5 text-muted">
                    <i class="bi bi-clock-history display-4 d-block mb-3 opacity-25"></i>
                    <p class="mb-0">Nenhuma assinatura ou renovação registrada ainda.</p>
                </div>

                <div v-else class="card border-0 shadow-sm">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="px-3">Data</th>
                                    <th>Cliente</th>
                                    <th>Plano</th>
                                    <th class="text-end px-3">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="r in historicoRenovacoes" :key="r.id">
                                    <td class="px-3">{{ formatarData(r.dataRenovacao) }}</td>
                                    <td>{{ r.assinatura?.cliente?.nome || '—' }}</td>
                                    <td>{{ r.tipoPlano }}</td>
                                    <td class="text-end px-3 fw-bold text-success">{{ formatarMoeda(r.valor) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: CRIAR/EDITAR PLANO -->
        <div class="modal fade" id="modalPlano" tabindex="-1" ref="modalPlanoRef" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header" :class="modoEdicaoPlano ? 'bg-warning' : 'bg-primary text-white'">
                        <h5 class="modal-title fw-bold">
                            {{ modoEdicaoPlano ? 'Editar Plano' : 'Novo Plano' }}
                        </h5>
                        <button type="button" class="btn-close" :class="{ 'btn-close-white': !modoEdicaoPlano }"
                            data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="salvarPlano">
                            <div class="row g-3 mb-3">
                                <div class="col-md-7">
                                    <label class="small fw-bold">Nome do Plano</label>
                                    <input type="text" class="form-control" v-model="formPlano.nome"
                                        placeholder="Ex: Plano Premium" required>
                                </div>
                                <div class="col-md-5">
                                    <label class="small fw-bold">Valor Mensal</label>
                                    <CurrencyInput v-model="formPlano.valorMensal" required />
                                </div>
                            </div>

                            <div class="mb-3 p-3 bg-light rounded-3 border">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="switchIlimitado"
                                        v-model="formPlano.ilimitado">
                                    <label class="form-check-label fw-bold" for="switchIlimitado">Uso ilimitado dos
                                        serviços inclusos</label>
                                </div>
                                <div class="mt-2" v-if="!formPlano.ilimitado">
                                    <label class="small fw-bold">Quantidade de usos por mês</label>
                                    <input type="number" min="1" class="form-control" style="max-width: 160px;"
                                        v-model="formPlano.qtdCreditos" required>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="small fw-bold d-block mb-2">Serviços inclusos</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <label class="chip-checkbox" v-for="s in servicosDisponiveis" :key="s.id">
                                        <input class="form-check-input m-0" type="checkbox" :value="s.id"
                                            v-model="formPlano.servicoIds">
                                        <span>{{ s.nome }}</span>
                                    </label>
                                    <div v-if="servicosDisponiveis.length === 0" class="text-muted small fst-italic">
                                        Cadastre serviços primeiro para poder incluí-los num plano.
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="small fw-bold d-block mb-2">Dias válidos para uso</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <label class="chip-checkbox" v-for="(dia, idx) in diasSemanaLabels" :key="idx">
                                        <input class="form-check-input m-0" type="checkbox" :value="idx"
                                            v-model="formPlano.diasPermitidos">
                                        <span>{{ dia }}</span>
                                    </label>
                                </div>
                                <div class="form-text">Deixe todos marcados para valer todos os dias.</div>
                            </div>

                            <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="salvandoPlano">
                                <span v-if="salvandoPlano" class="spinner-border spinner-border-sm me-2"></span>
                                {{ modoEdicaoPlano ? 'Salvar Alterações' : 'Criar Plano' }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmModal ref="confirmModalRef" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Modal, Toast } from 'bootstrap';
import CurrencyInput from '../components/CurrencyInput.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getConfig = () => ({ headers: { 'Authorization': `Bearer ${Cookies.get('access_token')}`, 'x-tenant-id': Cookies.get('tenant_id') } });
const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
const formatarData = (d) => new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

const diasSemanaLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const descreverDias = (diasPermitidos) => {
    if (!diasPermitidos || diasPermitidos.length === 0 || diasPermitidos.length === 7) return 'Todos os dias';
    return diasPermitidos.slice().sort().map(d => diasSemanaLabels[d]).join(', ');
};

// =========================================================================
//  TOAST
// =========================================================================
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

// =========================================================================
//  MÓDULO / GATING
// =========================================================================
const temModuloAssinaturas = ref(false);
const carregandoPermissoes = ref(true);
const abaAtiva = ref('PLANOS');
const confirmModalRef = ref(null);

// =========================================================================
//  ABA 1: PLANOS
// =========================================================================
const planos = ref([]);
const servicosDisponiveis = ref([]);
const carregandoPlanos = ref(false);
const salvandoPlano = ref(false);
const modoEdicaoPlano = ref(false);
const idPlanoEmEdicao = ref(null);
const modalPlanoRef = ref(null);
let bsModalPlano = null;

const planosAtivos = computed(() => planos.value.filter(p => p.ativo));

const formPlanoVazio = () => ({
    nome: '',
    valorMensal: 0,
    ilimitado: false,
    qtdCreditos: 4,
    servicoIds: [],
    diasPermitidos: [0, 1, 2, 3, 4, 5, 6],
});
const formPlano = ref(formPlanoVazio());

const carregarPlanos = async () => {
    carregandoPlanos.value = true;
    try {
        const response = await axios.get(`${API_URL}/planos`, getConfig());
        planos.value = response.data;
    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar os planos.', 'danger');
    } finally {
        carregandoPlanos.value = false;
    }
};

const carregarServicos = async () => {
    try {
        const response = await axios.get(`${API_URL}/servicos`, getConfig());
        servicosDisponiveis.value = response.data;
    } catch (error) {
        console.error(error);
    }
};

const abrirModalNovoPlano = () => {
    modoEdicaoPlano.value = false;
    idPlanoEmEdicao.value = null;
    formPlano.value = formPlanoVazio();
    if (!bsModalPlano) bsModalPlano = new Modal(modalPlanoRef.value);
    bsModalPlano.show();
};

const abrirModalEdicaoPlano = (plano) => {
    modoEdicaoPlano.value = true;
    idPlanoEmEdicao.value = plano.id;
    formPlano.value = {
        nome: plano.nome,
        valorMensal: Number(plano.valorMensal),
        ilimitado: plano.ilimitado,
        qtdCreditos: plano.qtdCreditos || 1,
        servicoIds: plano.servicos.map(s => s.id),
        diasPermitidos: plano.diasPermitidos && plano.diasPermitidos.length > 0 ? [...plano.diasPermitidos] : [0, 1, 2, 3, 4, 5, 6],
    };
    if (!bsModalPlano) bsModalPlano = new Modal(modalPlanoRef.value);
    bsModalPlano.show();
};

const salvarPlano = async () => {
    salvandoPlano.value = true;
    try {
        const payload = {
            nome: formPlano.value.nome,
            valorMensal: Number(formPlano.value.valorMensal),
            ilimitado: formPlano.value.ilimitado,
            qtdCreditos: formPlano.value.ilimitado ? 0 : Number(formPlano.value.qtdCreditos),
            servicoIds: formPlano.value.servicoIds,
            // Todos os 7 marcados = sem restrição (manda null)
            diasPermitidos: formPlano.value.diasPermitidos.length === 7 ? null : formPlano.value.diasPermitidos,
        };

        if (modoEdicaoPlano.value) {
            await axios.put(`${API_URL}/planos/${idPlanoEmEdicao.value}`, payload, getConfig());
            showToast('Plano atualizado com sucesso!');
        } else {
            await axios.post(`${API_URL}/planos`, payload, getConfig());
            showToast('Plano criado com sucesso!');
        }

        bsModalPlano.hide();
        await carregarPlanos();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao salvar o plano.', 'danger');
    } finally {
        salvandoPlano.value = false;
    }
};

const excluirPlano = async (plano) => {
    const ok = await confirmModalRef.value.confirmar(`Excluir o plano "${plano.nome}"?`, {
        titulo: 'Excluir plano', textoConfirmar: 'Excluir'
    });
    if (!ok) return;
    try {
        await axios.delete(`${API_URL}/planos/${plano.id}`, getConfig());
        showToast('Plano excluído.');
        await carregarPlanos();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao excluir o plano.', 'danger');
    }
};

// =========================================================================
//  ABA 2: ASSINATURAS
// =========================================================================
const buscaCliente = ref('');
const clientesEncontrados = ref([]);
const buscandoClientes = ref(false);
const totalClientes = ref(0);
const paginaAtual = ref(1);
const porPagina = 10;
const clienteSelecionado = ref(null);
const salvandoAssinatura = ref(false);
let timeoutBusca = null;

const totalPaginas = computed(() => Math.max(1, Math.ceil(totalClientes.value / porPagina)));

const getLocalISODate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const formAssinaturaVazio = () => ({
    planoId: '',
    mesesDePlano: 1,
    formaPagamento: 'PIX',
    dataInicio: getLocalISODate(new Date()),
});
const formAssinatura = ref(formAssinaturaVazio());

const carregarClientesLista = async () => {
    buscandoClientes.value = true;
    try {
        const response = await axios.get(`${API_URL}/clientes`, {
            params: {
                busca: buscaCliente.value.trim() || undefined,
                skip: (paginaAtual.value - 1) * porPagina,
                take: porPagina,
            },
            ...getConfig()
        });
        clientesEncontrados.value = response.data.data || [];
        totalClientes.value = response.data.total || 0;
    } catch (error) {
        console.error(error);
        clientesEncontrados.value = [];
        showToast(error.response?.data?.message || 'Erro ao buscar clientes.', 'danger');
    } finally {
        buscandoClientes.value = false;
    }
};

const onBuscaClienteInput = () => {
    if (timeoutBusca) clearTimeout(timeoutBusca);
    timeoutBusca = setTimeout(() => {
        paginaAtual.value = 1;
        carregarClientesLista();
    }, 400);
};

const irParaPagina = (pagina) => {
    if (pagina < 1 || pagina > totalPaginas.value) return;
    paginaAtual.value = pagina;
    carregarClientesLista();
};

const selecionarCliente = (cliente) => {
    clienteSelecionado.value = cliente;
    buscaCliente.value = '';
    paginaAtual.value = 1;
    carregarClientesLista();
    formAssinatura.value = formAssinaturaVazio();
};

const assinarCliente = async () => {
    salvandoAssinatura.value = true;
    try {
        await axios.post(`${API_URL}/planos/assinaturas`, {
            clienteId: clienteSelecionado.value.id,
            planoId: formAssinatura.value.planoId,
            dataInicio: formAssinatura.value.dataInicio,
            mesesDePlano: Number(formAssinatura.value.mesesDePlano),
            formaPagamento: formAssinatura.value.formaPagamento,
        }, getConfig());

        showToast('Cliente assinado no plano com sucesso!');

        // Recarrega os dados do cliente selecionado pra já refletir a nova assinatura
        const response = await axios.get(`${API_URL}/clientes/${clienteSelecionado.value.id}`, getConfig());
        const c = response.data;
        clienteSelecionado.value = {
            ...clienteSelecionado.value,
            assinatura: c.assinatura ? {
                nomePlano: c.assinatura.plano.nome,
                creditosRestantes: c.assinatura.ilimitado ? '∞' : (c.assinatura.limiteCreditos - c.assinatura.creditosUsados)
            } : null
        };
        await carregarPlanos();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao assinar o cliente no plano.', 'danger');
    } finally {
        salvandoAssinatura.value = false;
    }
};

const cancelarAssinatura = async () => {
    const ok = await confirmModalRef.value.confirmar('Cancelar a assinatura deste cliente?', {
        titulo: 'Cancelar assinatura', textoConfirmar: 'Cancelar Assinatura'
    });
    if (!ok) return;
    try {
        await axios.patch(`${API_URL}/planos/assinaturas/${clienteSelecionado.value.id}/cancelar`, {}, getConfig());
        showToast('Assinatura cancelada.');
        clienteSelecionado.value.assinatura = null;
        await carregarPlanos();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao cancelar a assinatura.', 'danger');
    }
};

// =========================================================================
//  ABA 3: HISTÓRICO DE RENOVAÇÕES
// =========================================================================
const historicoRenovacoes = ref([]);
const carregandoHistorico = ref(false);

const carregarHistoricoRenovacoes = async () => {
    carregandoHistorico.value = true;
    try {
        const response = await axios.get(`${API_URL}/planos/historico-renovacoes`, getConfig());
        historicoRenovacoes.value = response.data;
    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar o histórico de renovações.', 'danger');
    } finally {
        carregandoHistorico.value = false;
    }
};

// =========================================================================
//  CICLO DE VIDA
// =========================================================================
onMounted(async () => {
    if (toastRef.value) toastInstance.value = new Toast(toastRef.value);
    bsModalPlano = new Modal(modalPlanoRef.value);

    try {
        const tenantId = Cookies.get('tenant_id');
        if (tenantId) {
            const response = await axios.get(`${API_URL}/tenants/${tenantId}/plano`, getConfig());
            temModuloAssinaturas.value = response.data.moduloAssinaturas === true;
        }
    } catch (error) {
        console.error('Erro ao buscar as permissões dos módulos:', error);
    } finally {
        carregandoPermissoes.value = false;
    }

    if (temModuloAssinaturas.value) {
        await Promise.all([carregarPlanos(), carregarServicos(), carregarClientesLista()]);
    }
});
</script>

<style scoped>
.chip-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    padding: 0.5rem 0.9rem;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    cursor: pointer;
    user-select: none;
    background: #fff;
    transition: border-color 0.15s ease, background-color 0.15s ease;
}

.chip-checkbox:has(input:checked) {
    border-color: #0d6efd;
    background: rgba(13, 110, 253, 0.08);
}
</style>

