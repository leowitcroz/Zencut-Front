<template>
    <div class="landing">
        <!-- HEADER -->
        <header class="landing-header py-3">
            <div class="container d-flex align-items-center justify-content-between">
                <h3 class="fw-bold mb-0"><ZenCutLogo variant="light" /></h3>
                <div class="d-flex align-items-center gap-4">
                    <nav class="d-none d-md-flex align-items-center gap-4">
                        <a href="#vantagens" class="nav-link-landing">Vantagens</a>
                        <a href="#precos" class="nav-link-landing">Planos</a>
                        <a href="#faq" class="nav-link-landing">Dúvidas</a>
                        <a href="#contato" class="nav-link-landing">Contato</a>
                    </nav>
                    <router-link to="/login" class="btn btn-warning fw-bold px-3">
                        <i class="bi bi-person-circle me-1"></i> Área do Cliente
                    </router-link>
                </div>
            </div>
        </header>

        <!-- HERO -->
        <section class="hero-section text-white" :style="{ backgroundImage: `url(${bannerImg})` }">
            <div class="hero-overlay"></div>
            <div class="container hero-content">
                <div class="hero-text-inner">
                    <h1 class="hero-title fw-bold mb-3">A gestão completa para a sua barbearia</h1>
                    <p class="lead mb-4 text-warning">
                        Agendamentos, planos de assinatura, comissões da equipe e financeiro em um só lugar.
                        Simples para você, elegante para seus clientes.
                    </p>
                    <div class="d-flex gap-3 flex-wrap">
                        <a href="#contato" class="btn btn-warning btn-lg fw-bold px-4">
                            <i class="bi bi-chat-dots-fill me-2"></i>Falar com um Especialista
                        </a>
                        <router-link to="/login" class="btn btn-outline-light btn-lg px-4">
                            Já sou cliente
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- VANTAGENS -->
        <section id="vantagens" class="py-5 bg-light">
            <div class="container py-4">
                <h2 class="text-center fw-bold mb-2">Tudo que sua barbearia precisa</h2>
                <p class="text-center text-muted mb-5">Uma plataforma feita sob medida para barbearias, do agendamento à comissão do time.</p>
                <div class="row g-4">
                    <div class="col-md-4" v-for="item in vantagens" :key="item.titulo">
                        <div class="card h-100 border-0 shadow-sm p-4 vantagem-card">
                            <div class="icone-wrapper mb-3" :style="{ background: item.cor }">
                                <i :class="item.icone"></i>
                            </div>
                            <h5 class="fw-bold">{{ item.titulo }}</h5>
                            <p class="text-muted mb-0 small">{{ item.descricao }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- RELATÓRIOS -->
        <section id="relatorios" class="py-5 relatorios-section text-white">
            <div class="container py-4">
                <div class="row align-items-center g-5">
                    <div class="col-lg-6">
                        <span class="badge bg-warning text-dark fw-bold mb-3">Relatórios em tempo real</span>
                        <h2 class="fw-bold mb-3">Acompanhe cada detalhe do seu negócio</h2>
                        <p class="text-white-50 mb-4">
                            Veja o desempenho da barbearia e de cada profissional sem precisar de planilha —
                            faturamento, comissões e crescimento de clientes, tudo atualizado na hora.
                        </p>
                        <ul class="list-unstyled d-flex flex-column gap-2">
                            <li v-for="item in beneficiosRelatorio" :key="item">
                                <i class="bi bi-check-circle-fill text-warning me-2"></i>{{ item }}
                            </li>
                        </ul>
                    </div>
                    <div class="col-lg-6">
                        <div class="chart-card">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <small class="text-white-50 d-block">Faturamento do mês</small>
                                    <strong class="fs-3">R$ 12.480,00</strong>
                                </div>
                               
                            </div>
                            <div class="chart-bars">
                                <div class="chart-bar" v-for="(b, i) in chartData" :key="i">
                                    <span :style="{ height: b + '%' }"></span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between small text-white-50 mt-2">
                                <span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PREÇOS -->
        <section id="precos" class="py-5 bg-light">
            <div class="container py-4">
                <h2 class="text-center fw-bold mb-2">Um plano simples, sem pegadinha</h2>
                <p class="text-center text-muted mb-5">Tudo que sua barbearia precisa, por um preço justo.</p>

                <div class="pricing-card mx-auto">
                    <div class="row align-items-center g-5">
                        <div class="col-lg-5 text-center text-lg-start">
                            <span class="contato-tag mb-3">
                                <i class="bi bi-star-fill me-2"></i>Plano Completo
                            </span>
                            <div class="d-flex align-items-baseline gap-1 mb-1 justify-content-center justify-content-lg-start">
                                <span class="pricing-currency">R$</span>
                                <span class="pricing-value">100</span>
                                <span class="pricing-period">/mês</span>
                            </div>
                            <p class="text-white-50 small mb-4">Sem taxa de adesão. Cancele quando quiser.</p>
                            <a href="#contato" class="btn btn-warning btn-lg fw-bold px-4">
                                <i class="bi bi-rocket-takeoff-fill me-2"></i>Quero começar agora
                            </a>
                        </div>
                        <div class="col-lg-7 pricing-features-col">
                            <div class="row g-3">
                                <div class="col-sm-6" v-for="item in beneficiosPlano" :key="item">
                                    <div class="d-flex align-items-start gap-2">
                                        <i class="bi bi-check-circle-fill text-warning mt-1"></i>
                                        <span>{{ item }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section id="faq" class="py-5 relatorios-section text-white">
            <div class="container py-4">
                <h2 class="text-center fw-bold mb-2">Perguntas frequentes</h2>
                <p class="text-center text-white-50 mb-5">Ainda com dúvidas? Aqui estão as respostas mais comuns.</p>

                <div class="accordion faq-accordion mx-auto" id="faqAccordion" style="max-width: 760px;">
                    <div class="accordion-item" v-for="(item, i) in faq" :key="item.pergunta">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed fw-bold" type="button"
                                data-bs-toggle="collapse" :data-bs-target="`#faq-${i}`">
                                {{ item.pergunta }}
                            </button>
                        </h2>
                        <div :id="`faq-${i}`" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body text-white-50">{{ item.resposta }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CONTATO -->
        <section id="contato" class="py-5 bg-light">
            <div class="container py-4">
           
                <div class="contato-box mx-auto">
                    <div class="contato-photo">
                        <img :src="contatoImg" alt="Interior de uma barbearia parceira ZenCut" class="contato-photo-img">
                        <div class="contato-photo-overlay"></div>
                        <div class="contato-photo-badge">
                            <i class="bi bi-chat-heart-fill text-warning fs-5"></i>
                            <span>Resposta rápida direto no WhatsApp</span>
                        </div>
                    </div>
                    <div class="contato-form-side">
                        <div class="w-100">
                            <span class="contato-tag mb-3">
                                <i class="bi bi-chat-dots-fill me-2"></i>Fale conosco
                            </span>
                            <h3 class="fw-bold text-white mb-2">Vamos conversar sobre sua barbearia?</h3>
                            <p class="text-white-50 small mb-4">Preenche os dados abaixo que a gente te chama no
                                WhatsApp.</p>
                            <form @submit.prevent="enviarContato">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold text-white-50 small text-uppercase">Nome</label>
                                    <input v-model="form.nome" type="text" class="form-control contato-input"
                                        placeholder="Seu nome" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-semibold text-white-50 small text-uppercase">Nome da
                                        barbearia (opcional)</label>
                                    <input v-model="form.barbearia" type="text" class="form-control contato-input"
                                        placeholder="Nome do seu negócio">
                                </div>
                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-white-50 small text-uppercase">Mensagem</label>
                                    <textarea v-model="form.mensagem" class="form-control contato-input" rows="3"
                                        placeholder="Conte um pouco sobre sua barbearia"></textarea>
                                </div>
                                <button class="btn btn-success w-100 py-2 fw-bold">
                                    <i class="bi bi-whatsapp me-2"></i>Falar no WhatsApp
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="landing-footer pt-5 pb-4 text-white">
            <div class="container">
                <div class="row gy-4 mb-4">
                    <div class="col-lg-5">
                        <h4 class="fw-bold mb-2"><ZenCutLogo variant="light" /></h4>
                        <p class="text-white-50 small mb-3" style="max-width: 320px;">
                            Gestão completa para barbearias: agendamento, planos de assinatura, comissão da equipe
                            e financeiro em um só lugar.
                        </p>
                        <div class="d-flex align-items-center gap-2 text-white-50 small mb-3">
                            <i class="bi bi-telephone-fill"></i>
                            <a href="tel:+5541999838087" class="footer-link">(41) 99983-8087</a>
                        </div>
                        <!-- Ícones prontos pra receber os links reais assim que existirem -->
                        <div class="d-flex gap-2">
                            <span class="footer-social-icon" title="Instagram"><i class="bi bi-instagram"></i></span>
                            <span class="footer-social-icon" title="E-mail"><i class="bi bi-envelope-fill"></i></span>
                        </div>
                    </div>
                    <div class="col-lg-3 col-6">
                        <h6 class="fw-bold mb-3">Navegação</h6>
                        <ul class="list-unstyled d-flex flex-column gap-2 small">
                            <li><a href="#vantagens" class="footer-link">Vantagens</a></li>
                            <li><a href="#precos" class="footer-link">Planos</a></li>
                            <li><a href="#faq" class="footer-link">Dúvidas</a></li>
                            <li><a href="#contato" class="footer-link">Contato</a></li>
                        </ul>
                    </div>
                    <div class="col-lg-4 col-6">
                        <h6 class="fw-bold mb-3">Área do Cliente</h6>
                        <ul class="list-unstyled d-flex flex-column gap-2 small">
                            <li><router-link to="/login" class="footer-link">Já sou cliente</router-link></li>
                            <li><a href="#contato" class="footer-link">Quero conhecer a ZenCut</a></li>
                        </ul>
                    </div>
                </div>
                <hr class="border-secondary opacity-25">
                <div class="text-center small text-white-50">
                    &copy; {{ anoAtual }} ZenCut. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import ZenCutLogo from '@/components/ZenCutLogo.vue';
import bannerImg from '@/assets/banner.jpg';
import contatoImg from '@/assets/entreContato.jpg';

const anoAtual = new Date().getFullYear();

// WhatsApp comercial da ZenCut (contato de vendas da plataforma).
const WHATSAPP_VENDAS = '5541999838087';

const vantagens = [
    { icone: 'bi bi-calendar2-check', titulo: 'Agendamento Online', descricao: 'Seus clientes marcam horário sozinhos, sem trocar mensagens.', cor: 'linear-gradient(135deg, #0D6EFD, #3b9bff)' },
    { icone: 'bi bi-award', titulo: 'Planos de Assinatura', descricao: 'Crie planos mensais personalizados e fidelize sua clientela.', cor: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
    { icone: 'bi bi-cash-coin', titulo: 'Financeiro Completo', descricao: 'Entradas, despesas e receita de planos em um painel só.', cor: 'linear-gradient(135deg, #16a34a, #4ade80)' },
    { icone: 'bi bi-people', titulo: 'Comissão da Equipe', descricao: 'Configure a comissão de cada barbeiro do seu jeito, sem planilha.', cor: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
    { icone: 'bi bi-person-badge', titulo: 'Acesso por Perfil', descricao: 'Cada barbeiro vê só a agenda e o financeiro dele.', cor: 'linear-gradient(135deg, #0891b2, #22d3ee)' },
    { icone: 'bi bi-graph-up', titulo: 'Relatórios Detalhados', descricao: 'Acompanhe o desempenho da barbearia e de cada profissional.', cor: 'linear-gradient(135deg, #dc2626, #f87171)' },
];

const beneficiosRelatorio = [
    'Faturamento por período, serviço e barbeiro',
    'Comissão calculada automaticamente pra cada funcionário',
    'Histórico de renovações de planos e assinaturas',
];

const chartData = [45, 60, 40, 70, 55, 85];

const beneficiosPlano = [
    'Agendamento online ilimitado',
    'Planos de assinatura personalizados pros seus clientes',
    'Comissão de cada funcionário calculada automaticamente',
    'Financeiro completo: entradas, despesas e relatórios',
    'Acesso individual pra cada barbeiro da equipe',
    'Suporte direto pelo WhatsApp',
];

const faq = [
    {
        pergunta: 'Preciso instalar algum aplicativo?',
        resposta: 'Não. A ZenCut funciona direto no navegador, tanto no computador quanto no celular ou tablet — não precisa instalar nem atualizar nada.',
    },
    {
        pergunta: 'Meus clientes conseguem marcar horário sozinhos?',
        resposta: 'Sim! Cada barbearia tem sua própria página de agendamento, onde o cliente escolhe o serviço, o profissional e o horário sem precisar te chamar no WhatsApp.',
    },
    {
        pergunta: 'Consigo configurar a comissão de cada funcionário do meu jeito?',
        resposta: 'Sim. Você define o percentual por produto, por bebida/consumível, por serviço avulso e o valor fixo por serviço coberto por plano — tudo personalizado pra sua barbearia.',
    },
    {
        pergunta: 'Preciso entender de tecnologia pra usar o sistema?',
        resposta: 'Não. O painel foi pensado pra ser simples: se você sabe usar WhatsApp e Instagram, consegue usar a ZenCut sem dificuldade.',
    },
    {
        pergunta: 'Como funciona o suporte?',
        resposta: 'Direto pelo WhatsApp, com um especialista de verdade — sem robô, sem fila de chamados.',
    },
    {
        pergunta: 'Tem fidelidade ou multa pra cancelar?',
        resposta: 'Não. O plano é mensal, sem contrato de fidelidade. Você pode cancelar quando quiser.',
    },
];

const form = reactive({ nome: '', barbearia: '', mensagem: '' });

const enviarContato = () => {
    const linhas = [
        `Olá! Meu nome é ${form.nome}.`,
        form.barbearia && `Barbearia: ${form.barbearia}`,
        form.mensagem,
    ].filter(Boolean);

    const mensagem = encodeURIComponent(linhas.join('\n'));
    window.open(`https://wa.me/${WHATSAPP_VENDAS}?text=${mensagem}`, '_blank');
};
</script>

<style scoped>
.landing {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.landing-header {
    background: #0d1b2a;
    position: sticky;
    top: 0;
    z-index: 10;
}

.nav-link-landing {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-weight: 500;
}

.nav-link-landing:hover {
    color: #fff;
}

.hero-section {
    position: relative;
    overflow: hidden;
    min-height: 640px;
    display: flex;
    align-items: center;
    background-size: cover;
    background-position: center 25%;
    background-repeat: no-repeat;
}

/* Camada escura sobre a foto pra garantir contraste e legibilidade do texto —
   mais forte à esquerda (onde o texto fica) e mais suave à direita. */
.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, rgba(9, 18, 31, .95) 15%, rgba(13, 27, 42, .8) 45%, rgba(13, 27, 42, .45) 100%);
}

.hero-content {
    position: relative;
    z-index: 1;
    padding: 4rem 0;
}

.hero-text-inner {
    max-width: 560px;
}

.hero-title {
    font-size: clamp(2.1rem, 3.2vw + 1rem, 3.2rem);
    line-height: 1.15;
    text-wrap: balance;
}

/* --- Vantagens --- */
.vantagem-card {
    transition: transform 0.2s ease-in-out;
}

.vantagem-card:hover {
    transform: translateY(-4px);
}

.icone-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #fff;
}

/* --- Relatórios --- */
.relatorios-section {
    background: linear-gradient(135deg, #123152 0%, #0d1b2a 100%);
}

.chart-card {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 1.25rem;
    padding: 1.75rem;
}

.chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    height: 120px;
}

.chart-bar {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: flex-end;
}

.chart-bar span {
    width: 100%;
    border-radius: 6px 6px 0 0;
    background: linear-gradient(180deg, #0d6efd, #3b9bff);
    display: block;
}

.landing-footer {
    background: #0d1b2a;
}

/* --- Contato --- */
.contato-box {
    max-width: 960px;
    display: flex;
    flex-wrap: wrap;
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 25px 60px rgba(13, 27, 42, .25);
}

.contato-photo {
    flex: 1 1 360px;
    min-height: 460px;
    position: relative;
}

.contato-photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.contato-photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(13, 27, 42, 0) 45%, rgba(13, 27, 42, .92) 100%);
}

.contato-photo-badge {
    position: absolute;
    left: 1.5rem;
    right: 1.5rem;
    bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: .6rem;
    color: #fff;
    font-weight: 600;
}

/* Lado do formulário usa a mesma paleta azul/navy do resto do site, em vez
   de branco liso — deixa o box inteiro coeso com a identidade da marca. */
.contato-form-side {
    flex: 1 1 380px;
    padding: 3.5rem 3rem;
    display: flex;
    align-items: center;
    background: linear-gradient(155deg, #0d1b2a 0%, #14304d 100%);
}

/* Selo "Fale conosco" — tonalizado (não sólido), com respiro em volta pra
   parecer parte desenhada da caixa, não um badge solto coladinho no canto. */
.contato-tag {
    display: inline-flex;
    align-items: center;
    background: rgba(255, 193, 7, .12);
    border: 1px solid rgba(255, 193, 7, .4);
    color: #ffc107;
    font-weight: 700;
    font-size: .75rem;
    text-transform: uppercase;
    letter-spacing: .05em;
    padding: .55rem 1.1rem;
    border-radius: 50rem;
}

.contato-input {
    background: rgba(255, 255, 255, .08) !important;
    border: 1px solid rgba(255, 255, 255, .15) !important;
    color: #fff !important;
}

.contato-input::placeholder {
    color: rgba(255, 255, 255, .45);
}

.contato-input:focus {
    background: rgba(255, 255, 255, .12) !important;
    border-color: #ffc107 !important;
    box-shadow: 0 0 0 .2rem rgba(255, 193, 7, .15) !important;
}

@media (max-width: 767px) {
    .contato-photo {
        min-height: 260px;
    }
}

/* --- Preços --- */
.pricing-card {
    max-width: 960px;
    background: linear-gradient(155deg, #0d1b2a 0%, #14304d 100%);
    border-radius: 1.5rem;
    padding: 3rem;
    box-shadow: 0 25px 60px rgba(13, 27, 42, .25);
    color: #fff;
}

@media (min-width: 992px) {
    .pricing-features-col {
        padding-left: 2.5rem;
        border-left: 1px solid rgba(255, 255, 255, .12);
    }
}

.pricing-currency {
    font-size: 1.5rem;
    font-weight: 700;
    color: rgba(255, 255, 255, .7);
}

.pricing-value {
    font-size: 4rem;
    font-weight: 800;
    line-height: 1;
}

.pricing-period {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, .55);
}

/* --- FAQ (seção de fundo escuro — acordeon "vidro fosco", igual aos cards
   da seção de Relatórios) --- */
.faq-accordion .accordion-item {
    background: rgba(255, 255, 255, .06);
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: 1rem !important;
    overflow: hidden;
    margin-bottom: .75rem;
}

.faq-accordion .accordion-button {
    background: transparent;
    color: #fff;
}

.faq-accordion .accordion-button:not(.collapsed) {
    background: rgba(255, 193, 7, .1);
    color: #ffc107;
    box-shadow: none;
}

.faq-accordion .accordion-button:focus {
    box-shadow: 0 0 0 .2rem rgba(255, 193, 7, .15);
}

.faq-accordion .accordion-button::after {
    filter: invert(1) grayscale(100%) brightness(200%);
}

/* --- Rodapé --- */
.footer-link {
    color: rgba(255, 255, 255, .6);
    text-decoration: none;
}

.footer-link:hover {
    color: #ffc107;
}

.footer-social-icon {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, .08);
    border: 1px solid rgba(255, 255, 255, .15);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, .7);
    font-size: 1.05rem;
}
</style>
