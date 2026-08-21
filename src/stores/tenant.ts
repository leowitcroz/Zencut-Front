import { defineStore } from 'pinia';

// Permissões/módulos do tenant atual — buscadas UMA VEZ pelo MainLayout
// (que vive durante toda a sessão logada, sem remontar entre navegações) e
// lidas pelas páginas filhas direto daqui, sem refazer o fetch. Isso evita
// tanto o loading bloqueante quanto o flash de "recurso indisponível" nas
// páginas: se o item já apareceu no menu lateral, é porque esse fetch já
// resolveu com acesso liberado — a página filha só precisa ler o valor,
// já disponível de forma síncrona e reativa.
export const useTenantStore = defineStore('tenant', {
    state: () => ({
        carregado: false,
        isSuperAdmin: false,
        funcionarioRole: null as number | null,
        nomeLoja: '',
        corPrimaria: '#0D1B2A',
        corSecundaria: '#0D6EFD',
        planoSaaS: 'BASICO',
        hasFinanceiro: false,
        hasAgendamento: false,
        hasAssinaturas: false,
        hasProdutos: false,
        hasVendas: false,
    }),
    actions: {
        definir(dados: Partial<Omit<ReturnType<typeof useTenantStore>['$state'], 'carregado'>>) {
            Object.assign(this, dados);
            this.carregado = true;
        },
    },
});
