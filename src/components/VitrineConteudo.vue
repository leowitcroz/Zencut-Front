<template>
    <div class="vitrine-conteudo">
        <!-- HEADER -->
        <header class="loja-header py-3" :style="{ background: dados.corPrimaria, color: corTexto }">
            <div class="container d-flex align-items-center justify-content-between gap-2">
                <h3 class="loja-header-title fw-bold mb-0 text-truncate">{{ dados.nomeNegocio || 'Sua Loja' }}</h3>
                <router-link v-if="!modoPreview" to="/login" class="btn fw-bold loja-header-btn flex-shrink-0"
                    :style="{ background: dados.corSecundaria, color: corTextoSecundaria, border: 'none' }">
                    <i class="bi bi-person-circle"></i><span class="loja-header-btn-text">Área do Cliente</span>
                </router-link>
                <span v-else class="btn fw-bold loja-header-btn flex-shrink-0"
                    :style="{ background: dados.corSecundaria, color: corTextoSecundaria, border: 'none', opacity: .85 }">
                    <i class="bi bi-person-circle"></i><span class="loja-header-btn-text">Área do Cliente</span>
                </span>
            </div>
        </header>

        <!-- HERO (banner cheio, sem tarja escura) -->
        <section class="loja-hero text-white" :style="heroStyle">
            <div class="container loja-hero-content">
                <div class="loja-hero-inner">
                    <h1 class="display-5 fw-bold mb-3 loja-hero-title">{{ dados.nomeNegocio || 'Sua Loja' }}</h1>
                    <p class="lead mb-0 loja-hero-title">{{ dados.descricaoLoja || 'Marque seu horário sem sair de casa.' }}</p>
                </div>
            </div>
        </section>

        <!-- SERVIÇOS (carrossel horizontal) -->
        <section v-if="dados.servicos?.length" class="py-5" :class="{ 'bg-light': !secaoEhEscura('servicos') }"
            :style="estiloSecaoDinamica('servicos')">
            <div class="container py-3">
                <h2 class="text-center fw-bold mb-5">Nossos serviços</h2>
                <div class="servicos-carousel-wrap position-relative">
                    <button v-if="dados.servicos.length > 1" type="button" class="carousel-nav-btn start-0"
                        @click="rolar(servicosCarouselRef, -1)" aria-label="Anterior">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <div class="servicos-carousel" ref="servicosCarouselRef">
                        <div class="servico-card-carousel" v-for="s in dados.servicos" :key="s.nome">
                            <div class="card border-0 shadow-sm h-100 overflow-hidden">
                                <div v-if="s.fotoUrl" class="servico-foto" :style="{ backgroundImage: `url(${s.fotoUrl})` }"></div>
                                <div v-else class="servico-foto d-flex align-items-center justify-content-center"
                                    :style="{ background: dados.corPrimaria + '14' }">
                                    <i class="bi bi-scissors fs-1" :style="{ color: dados.corPrimaria }"></i>
                                </div>
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start mb-1">
                                        <h6 class="fw-bold mb-0">{{ s.nome }}</h6>
                                        <span class="fw-bold text-nowrap ms-2" :style="{ color: dados.corPrimaria }">{{ formatarValor(s.valor) }}</span>
                                    </div>
                                    <p v-if="s.descricao" class="text-muted small mb-0">{{ s.descricao }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button v-if="dados.servicos.length > 1" type="button" class="carousel-nav-btn end-0"
                        @click="rolar(servicosCarouselRef, 1)" aria-label="Próximo">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>

        <!-- EQUIPE (linhas alternando foto/texto de lado E fundo claro/escuro) -->
        <section v-if="dados.equipe?.length">
            <h2 class="text-center fw-bold py-5 mb-0">Nossa equipe</h2>
            <div class="equipe-row py-5" v-for="(f, i) in dados.equipe" :key="f.nome"
                :style="equipeRowEscura(i) ? { background: dados.corPrimaria, color: corTexto } : { background: '#fff' }">
                <div class="container">
                    <div class="row align-items-center g-4">
                        <div class="col-md-5" :class="i % 2 === 0 ? 'order-md-1' : 'order-md-2'">
                            <img v-if="f.fotoUrl" :src="f.fotoUrl" class="img-fluid rounded-4 shadow-sm w-100 equipe-foto">
                            <div v-else class="rounded-4 equipe-foto d-flex align-items-center justify-content-center w-100"
                                :style="{ background: dados.corSecundaria + '22', color: dados.corSecundaria }">
                                <i class="bi bi-person-fill" style="font-size: 4rem;"></i>
                            </div>
                        </div>
                        <div class="col-md-7" :class="i % 2 === 0 ? 'order-md-2' : 'order-md-1'">
                            <h4 class="fw-bold mb-2">{{ f.nome }}</h4>
                            <p class="mb-0" :class="equipeRowEscura(i) ? '' : 'text-muted'" :style="equipeRowEscura(i) ? { opacity: .72 } : {}">{{ f.descricao || 'Profissional dedicado a oferecer o melhor atendimento.' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PLANOS (só aparece se a loja realmente tiver planos cadastrados) -->
        <section v-if="dados.planos?.length" class="py-5 text-center"
            :class="{ 'bg-light': !secaoEhEscura('planos') }" :style="estiloSecaoDinamica('planos')">
            <div class="container py-3">
                <i class="bi bi-award fs-1 mb-3 d-block" :style="{ color: dados.corSecundaria }"></i>
                <h2 class="fw-bold mb-2">Assine um plano e economize</h2>
                <p class="mb-5 opacity-75">Fale com a gente e escolha o plano ideal pra você.</p>

                <div class="planos-carousel-wrap position-relative">
                    <button v-if="dados.planos.length > 3" type="button" class="carousel-nav-btn start-0"
                        @click="rolar(planosCarouselRef, -1)" aria-label="Anterior">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <div class="planos-carousel" ref="planosCarouselRef">
                        <div class="plano-card-carousel" v-for="p in dados.planos" :key="p.id ?? p.nome">
                            <button type="button" class="plano-card text-start w-100 h-100"
                                @click="falarSobrePlano(p)">
                                <h5 class="fw-bold mb-1">{{ p.nome }}</h5>
                                <div class="d-flex align-items-baseline gap-1 mb-2">
                                    <span class="fs-3 fw-bold" :style="{ color: dados.corSecundaria }">{{ formatarValor(p.valorMensal) }}</span>
                                    <span class="small" style="opacity: .65;">/mês</span>
                                </div>
                                <p class="small mb-3" style="opacity: .65;">
                                    {{ p.ilimitado ? 'Usos ilimitados' : `${p.qtdCreditos} uso(s) por mês` }}
                                </p>
                                <div class="d-flex flex-wrap gap-1 mb-3" v-if="p.servicos?.length">
                                    <span v-for="s in p.servicos" :key="s.nome" class="plano-servico-chip">{{ s.nome }}</span>
                                </div>
                                <span class="plano-cta" :style="{ color: dados.corSecundaria }">
                                    <i class="bi bi-whatsapp me-1"></i>Falar sobre esse plano
                                </span>
                            </button>
                        </div>
                    </div>
                    <button v-if="dados.planos.length > 3" type="button" class="carousel-nav-btn end-0"
                        @click="rolar(planosCarouselRef, 1)" aria-label="Próximo">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>

        <!-- CONTATO (card dividido: foto de um lado, painel de fala do outro) -->
        <section class="py-5" :class="{ 'bg-light': !secaoEhEscura('contato') }" :style="estiloSecaoDinamica('contato')">
            <div class="container py-3">
                <h2 class="text-center fw-bold mb-2">Fale com a gente</h2>
                <p class="text-center mb-5" :class="{ 'text-muted': !secaoEhEscura('contato') }"
                    :style="secaoEhEscura('contato') ? { opacity: .75 } : {}">Manda uma mensagem e a gente te chama no WhatsApp.</p>

                <div class="contato-loja-box mx-auto">
                    <div class="contato-loja-photo">
                        <img v-if="dados.bannerUrl" :src="dados.bannerUrl" class="contato-loja-photo-img">
                        <div v-else class="contato-loja-photo-img d-flex align-items-center justify-content-center"
                            :style="{ background: dados.corPrimaria }">
                            <i class="bi bi-shop" :style="{ color: corTexto, fontSize: '4rem', opacity: .5 }"></i>
                        </div>
                    </div>
                    <div class="contato-loja-form-side" :style="estiloContatoForm">
                        <div class="w-100">
                            <span class="contato-loja-tag mb-3" :style="{ color: dados.corSecundaria, borderColor: dados.corSecundaria + '66', background: dados.corSecundaria + '1f' }">
                                <i class="bi bi-chat-dots-fill me-2"></i>Fale conosco
                            </span>
                            <h3 class="fw-bold mb-3">Vamos agendar seu horário?</h3>

                            <form @submit.prevent="enviarContato">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold small text-uppercase" style="opacity: .65;">Nome</label>
                                    <input v-model="formContato.nome" type="text" class="form-control contato-loja-input"
                                        placeholder="Seu nome" :disabled="modoPreview">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-semibold small text-uppercase" style="opacity: .65;">Mensagem</label>
                                    <textarea v-model="formContato.mensagem" class="form-control contato-loja-input" rows="3"
                                        placeholder="Quero agendar um horário..." :disabled="modoPreview"></textarea>
                                </div>
                                <button class="btn btn-success w-100 py-2 fw-bold" :disabled="modoPreview || !linkWhatsapp">
                                    <i class="bi bi-whatsapp me-2"></i>Falar no WhatsApp
                                </button>
                                <p v-if="!linkWhatsapp" class="small mt-2 mb-0" style="opacity: .65;">
                                    WhatsApp ainda não configurado pela loja.
                                </p>
                            </form>

                            <div class="d-flex gap-3 mt-4">
                                <span v-if="dados.endereco" class="small" style="opacity: .65;">
                                    <i class="bi bi-geo-alt-fill me-1"></i>{{ dados.endereco }}
                                </span>
                                <a v-if="linkInstagram" :href="modoPreview ? undefined : linkInstagram" target="_blank"
                                    class="small" :style="{ color: corTexto, opacity: .65 }">
                                    <i class="bi bi-instagram me-1"></i>Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="py-4 text-center small" :style="{ background: dados.corPrimaria, color: corTexto }">
            <div class="container">
                <span class="fw-semibold">{{ dados.nomeNegocio || 'Sua Loja' }}</span>
                <span style="opacity: .7;"> &middot; &copy; {{ anoAtual }} — Powered by <strong>ZenCut</strong></span>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { corContrastante } from '../utils/cor.js';

const props = defineProps({
    dados: { type: Object, required: true },
    // Usada dentro do editor: desliga navegação/links reais e envio de contato,
    // já que ali é só uma prévia ao vivo do que o visitante vai ver.
    modoPreview: { type: Boolean, default: false },
});

const anoAtual = new Date().getFullYear();

const heroStyle = computed(() => {
    if (props.dados.bannerUrl) {
        return { backgroundImage: `url(${props.dados.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: `linear-gradient(135deg, ${props.dados.corPrimaria || '#0D1B2A'} 0%, ${props.dados.corSecundaria || '#0D6EFD'} 130%)` };
});

// A loja escolhe corPrimaria/corSecundaria livremente — se escolher uma cor
// clara, texto branco fixo em cima vira ilegível. Essas seções (header,
// planos, contato, rodapé, linhas de equipe) usam a cor da loja como fundo,
// então precisam decidir dinamicamente entre texto claro ou escuro.
const corTexto = computed(() => corContrastante(props.dados.corPrimaria));
const corTextoSecundaria = computed(() => corContrastante(props.dados.corSecundaria));
const corTextoEhClaro = computed(() => corTexto.value === '#ffffff');

// Equipe e Planos só aparecem se a loja tiver cadastrado alguma coisa — então
// a sequência real de seções muda de loja pra loja. Calculamos a ordem de
// verdade e cada seção alterna clara/escura conforme a posição dela nessa
// lista, não uma posição fixa no template — evita duas seções claras (ou
// escuras) caindo uma do lado da outra.
const secoesVisiveis = computed(() => {
    const secoes = [];
    if (props.dados.servicos?.length) secoes.push('servicos');
    if (props.dados.equipe?.length) secoes.push('equipe');
    if (props.dados.planos?.length) secoes.push('planos');
    secoes.push('contato'); // sempre aparece
    return secoes;
});

const secaoEhEscura = (nome) => secoesVisiveis.value.indexOf(nome) % 2 === 1;

const estiloSecaoDinamica = (nome) => {
    if (!secaoEhEscura(nome)) {
        return {
            '--loja-card-bg': 'rgba(0,0,0,.04)',
            '--loja-card-border': 'rgba(0,0,0,.12)',
            '--loja-card-hover-bg': 'rgba(0,0,0,.07)',
        };
    }
    const claro = corTextoEhClaro.value;
    return {
        background: props.dados.corPrimaria,
        color: corTexto.value,
        '--loja-card-bg': claro ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)',
        '--loja-card-border': claro ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.12)',
        '--loja-card-hover-bg': claro ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)',
    };
};

// Cada linha da Equipe já alternava clara/escura internamente — só precisa
// começar na cor certa dependendo de onde a seção Equipe caiu na sequência.
const equipeRowEscura = (i) => secaoEhEscura('equipe') ? i % 2 === 0 : i % 2 === 1;

const estiloContatoForm = computed(() => {
    const claro = corTextoEhClaro.value;
    return {
        background: props.dados.corPrimaria,
        color: corTexto.value,
        '--loja-input-bg': claro ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.05)',
        '--loja-input-border': claro ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.15)',
        '--loja-input-text': corTexto.value,
        '--loja-input-placeholder': claro ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.4)',
    };
});

const linkWhatsapp = computed(() => {
    const numero = (props.dados.whatsapp || '').replace(/\D/g, '');
    if (!numero) return null;
    const nome = formContato.nome ? ` Meu nome é ${formContato.nome}.` : '';
    const msg = formContato.mensagem || `Olá! Vim pelo site da ${props.dados.nomeNegocio || 'loja'} e quero agendar um horário.`;
    return `https://wa.me/55${numero}?text=${encodeURIComponent(msg + nome)}`;
});

const linkInstagram = computed(() => {
    const handle = (props.dados.instagram || '').trim().replace(/^@/, '');
    if (!handle) return null;
    return `https://instagram.com/${handle}`;
});

const formContato = reactive({ nome: '', mensagem: '' });

const enviarContato = () => {
    if (props.modoPreview || !linkWhatsapp.value) return;
    window.open(linkWhatsapp.value, '_blank');
};

const formatarValor = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const servicosCarouselRef = ref(null);
const planosCarouselRef = ref(null);
const rolar = (elDom, direcao) => {
    elDom?.scrollBy({ left: direcao * 300, behavior: 'smooth' });
};

// Cliente ainda não consegue assinar sozinho — o clique no card chama direto
// no WhatsApp perguntando sobre o plano.
const falarSobrePlano = (plano) => {
    if (props.modoPreview) return;
    const numero = (props.dados.whatsapp || '').replace(/\D/g, '');
    const msg = encodeURIComponent(`Olá! Vim pelo site da ${props.dados.nomeNegocio || 'loja'} e quero saber mais sobre o plano "${plano.nome}".`);
    if (numero) {
        window.open(`https://wa.me/55${numero}?text=${msg}`, '_blank');
    }
};
</script>

<style scoped>
.vitrine-conteudo {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* --- Header: nome da loja + botão "Área do Cliente" --- */
.loja-header-btn-text {
    margin-left: .35rem;
}

@media (max-width: 480px) {
    /* Em telas bem estreitas o botão com texto inteiro empurrava o nome da
       loja pra um espacinho mínimo, cortando o título quase todo — aqui o
       botão vira só o ícone, sobrando espaço de verdade pro nome. */
    .loja-header-title {
        font-size: 1.15rem;
    }

    .loja-header-btn {
        padding: .5rem .65rem;
    }

    .loja-header-btn-text {
        display: none;
    }
}

.loja-hero {
    position: relative;
    min-height: 620px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
}

.loja-hero-content {
    position: relative;
    padding-bottom: 2.5rem;
}

.loja-hero-inner {
    max-width: 680px;
}

/* Sombra atrás do texto (não uma tarja por cima da foto toda) — deixa o
   banner visível inteiro e ainda garante leitura do título/subtítulo. */
.loja-hero-title {
    text-shadow: 0 2px 12px rgba(0, 0, 0, .75), 0 1px 3px rgba(0, 0, 0, .9);
}

.servico-foto {
    height: 160px;
    background-size: cover;
    background-position: center;
}

/* --- Carrossel de serviços --- */
.servicos-carousel-wrap {
    padding: 0 3rem;
}

.servicos-carousel {
    display: flex;
    gap: 1.25rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: .25rem .25rem 1rem;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    justify-content: center;
}

.servico-card-carousel {
    flex: 0 0 260px;
    scroll-snap-align: start;
}

.carousel-nav-btn {
    position: absolute;
    top: 38%;
    transform: translateY(-50%);
    z-index: 2;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: none;
    background: #fff;
    box-shadow: 0 4px 14px rgba(0, 0, 0, .18);
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-nav-btn:hover {
    background: #f1f3f5;
}

/* --- Carrossel de planos --- */
.planos-carousel-wrap {
    padding: 0 3rem;
}

.planos-carousel {
    display: flex;
    gap: 1.25rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: .25rem .25rem 1rem;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    justify-content: center;
}

.plano-card-carousel {
    flex: 0 0 calc(33.333% - .84rem);
    scroll-snap-align: start;
    min-width: 220px;
}

@media (max-width: 767px) {
    .plano-card-carousel {
        flex-basis: 82%;
    }
}

.plano-card {
    background: var(--loja-card-bg, rgba(255, 255, 255, .06));
    border: 1px solid var(--loja-card-border, rgba(255, 255, 255, .14));
    border-radius: 1rem;
    padding: 1.5rem;
    color: inherit;
    cursor: pointer;
    transition: transform .15s ease, background .15s ease;
}

.plano-card:hover {
    background: var(--loja-card-hover-bg, rgba(255, 255, 255, .1));
    transform: translateY(-3px);
}

.plano-servico-chip {
    background: var(--loja-card-bg, rgba(255, 255, 255, .1));
    border: 1px solid var(--loja-card-border, rgba(255, 255, 255, .2));
    border-radius: 50rem;
    padding: .2rem .65rem;
    font-size: .72rem;
}

.plano-cta {
    display: inline-flex;
    align-items: center;
    font-weight: 700;
    font-size: .85rem;
}

@media (max-width: 575px) {
    .servicos-carousel-wrap,
    .planos-carousel-wrap {
        padding: 0 1rem;
    }

    .carousel-nav-btn {
        display: none;
    }

    /* No mobile os cards quase sempre não cabem todos juntos — "centralizar"
       nesse caso empurra o scroll pra uma posição que já começa cortando o
       primeiro card. Sem centralização, o carrossel começa exatamente no
       início, com o card inteiro visível e só uma espiadinha do próximo. */
    .servicos-carousel,
    .planos-carousel {
        justify-content: flex-start;
    }

    .servico-card-carousel {
        flex-basis: 82%;
    }
}

.equipe-foto {
    height: 320px;
    object-fit: cover;
}

/* --- Contato --- */
.contato-loja-box {
    max-width: 960px;
    display: flex;
    flex-wrap: wrap;
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(13, 27, 42, .18);
}

.contato-loja-photo {
    flex: 1 1 360px;
    min-height: 420px;
}

.contato-loja-photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.contato-loja-form-side {
    flex: 1 1 380px;
    padding: 3rem;
    display: flex;
    align-items: center;
}

.contato-loja-tag {
    display: inline-flex;
    align-items: center;
    border: 1px solid;
    font-weight: 700;
    font-size: .75rem;
    text-transform: uppercase;
    letter-spacing: .05em;
    padding: .55rem 1.1rem;
    border-radius: 50rem;
}

.contato-loja-input {
    background: var(--loja-input-bg, rgba(255, 255, 255, .1)) !important;
    border: 1px solid var(--loja-input-border, rgba(255, 255, 255, .2)) !important;
    color: var(--loja-input-text, #fff) !important;
}

.contato-loja-input::placeholder {
    color: var(--loja-input-placeholder, rgba(255, 255, 255, .5));
}

@media (max-width: 767px) {
    .contato-loja-photo {
        min-height: 220px;
    }

    /* 620px de hero em pé no celular come quase a tela inteira do iPhone 13
       (844px) antes de qualquer conteúdo aparecer — reduz pra caber melhor
       sem cortar o título/subtítulo. */
    .loja-hero {
        min-height: 420px;
    }

    .loja-hero-content {
        padding-bottom: 1.75rem;
    }
}

@media (max-width: 400px) {
    /* Telas bem estreitas (iPhone SE, etc.) — mais uma folga fina */
    .loja-hero {
        min-height: 380px;
    }
}
</style>
