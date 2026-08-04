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

            <!-- Configurações da loja: numa linha larga própria, lado a lado, pra não empilhar tudo numa coluna estreita -->
            <template v-if="perfil.role === 1">
                <div class="col-12 col-lg-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white border-bottom-0 pt-3">
                            <h6 class="fw-bold mb-0"><i class="bi bi-whatsapp text-success me-2"></i> WhatsApp da Loja</h6>
                            <p class="text-muted small mb-0">Usado no botão "Renovar Plano" quando um cliente está sem
                                crédito ou com o plano vencido.</p>
                        </div>
                        <div class="card-body p-4">
                            <form @submit.prevent="salvarWhatsapp">
                                <label class="form-label fw-bold small text-muted text-uppercase">Número (com DDD)</label>
                                <TelefoneInput v-model="formWhatsapp.numero" input-class="form-control-lg mb-3" />
                                <button type="submit" class="btn btn-success w-100 fw-bold" :disabled="salvandoWhatsapp">
                                    <span v-if="salvandoWhatsapp" class="spinner-border spinner-border-sm me-2"></span>
                                    Salvar Número
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-lg-8">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white border-bottom-0 pt-3">
                            <h6 class="fw-bold mb-0"><i class="bi bi-palette-fill text-primary me-2"></i> Personalização da Tela de Login</h6>
                            <p class="text-muted small mb-0">Cores e texto de destaque exibidos no login do subdomínio da
                                sua loja.</p>
                        </div>
                        <div class="card-body p-4">
                            <form @submit.prevent="salvarPersonalizacao" class="row g-4">
                                <div class="col-md-7">
                                    <div class="row g-3 mb-3">
                                        <div class="col-6">
                                            <label class="form-label fw-bold small text-muted text-uppercase">Cor Primária</label>
                                            <div class="input-group">
                                                <input type="color" class="form-control form-control-color"
                                                    v-model="formPersonalizacao.corPrimaria" title="Escolher cor">
                                                <input type="text" class="form-control" v-model="formPersonalizacao.corPrimaria">
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label fw-bold small text-muted text-uppercase">Cor Secundária</label>
                                            <div class="input-group">
                                                <input type="color" class="form-control form-control-color"
                                                    v-model="formPersonalizacao.corSecundaria" title="Escolher cor">
                                                <input type="text" class="form-control" v-model="formPersonalizacao.corSecundaria">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label fw-bold small text-muted text-uppercase">Título de destaque</label>
                                        <input type="text" class="form-control" v-model="formPersonalizacao.loginTitulo"
                                            placeholder="Gerencie sua barbearia com simplicidade." maxlength="120">
                                    </div>
                                    <div class="mb-0">
                                        <label class="form-label fw-bold small text-muted text-uppercase">Descrição</label>
                                        <textarea class="form-control" rows="2" v-model="formPersonalizacao.loginDescricao"
                                            placeholder="Agendamentos, planos de assinatura, comissões da equipe e financeiro em um só lugar."
                                            maxlength="255"></textarea>
                                    </div>
                                </div>

                                <div class="col-md-5 d-flex flex-column">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Prévia</label>
                                    <div class="rounded-3 p-3 flex-grow-1 d-flex flex-column justify-content-center"
                                        :style="{ background: previaGradiente, color: previaCorTexto }">
                                        <strong>{{ formPersonalizacao.loginTitulo || 'Gerencie sua barbearia com simplicidade.' }}</strong>
                                        <p class="small mb-0" :class="{ 'text-warning': previaCorTexto === '#ffffff' }">{{ formPersonalizacao.loginDescricao || 'Agendamentos, planos de assinatura, comissões da equipe e financeiro em um só lugar.' }}</p>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <button type="submit" class="btn btn-primary fw-bold px-4" :disabled="salvandoPersonalizacao">
                                        <span v-if="salvandoPersonalizacao" class="spinner-border spinner-border-sm me-2"></span>
                                        Salvar Personalização
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white border-bottom-0 pt-3">
                            <h6 class="fw-bold mb-0"><i class="bi bi-shop-window text-primary me-2"></i> Vitrine
                                Pública (Landing Page da Loja)</h6>
                            <p class="text-muted small mb-0">É a primeira página que seus clientes veem ao acessar o
                                site da sua loja, antes de fazer login.</p>
                        </div>
                        <div class="card-body p-4">
                            <div class="row g-4">
                                <div class="col-md-5">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Banner</label>
                                    <div class="banner-preview mb-2"
                                        :style="bannerPreview ? { backgroundImage: `url(${bannerPreview})` } : {}">
                                        <span v-if="!bannerPreview" class="text-muted small">Nenhum banner ainda</span>
                                    </div>
                                    <input type="file" accept="image/*" class="form-control form-control-sm"
                                        @change="selecionarBanner">
                                    <div class="form-text">
                                        <i class="bi bi-aspect-ratio me-1"></i>Recomendado: 1600×700px, na horizontal
                                        (ele preenche o topo da página inteiro).
                                    </div>
                                    <button v-if="arquivoBanner" class="btn btn-sm btn-primary fw-bold mt-2 w-100"
                                        :disabled="enviandoBanner" @click="enviarBanner">
                                        <span v-if="enviandoBanner" class="spinner-border spinner-border-sm me-2"></span>
                                        Enviar Banner
                                    </button>
                                </div>
                                <div class="col-md-7">
                                    <form @submit.prevent="salvarVitrine">
                                        <div class="mb-3">
                                            <label class="form-label fw-bold small text-muted text-uppercase">Descrição
                                                da loja</label>
                                            <textarea class="form-control" rows="2" v-model="formVitrine.descricaoLoja"
                                                placeholder="Tradição e qualidade em cada corte." maxlength="255"></textarea>
                                        </div>
                                        <div class="row g-3 mb-3">
                                            <div class="col-md-7">
                                                <label class="form-label fw-bold small text-muted text-uppercase">Endereço</label>
                                                <input type="text" class="form-control" v-model="formVitrine.endereco"
                                                    placeholder="Rua Exemplo, 123 - Bairro">
                                            </div>
                                            <div class="col-md-5">
                                                <label class="form-label fw-bold small text-muted text-uppercase">Instagram</label>
                                                <input type="text" class="form-control" v-model="formVitrine.instagram"
                                                    placeholder="@sualoja">
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary fw-bold px-4"
                                            :disabled="salvandoVitrine">
                                            <span v-if="salvandoVitrine" class="spinner-border spinner-border-sm me-2"></span>
                                            Salvar Vitrine
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast } from 'bootstrap';
import RelatorioBarbeiroDetalhe from '../components/RelatorioBarbeiroDetalhe.vue';
import TelefoneInput from '../components/TelefoneInput.vue';
import { corContrastante } from '@/utils/cor.js';

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

const formWhatsapp = ref({ numero: '' });
const salvandoWhatsapp = ref(false);

const formPersonalizacao = ref({ corPrimaria: '#0D1B2A', corSecundaria: '#0D6EFD', loginTitulo: '', loginDescricao: '' });
const salvandoPersonalizacao = ref(false);
const previaGradiente = computed(() => `linear-gradient(135deg, ${formPersonalizacao.value.corPrimaria} 0%, ${formPersonalizacao.value.corSecundaria} 100%)`);
// Prévia de como a tela de login vai ficar — precisa escolher texto claro ou
// escuro igual o login de verdade (ver corContrastante em utils/cor.js), senão
// o dono nem percebe que a cor escolhida vai deixar o texto real ilegível.
const previaCorTexto = computed(() => corContrastante(formPersonalizacao.value.corPrimaria));

const carregarWhatsapp = async () => {
    try {
        const tenantId = Cookies.get('tenant_id');
        if (!tenantId) return;
        const response = await axios.get(`${API_URL}/tenants/${tenantId}/plano`, getConfig());
        formWhatsapp.value.numero = response.data.whatsapp || '';
        formPersonalizacao.value = {
            corPrimaria: response.data.corPrimaria || '#0D1B2A',
            corSecundaria: response.data.corSecundaria || '#0D6EFD',
            loginTitulo: response.data.loginTitulo || '',
            loginDescricao: response.data.loginDescricao || '',
        };
        formVitrine.value = {
            descricaoLoja: response.data.descricaoLoja || '',
            endereco: response.data.endereco || '',
            instagram: response.data.instagram || '',
        };
        bannerPreview.value = response.data.bannerUrl || '';
    } catch (error) {
        console.error('Erro ao buscar o whatsapp da loja:', error);
    }
};

const salvarWhatsapp = async () => {
    salvandoWhatsapp.value = true;
    try {
        await axios.patch(`${API_URL}/tenants/meu-whatsapp`, { whatsapp: formWhatsapp.value.numero.trim() }, getConfig());
        showToast('WhatsApp da loja atualizado!', 'success');
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao salvar o whatsapp.', 'danger');
    } finally {
        salvandoWhatsapp.value = false;
    }
};

const salvarPersonalizacao = async () => {
    salvandoPersonalizacao.value = true;
    try {
        await axios.patch(`${API_URL}/tenants/minha-personalizacao`, formPersonalizacao.value, getConfig());
        showToast('Personalização da tela de login atualizada!', 'success');
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao salvar a personalização.', 'danger');
    } finally {
        salvandoPersonalizacao.value = false;
    }
};

// =========================================================================
//  VITRINE PÚBLICA (Landing Page da loja no subdomínio)
// =========================================================================
const formVitrine = ref({ descricaoLoja: '', endereco: '', instagram: '' });
const salvandoVitrine = ref(false);
const bannerPreview = ref('');
const arquivoBanner = ref(null);
const enviandoBanner = ref(false);

const selecionarBanner = (evento) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    arquivoBanner.value = arquivo;
    bannerPreview.value = URL.createObjectURL(arquivo);
};

const enviarBanner = async () => {
    if (!arquivoBanner.value) return;
    enviandoBanner.value = true;
    try {
        const formData = new FormData();
        formData.append('banner', arquivoBanner.value);
        await axios.post(`${API_URL}/tenants/meu-banner`, formData, {
            headers: { ...getConfig().headers, 'Content-Type': 'multipart/form-data' }
        });
        showToast('Banner da loja atualizado!', 'success');
        arquivoBanner.value = null;
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao enviar o banner.', 'danger');
    } finally {
        enviandoBanner.value = false;
    }
};

const salvarVitrine = async () => {
    salvandoVitrine.value = true;
    try {
        await axios.patch(`${API_URL}/tenants/minha-personalizacao`, formVitrine.value, getConfig());
        showToast('Vitrine da loja atualizada!', 'success');
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao salvar a vitrine.', 'danger');
    } finally {
        salvandoVitrine.value = false;
    }
};

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
    if (perfil.value.role === 1) await carregarWhatsapp();
});
</script>

<style scoped>
.banner-preview {
    height: 140px;
    border-radius: .6rem;
    border: 1px dashed #ced4da;
    background-color: #f8f9fa;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
