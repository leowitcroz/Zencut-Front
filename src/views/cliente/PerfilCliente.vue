<template>
    <div class="container fade-in">
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

        <ConfirmModal ref="confirmModalRef" />

        <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
            <div>
                <h2 class="fw-bold text-dark mb-1">Área do Cliente</h2>
                <p class="text-muted mb-0">Agende horários, acompanhe seu plano e veja nossos serviços.</p>
            </div>
            <div class="mt-3 mt-md-0">
                <button @click="logout" class="btn btn-outline-danger fw-bold shadow-sm">
                    <i class="bi bi-box-arrow-right me-2"></i> Sair da Conta
                </button>
            </div>
        </div>

        <ul class="nav nav-pills bg-light p-1 rounded-3 mb-4 flex-wrap">
            <li class="nav-item">
                <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'AGENDAR' }"
                    @click="abaAtiva = 'AGENDAR'">
                    <i class="bi bi-calendar-plus me-1"></i> Agendar
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'AGENDAMENTOS' }"
                    @click="abaAtiva = 'AGENDAMENTOS'">
                    <i class="bi bi-calendar-check me-1"></i> Meus Agendamentos
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'PLANOS' }"
                    @click="abaAtiva = 'PLANOS'">
                    <i class="bi bi-award me-1"></i> Planos
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'CATALOGO' }"
                    @click="abaAtiva = 'CATALOGO'">
                    <i class="bi bi-basket me-1"></i> Serviços & Produtos
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link rounded-3 fw-bold small" :class="{ active: abaAtiva === 'PERFIL' }"
                    @click="abaAtiva = 'PERFIL'">
                    <i class="bi bi-person-fill me-1"></i> Meu Perfil
                </button>
            </li>
        </ul>

        <div v-if="carregando" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-2">Carregando informações...</p>
        </div>

        <template v-else-if="perfil">

            <!-- ========================= ABA: AGENDAR ========================= -->
            <div v-if="abaAtiva === 'AGENDAR'" class="row g-4">
                <div class="col-lg-7">
                    <div class="card border-0 shadow-sm rounded-4 mb-4">
                        <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                            <h6 class="fw-bold text-uppercase text-muted mb-0"><i class="bi bi-list-check me-2"></i>
                                1. Escolha os serviços</h6>
                        </div>
                        <div class="card-body p-4 pt-2">
                            <div v-if="!servicos.length" class="text-muted small">Nenhum serviço cadastrado ainda.</div>
                            <div v-for="s in servicos" :key="s.id"
                                class="form-check d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 mb-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" :id="`serv-${s.id}`"
                                        :value="s.id" v-model="novoAgendamento.servicoIds">
                                    <label class="form-check-label fw-medium" :for="`serv-${s.id}`">{{ s.nome }}</label>
                                </div>
                                <span class="fw-bold text-success">{{ formatarMoeda(s.valor) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                            <h6 class="fw-bold text-uppercase text-muted mb-0"><i class="bi bi-person-badge me-2"></i>
                                2. Escolha o profissional</h6>
                        </div>
                        <div class="card-body p-4 pt-2">
                            <div v-if="!funcionariosAtivos.length" class="text-muted small">Nenhum profissional
                                disponível no momento.</div>
                            <div class="row g-2">
                                <div class="col-6 col-md-4" v-for="f in funcionariosAtivos" :key="f.id">
                                    <button type="button" class="btn w-100 text-start border rounded-3 p-2 d-flex align-items-center gap-2"
                                        :class="novoAgendamento.funcionarioId === f.id ? 'border-primary bg-primary bg-opacity-10' : ''"
                                        @click="selecionarFuncionario(f.id)">
                                        <img v-if="f.fotoUrl" :src="f.fotoUrl" class="rounded-circle"
                                            style="width:32px;height:32px;object-fit:cover;">
                                        <i v-else class="bi bi-person-circle fs-4 text-secondary"></i>
                                        <span class="fw-medium text-truncate small">{{ f.nome }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-5">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                            <h6 class="fw-bold text-uppercase text-muted mb-0"><i class="bi bi-calendar3 me-2"></i>
                                3. Escolha data e horário</h6>
                        </div>
                        <div class="card-body p-4 pt-2">
                            <label class="form-label fw-bold small text-muted text-uppercase">Data</label>
                            <input type="date" class="form-control form-control-lg mb-3" :min="hoje"
                                v-model="novoAgendamento.data" @change="buscarHorarios">

                            <div v-if="carregandoHorarios" class="text-center py-3">
                                <div class="spinner-border spinner-border-sm text-primary"></div>
                            </div>
                            <div v-else-if="!novoAgendamento.funcionarioId" class="text-muted small text-center py-3">
                                Escolha um profissional pra ver os horários livres.
                            </div>
                            <div v-else-if="!horariosDisponiveis.length" class="text-muted small text-center py-3">
                                Nenhum horário livre nesse dia. Tente outra data.
                            </div>
                            <div v-else class="d-flex flex-wrap gap-2 mb-4">
                                <button v-for="h in horariosDisponiveis" :key="h.id" type="button"
                                    class="btn btn-sm fw-bold"
                                    :class="novoAgendamento.horarioId === h.id ? 'btn-primary' : 'btn-outline-primary'"
                                    @click="novoAgendamento.horarioId = h.id">
                                    {{ h.horaInicio }}
                                </button>
                            </div>

                            <div class="d-flex justify-content-between align-items-center py-2 border-top">
                                <span class="fw-bold text-uppercase small text-muted">Total</span>
                                <span class="fw-bold fs-5">{{ formatarMoeda(valorTotalSelecionado) }}</span>
                            </div>

                            <button class="btn btn-primary w-100 fw-bold mt-3" :disabled="!podeAgendar || agendando"
                                @click="confirmarAgendamento">
                                <span v-if="agendando" class="spinner-border spinner-border-sm me-2"></span>
                                <i v-else class="bi bi-check-lg me-1"></i> Confirmar Agendamento
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========================= ABA: MEUS AGENDAMENTOS ========================= -->
            <div v-else-if="abaAtiva === 'AGENDAMENTOS'" class="card border-0 shadow-sm rounded-4">
                <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                    <h6 class="fw-bold text-uppercase text-muted mb-0"><i class="bi bi-calendar-check me-2"></i>
                        Histórico de Agendamentos</h6>
                </div>
                <div class="card-body p-4 pt-2">
                    <div class="table-responsive" v-if="perfil.agendamentos && perfil.agendamentos.length > 0">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="border-0 rounded-start">Data / Hora</th>
                                    <th class="border-0">Serviço</th>
                                    <th class="border-0">Profissional</th>
                                    <th class="border-0 text-center">Status</th>
                                    <th class="border-0 rounded-end text-end">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="agenda in perfil.agendamentos" :key="agenda.id">
                                    <td class="py-3">
                                        <span class="d-block fw-bold text-dark">{{ formatarData(agenda.horario.data)
                                            }}</span>
                                        <span class="small text-muted"><i class="bi bi-clock me-1"></i> {{
                                            agenda.horario.horaInicio }}</span>
                                    </td>
                                    <td class="py-3 fw-medium">{{ formatServico(agenda.servico) }}</td>
                                    <td class="py-3 text-muted">{{ agenda.funcionario.nome }}</td>
                                    <td class="py-3 text-center">
                                        <span class="badge rounded-pill px-3 py-2"
                                            :class="obterCorStatus(agenda.status)">
                                            {{ agenda.status.toUpperCase() }}
                                        </span>
                                    </td>
                                    <td class="py-3 text-end">
                                        <button v-if="agenda.status === 'agendado'"
                                            class="btn btn-sm btn-outline-danger"
                                            :disabled="cancelandoId === agenda.id"
                                            @click="cancelarAgendamento(agenda.id)">
                                            <span v-if="cancelandoId === agenda.id"
                                                class="spinner-border spinner-border-sm"></span>
                                            <span v-else>Cancelar</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-else class="text-center py-5 text-muted bg-light rounded-3 mt-3">
                        <i class="bi bi-calendar-x display-4 d-block mb-3 opacity-25"></i>
                        <h6 class="fw-bold">Nenhum agendamento encontrado</h6>
                        <p class="small mb-0">Quando você agendar um serviço, ele aparecerá aqui.</p>
                    </div>
                </div>
            </div>

            <!-- ========================= ABA: PLANOS ========================= -->
            <div v-else-if="abaAtiva === 'PLANOS'">
                <div class="card border-0 shadow-sm rounded-4 mb-4 bg-dark text-white">
                    <div class="card-body p-4">
                        <h6 class="text-uppercase fw-bold text-white-50 mb-3"><i
                                class="bi bi-star-fill text-warning me-2"></i> Meu Plano Atual</h6>

                        <div v-if="perfil.assinatura && perfil.assinatura.ativo">
                            <h3 class="fw-bold mb-2">{{ perfil.assinatura.plano.nome }}</h3>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="opacity-75">Créditos:</span>
                                <span class="badge bg-light text-dark fs-6">
                                    {{ perfil.assinatura.ilimitado ? 'Ilimitado' : `${perfil.assinatura.limiteCreditos - perfil.assinatura.creditosUsados} restante(s)` }}
                                </span>
                            </div>
                            <div class="pt-3 border-top border-secondary">
                                <small class="text-white-50">Válido até {{ formatarData(perfil.assinatura.dataFim)
                                    }}</small>
                            </div>
                        </div>

                        <div v-else class="text-center py-3">
                            <i class="bi bi-shield-lock display-6 text-secondary mb-3 d-block"></i>
                            <p class="mb-0 text-white-50 small">Nenhuma assinatura ativa no momento.</p>
                        </div>
                    </div>
                </div>

                <h6 class="fw-bold text-uppercase text-muted mb-3">Planos disponíveis</h6>
                <div class="row g-3 mb-3">
                    <div class="col-md-6 col-lg-4" v-for="p in planos" :key="p.id">
                        <div class="card border-0 shadow-sm rounded-4 h-100">
                            <div class="card-body p-4">
                                <h5 class="fw-bold mb-1">{{ p.nome }}</h5>
                                <p class="text-primary fw-bold fs-5 mb-2">{{ formatarMoeda(p.valorMensal) }}<span
                                        class="fs-6 text-muted fw-normal">/mês</span></p>
                                <p class="small text-muted mb-2">
                                    {{ p.ilimitado ? 'Usos ilimitados' : `${p.qtdCreditos} uso(s) por mês` }}
                                </p>
                                <div class="d-flex flex-wrap gap-1">
                                    <span v-for="s in p.servicos" :key="s.id"
                                        class="badge bg-primary-subtle text-primary border">{{ s.nome }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <a v-if="whatsappLoja" :href="linkWhatsappPlano" target="_blank"
                    class="btn btn-success fw-bold">
                    <i class="bi bi-whatsapp me-2"></i> Assinar ou renovar pelo WhatsApp
                </a>
            </div>

            <!-- ========================= ABA: CATÁLOGO ========================= -->
            <div v-else-if="abaAtiva === 'CATALOGO'" class="row g-4">
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                            <h6 class="fw-bold text-uppercase text-muted mb-0"><i class="bi bi-scissors me-2"></i>
                                Serviços</h6>
                        </div>
                        <div class="card-body p-4 pt-2">
                            <div v-if="!servicos.length" class="text-muted small">Nenhum serviço cadastrado ainda.</div>
                            <div v-for="s in servicos" :key="s.id"
                                class="d-flex justify-content-between align-items-center py-2 border-bottom">
                                <span class="fw-medium">{{ s.nome }}</span>
                                <span class="fw-bold text-success">{{ formatarMoeda(s.valor) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                            <h6 class="fw-bold text-uppercase text-muted mb-0"><i class="bi bi-basket me-2"></i>
                                Produtos</h6>
                        </div>
                        <div class="card-body p-4 pt-2">
                            <div v-if="!produtos.length" class="text-muted small">Nenhum produto cadastrado ainda.</div>
                            <div v-for="p in produtos" :key="p.id"
                                class="d-flex justify-content-between align-items-center py-2 border-bottom">
                                <span class="fw-medium">{{ p.nome }}
                                    <span class="badge bg-secondary-subtle text-secondary ms-1">{{ p.tipo ===
                                        'CONSUMIVEL' ? 'Bebida' : 'Produto' }}</span>
                                </span>
                                <span class="fw-bold text-success">{{ formatarMoeda(p.valor) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========================= ABA: PERFIL ========================= -->
            <div v-else-if="abaAtiva === 'PERFIL'" class="row g-4">
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            <h6 class="fw-bold text-uppercase text-muted mb-4"><i class="bi bi-card-text me-2"></i>
                                Meus Dados</h6>

                            <div class="mb-3">
                                <small class="text-muted d-block mb-1">Nome Completo</small>
                                <span class="fw-bold fs-5 text-dark">{{ perfil.nome }}</span>
                            </div>

                            <form @submit.prevent="salvarDados">
                                <div class="mb-3">
                                    <label class="form-label fw-bold small text-muted text-uppercase">E-mail</label>
                                    <input type="email" class="form-control" v-model="formDados.email" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Telefone /
                                        WhatsApp</label>
                                    <TelefoneInput v-model="formDados.telefone" />
                                </div>
                                <button type="submit" class="btn btn-primary fw-bold" :disabled="salvandoDados">
                                    <span v-if="salvandoDados" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-check-lg me-1"></i> Salvar Dados
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            <h6 class="fw-bold text-uppercase text-muted mb-4"><i class="bi bi-key-fill me-2"></i>
                                Alterar Senha</h6>
                            <form @submit.prevent="salvarSenha">
                                <div class="mb-3">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Senha
                                        Atual</label>
                                    <input v-model="formSenha.senhaAtual" type="password" class="form-control"
                                        autocomplete="current-password" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Nova
                                        Senha</label>
                                    <input v-model="formSenha.novaSenha" type="password" class="form-control"
                                        autocomplete="new-password" minlength="6" required>
                                    <div class="form-text">Mínimo de 6 caracteres.</div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Confirmar Nova
                                        Senha</label>
                                    <input v-model="formSenha.confirmarSenha" type="password" class="form-control"
                                        autocomplete="new-password" minlength="6" required>
                                </div>
                                <button type="submit" class="btn btn-primary fw-bold" :disabled="salvandoSenha">
                                    <span v-if="salvandoSenha" class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-check-lg me-1"></i> Salvar Nova Senha
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast } from 'bootstrap';
import ConfirmModal from '@/components/ConfirmModal.vue';
import TelefoneInput from '@/components/TelefoneInput.vue';
import { ehContaAdmin } from '@/utils/funcionarios.js';

const perfil = ref(null);
const carregando = ref(true);
const abaAtiva = ref('AGENDAR');

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getConfig = () => ({
    headers: {
        'Authorization': `Bearer ${Cookies.get('access_token')}`,
        'x-tenant-id': Cookies.get('tenant_id')
    }
});

// --- TOAST ---
const toastRef = ref(null);
let toastInstance = null;
const toastMessage = ref('');
const toastIcon = ref('');

const showToast = (msg, type = 'success') => {
    if (!toastRef.value) return;
    toastMessage.value = msg;
    if (type === 'success') {
        toastRef.value.className = 'toast align-items-center text-bg-success border-0';
        toastIcon.value = 'bi bi-check-circle-fill';
    } else if (type === 'warning') {
        toastRef.value.className = 'toast align-items-center text-bg-warning border-0';
        toastIcon.value = 'bi bi-exclamation-triangle-fill';
    } else {
        toastRef.value.className = 'toast align-items-center text-bg-danger border-0';
        toastIcon.value = 'bi bi-exclamation-octagon-fill';
    }
    if (!toastInstance) toastInstance = new Toast(toastRef.value);
    toastInstance.show();
};

const confirmModalRef = ref(null);

const formatarData = (d) => new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
const formatServico = (s) => s ? s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : '';
const formatarMoeda = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const obterCorStatus = (status) => {
    const mapa = {
        'agendado': 'bg-primary-subtle text-primary border border-primary-subtle',
        'concluido': 'bg-success-subtle text-success border border-success-subtle',
        'cancelado': 'bg-danger-subtle text-danger border border-danger-subtle'
    };
    return mapa[status.toLowerCase()] || 'bg-secondary';
};

const carregarPerfil = async () => {
    try {
        const response = await axios.get(`${API_URL}/portal-cliente/perfil`, getConfig());
        perfil.value = response.data;
        formDados.value.email = perfil.value.email || '';
        formDados.value.telefone = perfil.value.telefone || '';
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        if (error.response?.status === 401) {
            logout();
        }
    } finally {
        carregando.value = false;
    }
};

const logout = () => {
    // Precisa remover com o mesmo domain usado no login (subdomínio da loja
    // seta os cookies com domain: '.zencut.com.br'), senão o navegador não
    // apaga de verdade e o cliente continua autenticado.
    Cookies.remove('access_token', { domain: '.zencut.com.br' });
    Cookies.remove('access_token');
    Cookies.remove('tenant_id', { domain: '.zencut.com.br' });
    Cookies.remove('tenant_id');
    window.location.href = '/login';
};

// =========================================================================
//  MEUS DADOS (telefone / e-mail / senha)
// =========================================================================
const formDados = ref({ email: '', telefone: '' });
const salvandoDados = ref(false);

const salvarDados = async () => {
    salvandoDados.value = true;
    try {
        await axios.patch(`${API_URL}/portal-cliente/perfil`, formDados.value, getConfig());
        perfil.value.email = formDados.value.email;
        perfil.value.telefone = formDados.value.telefone;
        showToast('Dados atualizados com sucesso!', 'success');
    } catch (e) {
        showToast(e.response?.data?.message || 'Não foi possível salvar seus dados.', 'danger');
    } finally {
        salvandoDados.value = false;
    }
};

const formSenha = ref({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
const salvandoSenha = ref(false);

const salvarSenha = async () => {
    if (formSenha.value.novaSenha !== formSenha.value.confirmarSenha) {
        showToast('A confirmação não bate com a nova senha.', 'warning');
        return;
    }
    salvandoSenha.value = true;
    try {
        await axios.patch(`${API_URL}/portal-cliente/senha`, {
            senhaAtual: formSenha.value.senhaAtual,
            novaSenha: formSenha.value.novaSenha,
        }, getConfig());
        showToast('Senha alterada com sucesso!', 'success');
        formSenha.value = { senhaAtual: '', novaSenha: '', confirmarSenha: '' };
    } catch (e) {
        showToast(e.response?.data?.message || 'Não foi possível trocar a senha.', 'danger');
    } finally {
        salvandoSenha.value = false;
    }
};

// =========================================================================
//  CATÁLOGO (serviços, produtos, planos, equipe)
// =========================================================================
const servicos = ref([]);
const produtos = ref([]);
const planos = ref([]);
const funcionarios = ref([]);
// Conta de administrador ("Admin {loja}") nunca presta serviço nem marca
// horário — não faz sentido aparecer como opção de barbeiro pro cliente.
const funcionariosAtivos = computed(() => funcionarios.value.filter(f => f.ativo && !ehContaAdmin(f.nome)));
const whatsappLoja = ref('');

const linkWhatsappPlano = computed(() => {
    const numero = (whatsappLoja.value || '').replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá! Sou cliente e quero assinar/renovar um plano. Meu nome é ${perfil.value?.nome || ''}.`);
    return `https://wa.me/55${numero}?text=${msg}`;
});

const carregarCatalogo = async () => {
    try {
        const [resServicos, resFuncionarios] = await Promise.all([
            axios.get(`${API_URL}/servicos`, getConfig()),
            axios.get(`${API_URL}/funcionarios`, getConfig()),
        ]);
        servicos.value = resServicos.data;
        funcionarios.value = resFuncionarios.data;
    } catch (e) {
        console.error('Erro ao carregar serviços/equipe:', e);
    }

    // Produtos e Planos dependem de módulos que podem estar desativados nessa
    // loja — se o backend recusar (403), simplesmente escondemos essas seções.
    try {
        const resProdutos = await axios.get(`${API_URL}/produtos`, getConfig());
        produtos.value = resProdutos.data;
    } catch (e) { /* módulo de produtos desativado nessa loja */ }

    try {
        const resPlanos = await axios.get(`${API_URL}/planos`, getConfig());
        planos.value = resPlanos.data;
    } catch (e) { /* módulo de assinaturas desativado nessa loja */ }

    try {
        const tenantId = Cookies.get('tenant_id');
        if (tenantId) {
            const resTenant = await axios.get(`${API_URL}/tenants/${tenantId}/plano`, getConfig());
            whatsappLoja.value = resTenant.data.whatsapp || '';
        }
    } catch (e) { /* sem whatsapp configurado */ }
};

// =========================================================================
//  AGENDAR
// =========================================================================
const getLocalISODate = (date) => {
    const off = date.getTimezoneOffset();
    return new Date(date.getTime() - off * 60000).toISOString().slice(0, 10);
};
const hoje = getLocalISODate(new Date());

const novoAgendamento = ref({ servicoIds: [], funcionarioId: null, data: hoje, horarioId: null });
const horariosDisponiveis = ref([]);
const carregandoHorarios = ref(false);
const agendando = ref(false);

const valorTotalSelecionado = computed(() =>
    servicos.value
        .filter(s => novoAgendamento.value.servicoIds.includes(s.id))
        .reduce((soma, s) => soma + s.valor, 0)
);

const podeAgendar = computed(() =>
    novoAgendamento.value.servicoIds.length > 0 &&
    novoAgendamento.value.funcionarioId &&
    novoAgendamento.value.horarioId
);

const selecionarFuncionario = (id) => {
    novoAgendamento.value.funcionarioId = id;
    buscarHorarios();
};

const buscarHorarios = async () => {
    novoAgendamento.value.horarioId = null;
    horariosDisponiveis.value = [];
    if (!novoAgendamento.value.funcionarioId || !novoAgendamento.value.data) return;

    carregandoHorarios.value = true;
    try {
        const res = await axios.get(
            `${API_URL}/funcionarios/${novoAgendamento.value.funcionarioId}/horarios`,
            { ...getConfig(), params: { inicio: novoAgendamento.value.data, fim: novoAgendamento.value.data } }
        );
        horariosDisponiveis.value = (res.data.horarios || []).filter(h => h.disponivel);
    } catch (e) {
        showToast('Erro ao buscar horários disponíveis.', 'danger');
    } finally {
        carregandoHorarios.value = false;
    }
};

const confirmarAgendamento = async () => {
    if (!podeAgendar.value) return;
    agendando.value = true;
    try {
        await axios.post(`${API_URL}/portal-cliente/agendar`, {
            funcionarioId: novoAgendamento.value.funcionarioId,
            horarioId: novoAgendamento.value.horarioId,
            servicoIds: novoAgendamento.value.servicoIds,
        }, getConfig());

        showToast('Agendamento confirmado com sucesso!', 'success');
        novoAgendamento.value = { servicoIds: [], funcionarioId: null, data: hoje, horarioId: null };
        horariosDisponiveis.value = [];
        await carregarPerfil();
        abaAtiva.value = 'AGENDAMENTOS';
    } catch (e) {
        showToast(e.response?.data?.message || 'Não foi possível concluir o agendamento.', 'danger');
    } finally {
        agendando.value = false;
    }
};

// =========================================================================
//  CANCELAR AGENDAMENTO
// =========================================================================
const cancelandoId = ref(null);

const cancelarAgendamento = async (id) => {
    const ok = await confirmModalRef.value.confirmar('Cancelar este agendamento?', {
        titulo: 'Cancelar agendamento', textoConfirmar: 'Cancelar Agendamento'
    });
    if (!ok) return;

    cancelandoId.value = id;
    try {
        await axios.patch(`${API_URL}/portal-cliente/agendamentos/${id}/cancelar`, {}, getConfig());
        showToast('Agendamento cancelado.', 'success');
        await carregarPerfil();
    } catch (e) {
        showToast(e.response?.data?.message || 'Não foi possível cancelar.', 'danger');
    } finally {
        cancelandoId.value = null;
    }
};

onMounted(async () => {
    await Promise.all([carregarPerfil(), carregarCatalogo()]);
});
</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
