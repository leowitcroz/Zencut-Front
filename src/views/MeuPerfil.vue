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
            <div class="col-12">
                <h2 class="fw-bold text-dark mb-1"><i class="bi bi-person-circle text-primary me-2"></i> Meu Perfil</h2>
                <p class="text-muted mb-0">Seus dados de acesso, seus agendamentos e seu financeiro individual.</p>
            </div>
        </div>

        <ul class="nav nav-pills bg-light p-1 rounded-3 mb-4 d-inline-flex">
            <li class="nav-item">
                <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'PERFIL' }"
                    @click="abaAtiva = 'PERFIL'">
                    <i class="bi bi-person-fill me-1"></i> Perfil
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'AGENDAMENTOS' }"
                    @click="abaAtiva = 'AGENDAMENTOS'; carregarMeusAgendamentos()">
                    <i class="bi bi-calendar-event me-1"></i> Meus Agendamentos
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'FINANCEIRO' }"
                    @click="abaAtiva = 'FINANCEIRO'; carregarMeuFinanceiro()">
                    <i class="bi bi-cash-coin me-1"></i> Meu Financeiro
                </button>
            </li>
        </ul>

        <!-- ========================= ABA: PERFIL ========================= -->
        <div class="row g-4" v-if="abaAtiva === 'PERFIL'">
            <div class="col-12 col-lg-5">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-body p-4 text-center">
                        <div v-if="carregandoPerfil" class="py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                        </div>
                        <template v-else>
                            <img v-if="perfil.fotoUrl" :src="perfil.fotoUrl" class="rounded-circle mb-3"
                                style="width: 96px; height: 96px; object-fit: cover;">
                            <div v-else class="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center mb-3"
                                style="width: 96px; height: 96px;">
                                <i class="bi bi-person-fill" style="font-size: 3rem;"></i>
                            </div>
                            <h4 class="fw-bold mb-1">{{ perfil.nome }}</h4>
                            <p class="text-muted mb-2">{{ perfil.email }}</p>
                            <span class="badge rounded-pill px-3 py-2"
                                :class="perfil.role === 1 ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'">
                                <i class="bi bi-shield-fill me-1"></i> {{ perfil.role === 1 ? 'Administrador' : 'Funcionário' }}
                            </span>
                        </template>
                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-7">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-bottom-0 pt-3">
                        <h6 class="fw-bold mb-0"><i class="bi bi-key-fill text-warning me-2"></i> Alterar Senha</h6>
                        <p class="text-muted small mb-0">Troque a senha padrão por uma de sua escolha.</p>
                    </div>
                    <div class="card-body p-4">
                        <form @submit.prevent="salvarNovaSenha">
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted text-uppercase">Senha Atual</label>
                                <input v-model="formSenha.senhaAtual" type="password" class="form-control form-control-lg"
                                    autocomplete="current-password" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted text-uppercase">Nova Senha</label>
                                <input v-model="formSenha.novaSenha" type="password" class="form-control form-control-lg"
                                    autocomplete="new-password" minlength="6" required>
                                <div class="form-text">Mínimo de 6 caracteres.</div>
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted text-uppercase">Confirmar Nova Senha</label>
                                <input v-model="formSenha.confirmarSenha" type="password" class="form-control form-control-lg"
                                    autocomplete="new-password" minlength="6" required>
                            </div>
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary fw-bold" :disabled="salvandoSenha">
                                    <span v-if="salvandoSenha" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-check-lg me-1"></i> Salvar Nova Senha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Cores, banner, WhatsApp e demais dados da vitrine pública agora ficam
                 em Minha Vitrine (aba própria no menu), com prévia da página inteira. -->
            <div class="col-12" v-if="perfil.role === 1">
                <router-link to="/minha-vitrine" class="btn btn-outline-primary fw-bold">
                    <i class="bi bi-shop-window me-1"></i> Personalizar minha vitrine pública
                </router-link>
            </div>
        </div>

        <!-- ========================= ABA: MEUS AGENDAMENTOS ========================= -->
        <div v-else-if="abaAtiva === 'AGENDAMENTOS'">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-bottom-0 pt-3">
                    <div class="row align-items-end g-3">
                        <div class="col-md-8">
                            <label class="form-label fw-bold text-muted small text-uppercase">Período</label>
                            <div class="input-group shadow-sm">
                                <span class="input-group-text bg-white border-end-0"><i class="bi bi-calendar3"></i></span>
                                <input type="date" class="form-control border-start-0 ps-0" v-model="agFiltroInicio"
                                    @change="carregarMeusAgendamentos">
                                <span class="input-group-text bg-white border-0">até</span>
                                <input type="date" class="form-control border-start-0 ps-0" v-model="agFiltroFim"
                                    @change="carregarMeusAgendamentos">
                                <button class="btn btn-white border-0 bg-white text-primary fw-bold" @click="resetAgFiltro">Hoje</button>
                            </div>
                        </div>
                        <div class="col-md-4 text-md-end">
                            <button class="btn btn-outline-secondary shadow-sm w-100" @click="carregarMeusAgendamentos">
                                <i class="bi bi-arrow-clockwise me-1"></i> Atualizar
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="text-center py-5" v-if="carregandoMeusAgendamentos">
                        <div class="spinner-border text-primary" role="status"></div>
                    </div>
                    <div v-else-if="meusAgendamentos.length > 0" class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="border-0 px-4 py-3">Data / Hora</th>
                                    <th class="border-0 py-3">Cliente</th>
                                    <th class="border-0 py-3">Serviço</th>
                                    <th class="border-0 py-3">Cobrança</th>
                                    <th class="border-0 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="agenda in meusAgendamentos" :key="agenda.id">
                                    <td class="px-4 text-nowrap">
                                        <span class="d-block fw-bold text-dark">{{ formatarDataPtBr(agenda.horario.data) }}</span>
                                        <small class="text-muted"><i class="bi bi-clock me-1"></i> {{ agenda.horario.horaInicio }}</small>
                                    </td>
                                    <td class="fw-medium">{{ agenda.cliente ? agenda.cliente.nome : agenda.nomeCliente }}</td>
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
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="text-center py-5 text-muted">
                        <i class="bi bi-calendar2-x display-4 d-block mb-3 opacity-25"></i>
                        <h6>Nenhum agendamento seu neste período.</h6>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================= ABA: MEU FINANCEIRO ========================= -->
        <div v-else>
            <div class="d-flex justify-content-end mb-3">
                <div class="input-group shadow-sm" style="max-width: 320px;">
                    <span class="input-group-text bg-white border-end-0"><i class="bi bi-calendar3"></i></span>
                    <input type="date" class="form-control border-start-0 ps-0" v-model="finInicio" @change="carregarMeuFinanceiro">
                    <span class="input-group-text bg-white border-0">até</span>
                    <input type="date" class="form-control border-start-0 ps-0" v-model="finFim" @change="carregarMeuFinanceiro">
                </div>
            </div>

            <div class="text-center py-5" v-if="carregandoMeuFinanceiro">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <RelatorioBarbeiroDetalhe v-else :dados="meuFinanceiro" :mostrar-arrecadacao="false" />
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast } from 'bootstrap';
import RelatorioBarbeiroDetalhe from '../components/RelatorioBarbeiroDetalhe.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const getConfig = () => ({ headers: { 'Authorization': `Bearer ${Cookies.get('access_token')}`, 'x-tenant-id': Cookies.get('tenant_id') } });
const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
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
const getLocalISODate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};
const getHoje = () => getLocalISODate(new Date());

const abaAtiva = ref('PERFIL');

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

// =========================================================================
//  ABA: PERFIL
// =========================================================================
const perfil = ref({ nome: '', email: '', role: 2 });
const carregandoPerfil = ref(false);

const formSenha = ref({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
const salvandoSenha = ref(false);

const carregarPerfil = async () => {
    carregandoPerfil.value = true;
    try {
        const response = await axios.get(`${API_URL}/funcionarios/me`, getConfig());
        perfil.value = response.data;
    } catch (error) {
        showToast('Erro ao carregar os dados do perfil.', 'danger');
    } finally {
        carregandoPerfil.value = false;
    }
};

const salvarNovaSenha = async () => {
    if (formSenha.value.novaSenha.length < 6) {
        showToast('A nova senha deve ter pelo menos 6 caracteres.', 'warning');
        return;
    }
    if (formSenha.value.novaSenha !== formSenha.value.confirmarSenha) {
        showToast('A confirmação não bate com a nova senha.', 'warning');
        return;
    }

    salvandoSenha.value = true;
    try {
        await axios.patch(`${API_URL}/funcionarios/senha`, {
            senhaAtual: formSenha.value.senhaAtual,
            novaSenha: formSenha.value.novaSenha
        }, getConfig());

        showToast('Senha alterada com sucesso!', 'success');
        formSenha.value = { senhaAtual: '', novaSenha: '', confirmarSenha: '' };
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao alterar a senha.', 'danger');
    } finally {
        salvandoSenha.value = false;
    }
};

// =========================================================================
//  ABA: MEUS AGENDAMENTOS
// =========================================================================
const meusAgendamentos = ref([]);
const carregandoMeusAgendamentos = ref(false);
const agFiltroInicio = ref(getHoje());
const agFiltroFim = ref(getHoje());

const resetAgFiltro = () => {
    agFiltroInicio.value = getHoje();
    agFiltroFim.value = getHoje();
    carregarMeusAgendamentos();
};

const carregarMeusAgendamentos = async () => {
    carregandoMeusAgendamentos.value = true;
    try {
        const response = await axios.get(`${API_URL}/agendamentos/meus`, {
            params: { inicio: agFiltroInicio.value, fim: agFiltroFim.value },
            ...getConfig()
        });
        meusAgendamentos.value = response.data;
    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar seus agendamentos.', 'danger');
    } finally {
        carregandoMeusAgendamentos.value = false;
    }
};

// =========================================================================
//  ABA: MEU FINANCEIRO
//  Chama a MESMA função (via endpoint self-service) que o dono usa no
//  relatório de equipe — os números batem sempre, porque é o mesmo cálculo.
// =========================================================================
const meuFinanceiro = ref({ totalServicosRealizados: 0, totalFaturamento: 0, comissaoTotal: 0 });
const carregandoMeuFinanceiro = ref(false);

const dataRef = new Date();
const finInicio = ref(getLocalISODate(new Date(dataRef.getFullYear(), dataRef.getMonth(), 1)));
const finFim = ref(getLocalISODate(new Date(dataRef.getFullYear(), dataRef.getMonth() + 1, 0)));

const carregarMeuFinanceiro = async () => {
    carregandoMeuFinanceiro.value = true;
    try {
        const response = await axios.get(`${API_URL}/financeiro/meu-relatorio`, {
            params: { inicio: finInicio.value, fim: finFim.value },
            ...getConfig()
        });
        meuFinanceiro.value = response.data;
    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar seu financeiro.', 'danger');
    } finally {
        carregandoMeuFinanceiro.value = false;
    }
};

onMounted(async () => {
    if (toastRef.value) toastInstance.value = new Toast(toastRef.value);
    await carregarPerfil();
});
</script>
