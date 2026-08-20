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
            <div class="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                    <h2 class="fw-bold text-dark mb-1"><i class="bi bi-shop-window text-primary me-2"></i> Minha Vitrine</h2>
                    <p class="text-muted mb-0">A página pública que aparece pra quem visita
                        <strong>{{ subdomain }}.zencut.com.br</strong> sem estar logado.</p>
                </div>
                <a v-if="subdomain" :href="urlVitrinePublicada" target="_blank" class="btn btn-outline-secondary fw-bold">
                    <i class="bi bi-box-arrow-up-right me-1"></i> Ver vitrine publicada
                </a>
            </div>
        </div>

        <div v-if="carregando" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else class="row g-4">
            <!-- ================= COLUNA DE EDIÇÃO ================= -->
            <div class="col-12 col-xl-6">

                <!-- BANNER -->
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white border-bottom-0 pt-3">
                        <h6 class="fw-bold mb-0"><i class="bi bi-image text-primary me-2"></i> Banner (topo da página)</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="banner-preview mb-3 rounded-3 overflow-hidden d-flex align-items-center justify-content-center"
                            :style="bannerPreview ? { backgroundImage: `url(${bannerPreview})` } : { background: form.corPrimaria }">
                            <span v-if="!bannerPreview" class="text-white-50"><i class="bi bi-image fs-1"></i></span>
                        </div>
                        <input ref="inputBannerRef" type="file" accept="image/*" class="d-none" @change="aoEscolherBanner">
                        <button type="button" class="btn btn-outline-primary fw-bold" :disabled="enviandoBanner"
                            @click="inputBannerRef?.click()">
                            <span v-if="enviandoBanner" class="spinner-border spinner-border-sm me-2"></span>
                            <i v-else class="bi bi-upload me-1"></i> {{ bannerUrl ? 'Trocar banner' : 'Enviar banner' }}
                        </button>
                        <div class="form-text">
                            <i class="bi bi-aspect-ratio me-1"></i>JPG, PNG ou WEBP — até 10MB. Recomendado: 1600×700px,
                            na horizontal (ele preenche o topo da página inteiro).
                        </div>
                    </div>
                </div>

                <!-- CORES E TEXTOS -->
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-white border-bottom-0 pt-3">
                        <h6 class="fw-bold mb-0"><i class="bi bi-palette text-primary me-2"></i> Cores e textos</h6>
                    </div>
                    <div class="card-body p-4">
                        <form @submit.prevent="salvarVitrine">
                            <div class="row g-3 mb-3">
                                <div class="col-6">
                                    <label class="form-label small text-muted fw-bold">Cor Primária</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control form-control-color" v-model="form.corPrimaria">
                                        <input type="text" class="form-control" v-model="form.corPrimaria">
                                    </div>
                                </div>
                                <div class="col-6">
                                    <label class="form-label small text-muted fw-bold">Cor Secundária</label>
                                    <div class="input-group">
                                        <input type="color" class="form-control form-control-color" v-model="form.corSecundaria">
                                        <input type="text" class="form-control" v-model="form.corSecundaria">
                                    </div>
                                </div>
                            </div>

                            <hr class="my-4">
                            <h6 class="fw-bold small text-uppercase text-muted mb-3">
                                <i class="bi bi-box-arrow-in-right me-1"></i> Tela de login
                                <span class="fw-normal" style="text-transform: none;">— o que aparece antes do funcionário entrar</span>
                            </h6>
                            <div class="row g-3 mb-4">
                                <div class="col-md-7">
                                    <div class="mb-3">
                                        <label class="form-label small text-muted fw-bold">Título de destaque</label>
                                        <input type="text" class="form-control" v-model="form.loginTitulo"
                                            placeholder="Gerencie sua barbearia com simplicidade." maxlength="120">
                                    </div>
                                    <div class="mb-0">
                                        <label class="form-label small text-muted fw-bold">Descrição</label>
                                        <textarea v-model="form.loginDescricao" class="form-control" rows="2"
                                            placeholder="Agendamentos, planos de assinatura, comissões da equipe e financeiro em um só lugar."
                                            maxlength="255"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-5 d-flex flex-column">
                                    <label class="form-label small text-muted fw-bold">Prévia do login</label>
                                    <div class="rounded-3 p-3 flex-grow-1 d-flex flex-column justify-content-center"
                                        :style="{ background: previaLoginGradiente, color: previaLoginCorTexto }">
                                        <strong class="small">{{ form.loginTitulo || 'Gerencie sua barbearia com simplicidade.' }}</strong>
                                        <p class="small mb-0" :class="{ 'text-warning': previaLoginCorTexto === '#ffffff' }">{{ form.loginDescricao || 'Agendamentos, planos de assinatura, comissões da equipe e financeiro em um só lugar.' }}</p>
                                    </div>
                                </div>
                            </div>

                            <hr class="my-4">
                            <h6 class="fw-bold small text-uppercase text-muted mb-3">
                                <i class="bi bi-shop-window me-1"></i> Vitrine pública
                                <span class="fw-normal" style="text-transform: none;">— o que os clientes veem</span>
                            </h6>
                            <div class="mb-3">
                                <label class="form-label small text-muted fw-bold">Descrição da loja</label>
                                <textarea v-model="form.descricaoLoja" class="form-control" rows="2"
                                    placeholder="Ex: Cortes, barba e tratamentos capilares no centro da cidade."></textarea>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label class="form-label small text-muted fw-bold">Endereço</label>
                                    <input v-model="form.endereco" type="text" class="form-control" placeholder="Rua, número, bairro">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small text-muted fw-bold">Instagram</label>
                                    <input v-model="form.instagram" type="text" class="form-control" placeholder="@sualoja">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small text-muted fw-bold">WhatsApp</label>
                                    <TelefoneInput v-model="form.whatsapp" />
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary fw-bold" :disabled="salvandoTexto">
                                <span v-if="salvandoTexto" class="spinner-border spinner-border-sm me-2"></span>
                                <i v-else class="bi bi-check-lg me-1"></i> Salvar
                            </button>
                        </form>
                    </div>
                </div>

                <div class="alert alert-light border small mb-0">
                    <i class="bi bi-info-circle me-1"></i> Fotos e descrições dos serviços e da equipe são editadas em
                    <router-link to="/home">Início &rarr; Gerenciar Serviços / Equipe</router-link>.
                </div>
            </div>

            <!-- ================= PRÉVIA AO VIVO ================= -->
            <div class="col-12 col-xl-6">
                <div class="card border-0 shadow-sm sticky-top" style="top: 1rem;">
                    <div class="card-header bg-white border-bottom-0 pt-3 d-flex align-items-center gap-2">
                        <h6 class="fw-bold mb-0"><i class="bi bi-eye text-primary me-2"></i> Prévia ao vivo</h6>
                        <span class="badge bg-primary-subtle text-primary border ms-auto">Atualiza em tempo real</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="preview-frame">
                            <div class="preview-scaler">
                                <VitrineConteudo :dados="previewData" modo-preview />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast } from 'bootstrap';
import VitrineConteudo from '../components/VitrineConteudo.vue';
import TelefoneInput from '../components/TelefoneInput.vue';
import { corContrastante } from '@/utils/cor.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const getConfig = (extraHeaders = {}) => ({ headers: { 'Authorization': `Bearer ${Cookies.get('access_token')}`, 'x-tenant-id': Cookies.get('tenant_id'), ...extraHeaders } });

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

const carregando = ref(true);
const salvandoTexto = ref(false);
const enviandoBanner = ref(false);

const nomeNegocio = ref('');
const subdomain = ref('');
const bannerUrl = ref(null);
const bannerLocalPreview = ref(null);
const inputBannerRef = ref(null);

const form = ref({
    corPrimaria: '#0D1B2A',
    corSecundaria: '#0D6EFD',
    loginTitulo: '',
    loginDescricao: '',
    descricaoLoja: '',
    endereco: '',
    instagram: '',
    whatsapp: '',
});

// Serviços/equipe/planos não são editados aqui (isso já é feito em Início),
// mas entram na prévia pra ela mostrar a página real, não uma versão vazia.
const servicos = ref([]);
const equipe = ref([]);
const planos = ref([]);

const bannerPreview = computed(() => bannerLocalPreview.value || bannerUrl.value);

// A tela de login é uma página separada (AuthLayout.vue) — não faz parte da
// prévia grande da vitrine, então tem sua própria mini-prévia aqui do lado
// dos campos de título/descrição do login.
const previaLoginGradiente = computed(() => `linear-gradient(135deg, ${form.value.corPrimaria} 0%, ${form.value.corSecundaria} 100%)`);
const previaLoginCorTexto = computed(() => corContrastante(form.value.corPrimaria));

const urlVitrinePublicada = computed(() => {
    const isDev = import.meta.env.DEV || window.location.hostname.includes('localhost');
    const porta = window.location.port ? `:${window.location.port}` : '';
    return isDev ? `http://${subdomain.value}.localhost${porta}/` : `https://${subdomain.value}.zencut.com.br/`;
});

// Alimenta a prévia ao vivo com o que já foi salvo + o que está sendo digitado
// / prestes a ser enviado agora, pra prévia bater 100% com a edição em curso.
const previewData = computed(() => ({
    nomeNegocio: nomeNegocio.value,
    corPrimaria: form.value.corPrimaria,
    corSecundaria: form.value.corSecundaria,
    bannerUrl: bannerPreview.value,
    descricaoLoja: form.value.descricaoLoja,
    endereco: form.value.endereco,
    instagram: form.value.instagram,
    whatsapp: form.value.whatsapp,
    servicos: servicos.value,
    equipe: equipe.value,
    planos: planos.value,
}));

const carregarVitrine = async () => {
    carregando.value = true;
    try {
        const tenantId = Cookies.get('tenant_id');
        const { data } = await axios.get(`${API_URL}/tenants/${tenantId}/plano`, getConfig());
        nomeNegocio.value = data.nomeNegocio;
        subdomain.value = data.subdomain;
        bannerUrl.value = data.bannerUrl;
        form.value = {
            corPrimaria: data.corPrimaria || '#0D1B2A',
            corSecundaria: data.corSecundaria || '#0D6EFD',
            loginTitulo: data.loginTitulo || '',
            loginDescricao: data.loginDescricao || '',
            descricaoLoja: data.descricaoLoja || '',
            endereco: data.endereco || '',
            instagram: data.instagram || '',
            whatsapp: data.whatsapp || '',
        };

        // Busca os dados públicos reais (serviços/equipe/planos) só pra prévia
        // ficar completa — essa parte não é editada nesta tela.
        try {
            const publica = await axios.get(`${API_URL}/tenants/info/${data.subdomain}`);
            servicos.value = publica.data.servicos || [];
            equipe.value = publica.data.equipe || [];
            planos.value = publica.data.planos || [];
        } catch (e) {
            console.error('Não foi possível carregar serviços/equipe/planos pra prévia', e);
        }
    } catch (error) {
        showToast('Erro ao carregar sua vitrine.', 'danger');
    } finally {
        carregando.value = false;
    }
};

const salvarVitrine = async () => {
    salvandoTexto.value = true;
    try {
        await axios.patch(`${API_URL}/tenants/minha-personalizacao`, {
            corPrimaria: form.value.corPrimaria,
            corSecundaria: form.value.corSecundaria,
            loginTitulo: form.value.loginTitulo,
            loginDescricao: form.value.loginDescricao,
            descricaoLoja: form.value.descricaoLoja,
            endereco: form.value.endereco,
            instagram: form.value.instagram,
        }, getConfig());
        await axios.patch(`${API_URL}/tenants/meu-whatsapp`, { whatsapp: form.value.whatsapp }, getConfig());
        showToast('Vitrine atualizada com sucesso!');
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao salvar a vitrine.', 'danger');
    } finally {
        salvandoTexto.value = false;
    }
};

const TAMANHO_MAX_IMAGEM = 10 * 1024 * 1024; // mesmo limite do Cloudinary — avisa antes de tentar subir

const aoEscolherBanner = async (evento) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    if (arquivo.size > TAMANHO_MAX_IMAGEM) {
        showToast('Imagem muito grande. O tamanho máximo permitido é 10MB.', 'danger');
        evento.target.value = '';
        return;
    }

    bannerLocalPreview.value = URL.createObjectURL(arquivo);
    enviandoBanner.value = true;
    try {
        const dadosForm = new FormData();
        dadosForm.append('banner', arquivo);
        const { data } = await axios.post(`${API_URL}/tenants/meu-banner`, dadosForm, getConfig({ 'Content-Type': 'multipart/form-data' }));
        bannerUrl.value = data.bannerUrl;
        showToast('Banner atualizado!');
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao enviar o banner.', 'danger');
    } finally {
        bannerLocalPreview.value = null;
        enviandoBanner.value = false;
        evento.target.value = '';
    }
};

onMounted(() => {
    if (toastRef.value) toastInstance.value = new Toast(toastRef.value);
    carregarVitrine();
});
</script>

<style scoped>
.banner-preview {
    height: 180px;
    background-size: cover;
    background-position: center;
}

.preview-frame {
    max-height: 720px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 0 0 .5rem .5rem;
}

/* Abaixo de xl as colunas empilham (col-12 col-xl-6) e a VitrineConteudo já é
   responsiva sozinha — não precisa encolher. Só faz sentido encolher a prévia
   quando ela divide a tela com a coluna de edição (senão vira uma versão
   mobile distorcida dentro de um painel pequeno). */
@media (min-width: 1200px) {
    .preview-scaler {
        width: 166%;
        transform: scale(0.6);
        transform-origin: top left;
    }
}
</style>
