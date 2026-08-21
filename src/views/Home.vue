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

        <div v-if="isSuperAdmin">
            <div class="row mb-4 border-bottom pb-3">
                <div class="col-12 d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <h2 class="fw-bold text-primary mb-1">
                            <i class="bi bi-globe me-2"></i> ZenCut Cloud - Central
                        </h2>
                        <p class="text-muted mb-0">Visão global de todos os clientes, planos e faturamento da
                            plataforma.</p>
                    </div>
                    <span class="badge bg-dark fs-6 py-2 px-3 mt-3 mt-md-0">
                        <i class="bi bi-shield-lock-fill me-2"></i> Super Admin
                    </span>
                </div>
            </div>

                <div class="row g-3 mb-4">
                    <div class="col-6 col-md-3">
                        <div class="card border-0 shadow-sm p-4 bg-white h-100">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 class="text-muted text-uppercase small fw-bold">Total de Lojas</h6>
                                    <h3 class="fw-bold m-0 text-dark">{{ dashboardAdmin.totalLojas }}</h3>
                                </div>
                                <div class="bg-primary bg-opacity-10 p-3 rounded text-primary">
                                    <i class="bi bi-buildings-fill fs-3"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-3">
                        <div class="card border-0 shadow-sm p-4 bg-white h-100">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 class="text-muted text-uppercase small fw-bold">Lojas Ativas</h6>
                                    <h3 class="fw-bold m-0 text-success">{{ dashboardAdmin.lojasAtivas }}</h3>
                                </div>
                                <div class="bg-success bg-opacity-10 p-3 rounded text-success">
                                    <i class="bi bi-check-circle-fill fs-3"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-3">
                        <div class="card border-0 shadow-sm p-4 bg-white h-100">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 class="text-muted text-uppercase small fw-bold">Faturamento (Mês)</h6>
                                    <h3 class="fw-bold m-0 text-success">{{ formatarMoeda(dashboardAdmin.faturamentoMes) }}</h3>
                                </div>
                                <div class="bg-success bg-opacity-10 p-3 rounded text-success">
                                    <i class="bi bi-currency-dollar fs-3"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-6 col-md-3">
                        <div class="card border-0 shadow-sm p-4 bg-white h-100">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 class="text-muted text-uppercase small fw-bold">Faturas Pendentes</h6>
                                    <h3 class="fw-bold m-0" :class="dashboardAdmin.faturasPendentes > 0 ? 'text-danger' : 'text-dark'">
                                        {{ dashboardAdmin.faturasPendentes }}
                                    </h3>
                                </div>
                                <div class="bg-danger bg-opacity-10 p-3 rounded text-danger">
                                    <i class="bi bi-exclamation-triangle-fill fs-3"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4">
                    <div class="col-12 col-lg-4">
                        <div class="card border-0 shadow-sm p-4 h-100">
                            <h6 class="fw-bold mb-3"><i class="bi bi-lightning-charge-fill text-warning me-2"></i> Ações Rápidas</h6>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary text-start fw-bold" @click="router.push('/adm/lojas')">
                                    <i class="bi bi-plus-circle me-2"></i> Provisionar Nova Loja
                                </button>
                                <button class="btn btn-outline-secondary text-start" @click="router.push('/adm/lojas')">
                                    <i class="bi bi-buildings me-2"></i> Central de Lojas
                                </button>
                                <button class="btn btn-outline-secondary text-start" @click="router.push('/financeiro')">
                                    <i class="bi bi-graph-up-arrow me-2"></i> Financeiro da Plataforma
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-8">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-header bg-white border-bottom-0 pt-3 d-flex justify-content-between align-items-center">
                                <h6 class="fw-bold mb-0"><i class="bi bi-clock-history text-primary me-2"></i> Lojas Recentes</h6>
                                <button class="btn btn-sm btn-outline-secondary border-0" @click="router.push('/adm/lojas')">
                                    Ver todas <i class="bi bi-arrow-right ms-1"></i>
                                </button>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive" v-if="lojasRecentes.length > 0">
                                    <table class="table table-hover align-middle mb-0">
                                        <tbody>
                                            <tr v-for="loja in lojasRecentes" :key="loja.id">
                                                <td class="px-4">
                                                    <span class="d-block fw-bold text-dark">{{ loja.nomeNegocio }}</span>
                                                    <small class="text-muted">{{ loja.subdomain }}.zencut.com.br</small>
                                                </td>
                                                <td><span class="badge bg-dark">{{ loja.planoSaaS }}</span></td>
                                                <td class="text-end px-4">
                                                    <span v-if="loja.ativo"
                                                        class="badge bg-success bg-opacity-10 text-success border border-success rounded-pill px-3">Ativo</span>
                                                    <span v-else
                                                        class="badge bg-danger bg-opacity-10 text-danger border border-danger rounded-pill px-3">Bloqueada</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-else class="text-center py-5 text-muted">
                                    <i class="bi bi-buildings display-6 d-block mb-2 opacity-50"></i>
                                    Nenhuma loja cadastrada ainda.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>

        <div v-else>
            <div class="row mb-4 border-bottom pb-3">
                <div class="col-12 d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <h2 class="fw-bold text-dark mb-1" style="color: white;">Painel de Controle - {{ nomeEmpresa }}</h2>
                        <p class="text-muted mb-0">Bem-vindo ao centro de comando do seu estabelecimento.</p>
                    </div>
                    <div class="d-flex gap-2 mt-3 mt-md-0">
                        <button class="btn btn-outline-primary fw-bold shadow-sm" data-bs-toggle="modal"
                            data-bs-target="#modalEquipe">
                            <i class="bi bi-people-fill me-1"></i> Equipe
                        </button>
                        <button class="btn btn-warning fw-bold shadow-sm d-flex align-items-center gap-2">
                            <i class="bi bi-star-fill"></i> Meu Plano VIP
                        </button>
                    </div>
                </div>
            </div>

            <div class="row g-3 mb-4">
                <div v-if="temModuloFinanceiro" class="col-md-3">
                    <div class="card border-0 shadow-sm p-4 bg-white h-100">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 class="text-muted text-uppercase small fw-bold">Faturamento (Mês)</h6>
                                <h3 class="fw-bold m-0 text-success">{{ formatarMoeda(dashboard.faturamentoMes) }}</h3>
                            </div>
                            <div class="bg-light-success p-3 rounded text-success bg-opacity-10">
                                <i class="bi bi-currency-dollar fs-3"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card border-0 shadow-sm p-4 bg-white h-100">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 class="text-muted text-uppercase small fw-bold">Agendamentos Hoje</h6>
                                <h3 class="fw-bold m-0 text-primary">{{ dashboard.agendamentosHoje }}</h3>
                            </div>
                            <div class="bg-light-primary p-3 rounded text-primary bg-opacity-10">
                                <i class="bi bi-calendar-check fs-3"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="temModuloFinanceiro" class="col-md-3">
                    <div class="card border-0 shadow-sm p-4 bg-white h-100">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 class="text-muted text-uppercase small fw-bold">Despesas Pendentes</h6>
                                <h3 class="fw-bold m-0 text-danger">{{ formatarMoeda(dashboard.despesasPendentes) }}
                                </h3>
                            </div>
                            <div class="bg-light-danger p-3 rounded text-danger bg-opacity-10">
                                <i class="bi bi-cash-stack fs-3"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card border-0 shadow-sm p-4 bg-white h-100">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <h6 class="text-muted text-uppercase small fw-bold">Novos Clientes (Mês)</h6>
                                <h3 class="fw-bold m-0 text-info">{{ dashboard.novosClientes }}</h3>
                            </div>
                            <div class="bg-light-info p-3 rounded text-info bg-opacity-10">
                                <i class="bi bi-people fs-3"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h5 class="fw-bold mb-3 mt-5 border-bottom pb-2">Módulos Administrativos</h5>
            <div class="row g-4 mb-5">
                <div v-if="temModuloAgendamento" class="col-12 col-md-4">
                    <div class="card border-0 shadow-sm p-4 h-100">
                        <h6 class="fw-bold mb-3"><i class="bi bi-calendar-week text-primary me-2"></i> Operacional</h6>
                        <div class="d-grid gap-2">
                            <button v-if="temModuloAgendamento" class="btn btn-outline-secondary text-start"
                                @click="router.push('/agendamentos')">
                                <i class="bi bi-list-ul me-2"></i> Ver Todos os Agendamentos
                            </button>

                            <button class="btn btn-outline-secondary text-start" data-bs-toggle="modal"
                                data-bs-target="#modalServicos">
                                <i class="bi bi-card-checklist me-2"></i> Gerenciar Serviços (CRUD)
                            </button>

                            <button v-if="temModuloAgendamento" class="btn btn-outline-secondary text-start"
                                data-bs-toggle="modal" data-bs-target="#modalAgendamento">
                                <i class="bi bi-calendar-plus me-2"></i> Criar Novo Agendamento
                            </button>

                            <button v-if="temModuloAgendamento" @click="irParaHorarios"
                                class="btn btn-outline-primary text-start fw-bold mt-2">
                                <i class="bi bi-clock-history me-2"></i> Grade Rápida de Horários
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="temModuloProdutos || temModuloVendas" class="col-12 col-md-4">
                    <div class="card border-0 shadow-sm p-4 h-100">
                        <h6 class="fw-bold mb-3"><i class="bi bi-box-seam text-warning me-2"></i> Produtos & Estoque
                        </h6>
                        <div class="d-grid gap-2">
                            <button v-if="temModuloVendas" class="btn btn-outline-secondary text-start"
                                data-bs-toggle="modal" data-bs-target="#modalVendaProduto">
                                <i class="bi bi-cart-plus me-2"></i> Nova Venda de Produto
                            </button>

                            <button v-if="temModuloVendas" class="btn btn-outline-secondary text-start"
                                data-bs-toggle="modal" data-bs-target="#modalHistoricoVendas"
                                @click="carregarHistoricoVendas">
                                <i class="bi bi-clock-history me-2"></i> Histórico de Vendas
                            </button>

                            <button v-if="temModuloProdutos" class="btn btn-outline-secondary text-start"
                                data-bs-toggle="modal" data-bs-target="#modalProdutos">
                                <i class="bi bi-tags me-2"></i> Cadastro de Produtos (CRUD)
                            </button>

                            <button v-if="temModuloProdutos" class="btn btn-outline-secondary text-start"
                                @click="router.push('/estoque')">
                                <i class="bi bi-boxes me-2"></i> Controle de Estoque
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="temModuloFinanceiro" class="col-12 col-md-4">
                    <div class="card border-0 shadow-sm p-4 h-100">
                        <h6 class="fw-bold mb-3"><i class="bi bi-graph-up-arrow text-success me-2"></i> Financeiro &
                            Equipe</h6>
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-secondary text-start" @click="router.push('/financeiro')">
                                <i class="bi bi-pie-chart me-2"></i> Relatório Financeiro Geral
                            </button>
                            <button class="btn btn-outline-secondary text-start" @click="abrirModalComissoes">
                                <i class="bi bi-person-lines-fill me-2"></i> Comissões de Funcionários
                            </button>
                            <button class="btn btn-outline-secondary text-start" @click="abrirRelatorioBarbeiros">
                                <i class="bi bi-file-earmark-bar-graph me-2"></i> Relatório de Barbeiros
                            </button>
                            <button class="btn btn-outline-secondary text-start" @click="router.push('/financeiro')">
                                <i class="bi bi-receipt me-2"></i> Lançar Despesa / Contas a Pagar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- 👇 MODAIS (EQUIPE, SERVIÇOS, AGENDAMENTOS) -->
        <!-- ========================================== -->

        <!-- MODAL: EQUIPE -->
        <div class="modal fade" id="modalEquipe" tabindex="-1" aria-hidden="true" v-if="!isSuperAdmin">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="bi bi-people me-2"></i> Equipe Profissional</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <div class="card border-0 shadow-sm mb-4">
                            <div class="card-header bg-white border-bottom-0 pt-3">
                                <h6 class="fw-bold text-primary mb-0">Cadastrar Novo Membro</h6>
                            </div>
                            <div class="card-body">
                                <form @submit.prevent="salvarFuncionario">
                                    <div class="row g-2 mb-2">
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold text-muted text-uppercase">Nome
                                                Completo</label>
                                            <input v-model="novoFuncionario.nome" type="text" class="form-control"
                                                placeholder="Ex: João da Silva" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold text-muted text-uppercase">E-mail
                                                (para login)</label>
                                            <input v-model="novoFuncionario.email" type="email" class="form-control"
                                                placeholder="joao@email.com" required>
                                        </div>
                                    </div>
                                    <div class="row g-2 mb-3">
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold text-muted text-uppercase">Foto
                                                (opcional)</label>
                                            <input type="file" class="form-control" accept="image/*"
                                                @change="onSelecionarFotoFuncionario">
                                            <div class="form-text">Recomendado: quadrada ou retrato (mín.
                                                500×500px), rosto centralizado.</div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-bold text-muted text-uppercase">Bio
                                                (vitrine pública)</label>
                                            <input v-model="novoFuncionario.descricao" type="text" class="form-control"
                                                placeholder="Ex: Especialista em degradê." maxlength="255">
                                        </div>
                                    </div>
                                    <div class="alert alert-light border small py-2 mb-3">
                                        <i class="bi bi-info-circle me-1"></i> Login criado com a senha padrão
                                        <strong>{{ SENHA_PADRAO_FUNCIONARIO }}</strong> — avise o funcionário pra
                                        trocar em "Meu Perfil" assim que entrar.
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100 fw-bold"
                                        :disabled="salvandoFuncionario">
                                        <span v-if="salvandoFuncionario" class="spinner-border spinner-border-sm me-2"
                                            role="status"></span>
                                        <i v-else class="bi bi-plus-lg me-1"></i> Criar Funcionário
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div class="card border-0 shadow-sm">
                            <div
                                class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                                <h6 class="fw-bold mb-0">Todos os Funcionários</h6>
                                <button @click="carregarEquipe" class="btn btn-sm btn-outline-secondary border-0"><i
                                        class="bi bi-arrow-clockwise"></i></button>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive" v-if="equipe.length > 0">
                                    <table class="table table-hover align-middle mb-0">
                                        <tbody>
                                            <tr v-for="membro in equipe" :key="membro.id"
                                                :class="{ 'opacity-50': !membro.ativo }">
                                                <td style="width: 48px;">
                                                    <img v-if="membro.fotoUrl" :src="membro.fotoUrl"
                                                        class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                                                    <div v-else
                                                        class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                                                        style="width: 40px; height: 40px;">
                                                        <i class="bi bi-person-fill"></i>
                                                    </div>
                                                </td>
                                                <td>
                                                    <h6 class="mb-0 fw-bold">{{ membro.nome }}</h6>
                                                    <span class="badge"
                                                        :class="membro.ativo ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'">
                                                        {{ membro.ativo ? 'Ativo' : 'Desligado' }}
                                                    </span>
                                                </td>
                                                <td class="text-end text-nowrap">
                                                    <button @click="abrirEdicaoFuncionario(membro)"
                                                        class="btn btn-sm btn-outline-primary me-1"><i
                                                            class="bi bi-pencil-fill"></i></button>
                                                    <button @click="abrirHorarios(membro.id)"
                                                        class="btn btn-sm btn-outline-dark me-1" data-bs-dismiss="modal"><i
                                                            class="bi bi-calendar3 me-1"></i> Horários</button>
                                                    <button v-if="membro.ativo" @click="alternarStatusFuncionario(membro, false)"
                                                        class="btn btn-sm btn-outline-danger me-1">
                                                        <i class="bi bi-person-x-fill me-1"></i> Desligar
                                                    </button>
                                                    <button v-else @click="alternarStatusFuncionario(membro, true)"
                                                        class="btn btn-sm btn-outline-success me-1">
                                                        <i class="bi bi-person-check-fill me-1"></i> Reativar
                                                    </button>
                                                    <button @click="excluirFuncionario(membro)"
                                                        class="btn btn-sm btn-outline-secondary" title="Excluir definitivamente">
                                                        <i class="bi bi-trash-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: EDITAR MEMBRO DA EQUIPE -->
        <div class="modal fade" id="modalEditarFuncionario" tabindex="-1" aria-hidden="true" ref="modalEditarFuncionarioRef">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="bi bi-pencil-fill me-2"></i> Editar Membro</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4" v-if="funcionarioEditando">
                        <form @submit.prevent="salvarEdicaoFuncionario">
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted text-uppercase">Nome Completo</label>
                                <input v-model="funcionarioEditando.nome" type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted text-uppercase">Bio (vitrine pública)</label>
                                <textarea v-model="funcionarioEditando.descricao" class="form-control" rows="3"
                                    placeholder="Ex: Especialista em degradê e barba, mais de 10 anos de experiência."
                                    maxlength="255"></textarea>
                            </div>
                            <div class="mb-4">
                                <label class="form-label small fw-bold text-muted text-uppercase">Trocar Foto</label>
                                <input type="file" class="form-control" accept="image/*" @change="onSelecionarFotoEdicaoFuncionario">
                                <div class="form-text">Recomendado: quadrada ou retrato (mín. 500×500px), rosto
                                    centralizado.</div>
                                <img v-if="fotoEdicaoPreview" :src="fotoEdicaoPreview" class="rounded-circle mt-2"
                                    style="width: 64px; height: 64px; object-fit: cover;">
                            </div>
                            <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="salvandoEdicaoFuncionario">
                                <span v-if="salvandoEdicaoFuncionario" class="spinner-border spinner-border-sm me-2"></span>
                                Salvar Alterações
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: SERVIÇOS -->
        <div class="modal fade" id="modalServicos" tabindex="-1" aria-hidden="true" v-if="!isSuperAdmin">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="bi bi-scissors me-2"></i> Serviços e Preços</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <div class="card border-0 shadow-sm mb-4">
                            <div class="card-header bg-white border-bottom-0 pt-3 d-flex justify-content-between align-items-center">
                                <h6 class="fw-bold text-primary mb-0">{{ servicoEditandoId ? 'Editar Serviço' : 'Cadastrar Novo Serviço' }}</h6>
                                <button v-if="servicoEditandoId" type="button" class="btn btn-sm btn-outline-secondary" @click="cancelarEdicaoServico">Cancelar</button>
                            </div>
                            <div class="card-body">
                                <form @submit.prevent="salvarServico">
                                    <div class="row g-2 mb-2">
                                        <div class="col-md-6"><input v-model="novoServico.nome" type="text"
                                                class="form-control" placeholder="Nome do serviço" required></div>
                                        <div class="col-md-3">
                                            <CurrencyInput v-model="novoServico.valor" required />
                                        </div>
                                        <div class="col-md-3"><button type="submit" :disabled="salvandoServico"
                                                class="btn btn-primary w-100 fw-bold">
                                                <span v-if="salvandoServico" class="spinner-border spinner-border-sm me-1"></span>
                                                {{ servicoEditandoId ? 'Salvar' : 'Adicionar' }}
                                            </button></div>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-8">
                                            <label class="form-label small text-muted mb-1">Descrição (aparece na vitrine pública)</label>
                                            <textarea v-model="novoServico.descricao" class="form-control" rows="2"
                                                placeholder="Ex: Corte moderno com acabamento na navalha." maxlength="255"></textarea>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label small text-muted mb-1">Foto (opcional)</label>
                                            <input type="file" accept="image/*" class="form-control form-control-sm"
                                                @change="selecionarFotoServico">
                                            <div class="form-text">Recomendado: 600×450px (proporção 4:3).</div>
                                            <img v-if="fotoServicoPreview" :src="fotoServicoPreview"
                                                class="rounded mt-2" style="width: 100%; height: 70px; object-fit: cover;">
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="card border-0 shadow-sm">
                            <div
                                class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                                <h6 class="fw-bold mb-0">Catálogo de Serviços</h6>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive" v-if="servicos.length > 0">
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th style="width: 56px;"></th>
                                                <th>Nome do Serviço</th>
                                                <th style="width: 150px;">Valor</th>
                                                <th class="text-end" style="width: 120px;">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="servico in servicos" :key="servico.id">
                                                <td>
                                                    <img v-if="servico.fotoUrl" :src="servico.fotoUrl" class="rounded"
                                                        style="width: 40px; height: 40px; object-fit: cover;">
                                                    <i v-else class="bi bi-scissors text-muted"></i>
                                                </td>
                                                <td class="fw-medium text-dark">{{ servico.nome }}</td>
                                                <td><span class="badge bg-success-subtle text-success border">{{
                                                    formatarMoeda(servico.valor) }}</span></td>
                                                <td class="text-end text-nowrap">
                                                    <button @click="iniciarEdicaoServico(servico)"
                                                        class="btn btn-sm btn-light text-primary rounded-circle shadow-sm me-1"><i
                                                            class="bi bi-pencil-fill"></i></button>
                                                    <button
                                                        @click="deletarServico(servico.id)"
                                                        class="btn btn-sm btn-light text-danger rounded-circle shadow-sm"><i
                                                            class="bi bi-trash"></i></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: NOVO AGENDAMENTO -->
        <div class="modal fade" id="modalAgendamento" tabindex="-1" aria-hidden="true" v-if="!isSuperAdmin">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="bi bi-calendar-plus me-2"></i> Novo Agendamento</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close" id="btnFecharModalAgendamento"></button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <form @submit.prevent="salvarAgendamento">
                            <div class="row g-3 mb-4">
                                <div class="col-md-12">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Cliente</label>
                                    <div class="position-relative">
                                        <input v-model="formAgendamento.nomeCliente" type="text"
                                            class="form-control form-control-lg"
                                            placeholder="Nome, e-mail ou telefone do cliente" autocomplete="off"
                                            :disabled="!!clienteEncontrado" @input="buscarSugestoesCliente" required>

                                        <div class="list-group position-absolute w-100 shadow-sm"
                                            style="z-index: 1060; max-height: 220px; overflow-y: auto;"
                                            v-if="sugestoesCliente.length > 0">
                                            <button type="button" class="list-group-item list-group-item-action"
                                                v-for="c in sugestoesCliente" :key="c.id"
                                                @click="selecionarClienteAgendamento(c)">
                                                <span class="fw-bold">{{ c.nome }}</span>
                                                <small class="text-muted d-block">{{ c.email || c.telefone ||
                                                    'Sem contato cadastrado' }}</small>
                                            </button>
                                        </div>
                                    </div>

                                    <div v-if="clienteEncontrado"
                                        class="alert alert-success d-flex justify-content-between align-items-center mt-2 py-2 mb-0">
                                        <div>
                                            <i class="bi bi-check-circle-fill me-1"></i>
                                            Cliente cadastrado
                                            <span v-if="clienteEncontrado.assinatura"> — Plano: {{
                                                clienteEncontrado.assinatura.nomePlano }} ({{
                                                clienteEncontrado.assinatura.creditosRestantes }} crédito(s)
                                                restante(s))</span>
                                            <span v-else class="text-muted"> — sem plano ativo</span>
                                        </div>
                                        <button type="button" class="btn-close" @click="limparClienteEncontrado"
                                            aria-label="Remover"></button>
                                    </div>
                                    <div class="form-text" v-else>Digite ao menos 2 caracteres pra buscar um cliente já
                                        cadastrado. Se não escolher nenhum, o agendamento é avulso.</div>
                                </div>
                                <div class="col-md-6">
                                    <label
                                        class="form-label fw-bold small text-muted text-uppercase">Profissional</label>
                                    <select v-model="formAgendamento.funcionarioId" class="form-select form-select-lg"
                                        @change="buscarHorariosLivres" required>
                                        <option value="" disabled selected>Selecione...</option>
                                        <option v-for="membro in equipeParaAgendamento" :key="membro.id" :value="membro.id">{{
                                            membro.nome }}</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Data</label>
                                    <input v-model="formAgendamento.data" type="date"
                                        class="form-control form-control-lg" :min="getHoje()"
                                        @change="buscarHorariosLivres" required>
                                </div>
                            </div>

                            <div v-if="formAgendamento.funcionarioId && formAgendamento.data" class="mb-4">
                                <label class="form-label fw-bold small text-muted text-uppercase">Horários
                                    Livres</label>
                                <div v-if="carregandoHorariosLivre" class="text-primary small"><span
                                        class="spinner-border spinner-border-sm me-2"></span> Buscando horários...</div>
                                <div v-else-if="horariosLivres.length === 0" class="alert alert-warning border-0 py-2">
                                    Nenhum horário livre encontrado para esta data.</div>
                                <div v-else class="d-flex flex-wrap gap-2">
                                    <div v-for="horario in horariosLivres" :key="horario.id" class="form-check p-0">
                                        <input type="radio" class="btn-check" :id="'hora_' + horario.id"
                                            :value="horario.id" v-model="formAgendamento.horarioId" required>
                                        <label class="btn btn-outline-primary" :for="'hora_' + horario.id">{{
                                            horario.horaInicio || horario.horario }}</label>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted text-uppercase">Serviços
                                    Desejados</label>
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body p-2" style="max-height: 200px; overflow-y: auto;">
                                        <label v-for="servico in servicos" :key="servico.id"
                                            class="d-flex align-items-center mb-2 custom-checkbox-card p-3 rounded border border-light cursor-pointer w-100 m-0"
                                            :for="'srv_' + servico.id">
                                            <input class="form-check-input m-0 flex-shrink-0 cursor-pointer"
                                                type="checkbox" :value="servico.id" :id="'srv_' + servico.id"
                                                v-model="formAgendamento.servicoIds" style="transform: scale(1.3);">
                                            <div
                                                class="ms-3 d-flex justify-content-between w-100 align-items-center mt-1">
                                                <span class="fw-bold text-dark">{{ servico.nome }}</span>
                                                <span
                                                    class="text-success fw-bold bg-success bg-opacity-10 px-2 py-1 rounded">{{
                                                        formatarMoeda(servico.valor) }}</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="row align-items-center bg-white p-3 rounded-3 shadow-sm border mt-4 mx-0">
                                <div class="col-md-6 mb-3 mb-md-0">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Pagamento</label>
                                    <select v-model="formAgendamento.formaPagamento"
                                        class="form-select border-0 bg-light" required>
                                        <option value="DINHEIRO">Dinheiro (Local)</option>
                                        <option value="PIX">PIX (Local)</option>
                                        <option value="CARTAO">Cartão (Local)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 text-end">
                                    <span class="text-muted small d-block">Valor Total Estimado</span>
                                    <h3 class="fw-bold text-success mb-0">{{ formatarMoeda(valorTotalAgendamento) }}
                                    </h3>
                                </div>
                            </div>

                            <div class="mt-4 text-end">
                                <button type="button" class="btn btn-light me-2"
                                    data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-primary fw-bold px-4"
                                    :disabled="salvandoAgendamento || formAgendamento.servicoIds.length === 0 || !formAgendamento.horarioId">
                                    Confirmar Agendamento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: AVISO DE PLANO VENCIDO/SEM CRÉDITO -->
        <div class="modal fade" id="modalAvisoPlano" tabindex="-1" ref="modalAvisoPlanoRef" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-body text-center p-4" v-if="avisoPlanoStatus">
                        <div class="text-warning mb-3"><i class="bi bi-exclamation-triangle-fill display-4"></i></div>
                        <h5 class="fw-bold mb-2">
                            {{ avisoPlanoStatus.tipo === 'VENCIDO' ? 'Plano vencido' : 'Sem créditos no plano' }}
                        </h5>
                        <p class="text-muted mb-4">
                            <strong>{{ avisoPlanoStatus.cliente.nome }}</strong>
                            {{ avisoPlanoStatus.tipo === 'VENCIDO'
                                ? `está com o plano "${avisoPlanoStatus.cliente.assinatura.nomePlano}" vencido.`
                                : `não tem mais créditos disponíveis no plano "${avisoPlanoStatus.cliente.assinatura.nomePlano}".` }}
                            O que deseja fazer?
                        </p>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-outline-secondary fw-bold" @click="fecharAvisoPlanoStatus">
                                <i class="bi bi-cash-coin me-1"></i> Marcar como Avulso
                            </button>
                            <button type="button" class="btn btn-success fw-bold" @click="renovarPlanoPeloWhatsapp">
                                <i class="bi bi-whatsapp me-1"></i> Renovar Plano (WhatsApp)
                            </button>
                            <button type="button" class="btn btn-light text-danger" @click="cancelarPorPlanoStatus">
                                Cancelar Agendamento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: CONFIGURAR REGRAS DE COMISSÃO -->
        <div class="modal fade" id="modalComissoes" tabindex="-1" ref="modalComissoesRef" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title fw-bold"><i class="bi bi-gear-fill me-2"></i>Regras de Comissão</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <p class="text-muted small">Define quanto cada funcionário ganha. Serviços cobertos por um
                            plano usam o valor fixo (já que não têm cobrança cheia); os demais usam o percentual.</p>
                        <form @submit.prevent="salvarComissoes">
                            <div class="mb-3">
                                <label class="small fw-bold">% sobre Produtos</label>
                                <div class="input-group">
                                    <input type="number" step="0.01" min="0" max="100" class="form-control"
                                        v-model="formComissoes.percentualProduto">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="small fw-bold">% sobre Consumíveis/Bebidas</label>
                                <div class="input-group">
                                    <input type="number" step="0.01" min="0" max="100" class="form-control"
                                        v-model="formComissoes.percentualConsumivel">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="small fw-bold">% sobre Serviço Avulso (fora do plano)</label>
                                <div class="input-group">
                                    <input type="number" step="0.01" min="0" max="100" class="form-control"
                                        v-model="formComissoes.percentualAvulso">
                                    <span class="input-group-text">%</span>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="small fw-bold">Valor Fixo por Serviço de Plano</label>
                                <CurrencyInput v-model="formComissoes.valorFixoPlano" />
                            </div>
                            <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="salvandoComissoes">
                                <span v-if="salvandoComissoes" class="spinner-border spinner-border-sm me-2"></span>
                                Salvar Regras
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: RELATÓRIO DE BARBEIROS (COMISSÕES) -->
        <div class="modal fade" id="modalRelatorioBarbeiros" tabindex="-1" ref="modalRelatorioBarbeirosRef">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title fw-bold">
                            <i class="bi bi-person-lines-fill me-2"></i>
                            {{ barbeiroDetalhado ? barbeiroDetalhado.nomeBarbeiro : 'Relatório de Barbeiros' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">

                        <!-- LISTA DE BARBEIROS -->
                        <template v-if="!barbeiroDetalhado">
                            <div class="row g-2 mb-3">
                                <div class="col-6">
                                    <label class="small fw-bold text-muted text-uppercase">Período Inicial</label>
                                    <input type="date" class="form-control" v-model="relBarbeirosInicio">
                                </div>
                                <div class="col-6">
                                    <label class="small fw-bold text-muted text-uppercase">Período Final</label>
                                    <input type="date" class="form-control" v-model="relBarbeirosFim">
                                </div>
                            </div>
                            <button class="btn btn-primary w-100 fw-bold mb-4" @click="carregarRelatorioBarbeiros"
                                :disabled="carregandoRelatorioBarbeiros">
                                <span v-if="carregandoRelatorioBarbeiros" class="spinner-border spinner-border-sm me-2"></span>
                                Gerar Relatório
                            </button>

                            <div class="text-center py-4" v-if="carregandoRelatorioBarbeiros">
                                <div class="spinner-border text-primary" role="status"></div>
                            </div>

                            <div v-else-if="relatorioBarbeiros.length === 0" class="text-center py-4 text-muted">
                                Nenhum barbeiro encontrado.
                            </div>

                            <div v-else class="d-flex flex-column gap-2">
                                <div v-for="b in relatorioBarbeiros" :key="b.barbeiroId"
                                    class="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="mb-1 fw-bold text-primary">{{ b.nomeBarbeiro }}</h6>
                                        <div class="small text-muted">Valor Gerado: <strong class="text-dark">{{
                                            formatarMoeda(b.totalFaturamento) }}</strong></div>
                                        <div class="small text-success">Comissão: <strong>{{ formatarMoeda(b.comissaoTotal)
                                            }}</strong></div>
                                        <div class="small text-muted"><i class="bi bi-scissors me-1"></i>{{
                                            b.totalServicosRealizados }} serviços concluídos</div>
                                    </div>
                                    <button class="btn btn-sm btn-outline-primary fw-bold"
                                        @click="barbeiroDetalhado = b">
                                        <i class="bi bi-eye me-1"></i> Detalhes
                                    </button>
                                </div>
                            </div>
                        </template>

                        <!-- DETALHES DE UM BARBEIRO -->
                        <template v-else>
                            <RelatorioBarbeiroDetalhe :dados="barbeiroDetalhado" />
                            <button class="btn btn-outline-secondary w-100 fw-bold mt-2" @click="barbeiroDetalhado = null">
                                <i class="bi bi-arrow-left me-1"></i> Voltar para Lista
                            </button>
                        </template>

                    </div>
                </div>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- 👇 MODAIS DE PRODUTOS/ESTOQUE/VENDAS       -->
        <!-- ========================================== -->

        <!-- MODAL: CADASTRO DE PRODUTOS -->
        <div class="modal fade" id="modalProdutos" aria-hidden="true" data-bs-focus="false" v-if="!isSuperAdmin">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="bi bi-tags me-2"></i> Cadastro de Produtos e
                            Consumíveis</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <div class="card border-0 shadow-sm mb-4">
                            <div class="card-header bg-white border-bottom-0 pt-3">
                                <h6 class="fw-bold text-primary mb-0">Cadastrar Novo Item</h6>
                            </div>
                            <div class="card-body">
                                <form @submit.prevent="salvarProduto">
                                    <div class="row g-2 mb-3">
                                        <div class="col-md-5">
                                            <label class="form-label small text-muted fw-bold">Nome do Item</label>
                                            <input v-model="novoProduto.nome" type="text" class="form-control"
                                                placeholder="Ex: Pomada" required>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label small text-muted fw-bold">Tipo</label>
                                            <select v-model="novoProduto.tipo" class="form-select" required>
                                                <option value="PRODUTO">Produto (Venda/Stock)</option>
                                                <option value="CONSUMIVEL">Consumível (Uso Interno)</option>
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label small text-muted fw-bold">Preço de Venda</label>
                                            <CurrencyInput v-model="novoProduto.valor" required />
                                        </div>
                                    </div>

                                    <div class="bg-white p-3 rounded border mb-3">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <label class="form-label small text-muted fw-bold mb-0">Características do
                                                Item (Opcional)</label>
                                            <button type="button" class="btn btn-sm btn-outline-primary"
                                                @click="addCaracteristica">
                                                <i class="bi bi-plus"></i> Adicionar Campo
                                            </button>
                                        </div>

                                        <div v-if="novoProduto.caracteristicasLista.length === 0"
                                            class="text-center text-muted small py-2">
                                            Nenhum detalhe extra. Clique em Adicionar Campo para por Placa, Cor, Modelo,
                                            etc.
                                        </div>

                                        <div class="row g-2 mb-2"
                                            v-for="(carac, index) in novoProduto.caracteristicasLista" :key="index">
                                            <div class="col-5">
                                                <input type="text" class="form-control form-control-sm"
                                                    v-model="carac.chave" placeholder="Ex: Placa, Cor, Marca...">
                                            </div>
                                            <div class="col-6">
                                                <input type="text" class="form-control form-control-sm"
                                                    v-model="carac.valor" placeholder="Ex: ABC-1234, Preto...">
                                            </div>
                                            <div class="col-1 text-end">
                                                <button type="button" class="btn btn-sm btn-light text-danger w-100"
                                                    @click="removerCaracteristica(index)">
                                                    <i class="bi bi-x"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" class="btn btn-primary w-100 fw-bold"
                                        :disabled="salvandoProduto">
                                        <span v-if="salvandoProduto"
                                            class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="bi bi-plus-lg"></i> Guardar no Stock
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div class="card border-0 shadow-sm">
                            <div
                                class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                                <h6 class="fw-bold mb-0">Itens Cadastrados</h6>
                                <button @click="carregarProdutos" class="btn btn-sm btn-outline-secondary border-0"><i
                                        class="bi bi-arrow-clockwise"></i></button>
                            </div>

                            <div class="card-body p-0 pt-3">
                                <div class="px-3 mb-2">
                                    <ul class="nav nav-pills nav-fill bg-light p-1 rounded-3">
                                        <li class="nav-item">
                                            <button class="nav-link rounded-3 small fw-bold"
                                                :class="{ active: filtroTipoProduto === 'TODOS' }"
                                                @click="filtroTipoProduto = 'TODOS'">Todos</button>
                                        </li>
                                        <li class="nav-item">
                                            <button class="nav-link rounded-3 small fw-bold"
                                                :class="{ active: filtroTipoProduto === 'PRODUTO' }"
                                                @click="filtroTipoProduto = 'PRODUTO'">Produtos</button>
                                        </li>
                                        <li class="nav-item">
                                            <button class="nav-link rounded-3 small fw-bold"
                                                :class="{ active: filtroTipoProduto === 'CONSUMIVEL' }"
                                                @click="filtroTipoProduto = 'CONSUMIVEL'">Consumíveis</button>
                                        </li>
                                    </ul>
                                </div>

                                <div class="text-center py-4" v-if="carregandoProdutos">
                                    <div class="spinner-border text-primary" role="status"></div>
                                </div>

                                <div class="table-responsive" v-else-if="produtosFiltrados.length > 0"
                                    style="max-height: 350px; overflow-y: auto;">
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light sticky-top">
                                            <tr>
                                                <th class="border-0 px-4">Nome do Item</th>
                                                <th class="border-0">Tipo</th>
                                                <th class="border-0">Valor</th>
                                                <th class="border-0 text-end px-4">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="prod in produtosFiltrados" :key="prod.id">
                                                <td class="fw-medium text-dark px-4">
                                                    <span class="d-block">{{ prod.nome }}</span>
                                                    <div v-if="prod.caracteristicas && Object.keys(prod.caracteristicas).length > 0"
                                                        class="d-flex flex-wrap gap-1 mt-1">
                                                        <span v-for="(valor, chave) in prod.caracteristicas"
                                                            :key="chave"
                                                            class="badge bg-light text-secondary border fw-normal"
                                                            style="font-size: 0.65rem;">
                                                            {{ chave }}: <strong class="text-dark">{{ valor }}</strong>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span class="badge"
                                                        :class="prod.tipo === 'PRODUTO' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning'">
                                                        {{ prod.tipo === 'PRODUTO' ? 'Produto' : 'Consumível' }}
                                                    </span>
                                                </td>
                                                <!-- 👇 COLUNA VALOR COM CUSTOS EMBUTIDOS -->
                                                <td>
                                                    <div class="d-flex flex-column">
                                                        <span class="fw-bold text-success" title="Valor de Venda">
                                                            {{ formatarMoeda(prod.valor) }}
                                                        </span>
                                                        <span v-if="prod.despesas && prod.despesas.length > 0"
                                                            class="text-danger small fw-medium mt-1">
                                                            <i class="bi bi-arrow-down-right"></i> Custos: {{
                                                                formatarMoeda(prod.despesas.reduce((acc, d) => acc +
                                                                    Number(d.amount), 0))}}
                                                        </span>
                                                    </div>
                                                </td>
                                                <!-- 👇 COLUNA AÇÕES COM BOTÕES DE EXTRATO, CUSTO E LIXEIRA -->
                                                <td class="text-end px-4 text-nowrap">
                                                    <!-- Botão Extrato Financeiro -->
                                                    <button type="button" @click="abrirModalExtrato(prod)"
                                                        class="btn btn-sm btn-light text-dark border me-2 shadow-sm"
                                                        title="Ver Resumo Financeiro do Item">
                                                        <i class="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <!-- Botão Custo -->
                                                    <button type="button" @click="abrirModalCusto(prod)"
                                                        class="btn btn-sm btn-light text-primary border me-2 shadow-sm"
                                                        title="Adicionar Despesa/Custo a este item">
                                                        <i class="bi bi-currency-dollar"></i> Custo
                                                    </button>
                                                    <!-- Botão Lixeira -->
                                                    <button type="button" @click="deletarProduto(prod.id)"
                                                        class="btn btn-sm btn-light text-danger rounded-circle shadow-sm"
                                                        title="Excluir">
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div v-else class="text-center py-4 text-muted">
                                    <i class="bi bi-box-seam display-6 d-block mb-2 opacity-50"></i>
                                    Nenhum item encontrado nesta categoria.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: NOVA VENDA -->
        <div class="modal fade" id="modalVendaProduto" tabindex="-1" aria-hidden="true" v-if="!isSuperAdmin">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="bi bi-cart-plus me-2"></i> Lançar Venda Avulsa</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close" id="btnFecharModalVenda"></button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <form @submit.prevent="realizarVenda">
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted text-uppercase">Vendedor
                                    (Profissional)</label>
                                <select v-model="formVenda.funcionarioId" class="form-select form-select-lg" required>
                                    <option value="" disabled selected>Quem está vendendo?</option>
                                    <option v-for="membro in equipeAtiva" :key="membro.id" :value="membro.id">{{ membro.nome
                                    }}</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted text-uppercase">Item</label>
                                <select v-model="formVenda.produtoId" class="form-select form-select-lg" required>
                                    <option value="" disabled selected>O que o cliente está levando?</option>

                                    <optgroup label="📦 Produtos (Venda)">
                                        <option v-for="prod in produtos.filter(p => p.tipo === 'PRODUTO')"
                                            :key="prod.id" :value="prod.id" :disabled="prod.estoque <= 0">
                                            {{ prod.nome }} - {{ formatarMoeda(prod.valor) }} (Estoque: {{ prod.estoque
                                            }})
                                        </option>
                                    </optgroup>

                                    <optgroup label="🍺 Consumíveis (Bebidas/Outros)">
                                        <option v-for="prod in produtos.filter(p => p.tipo === 'CONSUMIVEL')"
                                            :key="prod.id" :value="prod.id" :disabled="prod.estoque <= 0">
                                            {{ prod.nome }} - {{ formatarMoeda(prod.valor) }} (Estoque: {{ prod.estoque
                                            }})
                                        </option>
                                    </optgroup>
                                </select>
                            </div>

                            <div class="row mb-4">
                                <div class="col-6">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Quantidade</label>
                                    <input v-model="formVenda.quantidade" type="number" min="1"
                                        class="form-control form-control-lg text-center" required>
                                </div>
                                <div class="col-6">
                                    <label class="form-label fw-bold small text-muted text-uppercase">Total</label>
                                    <input type="text"
                                        class="form-control form-control-lg text-center text-success fw-bold bg-white"
                                        :value="formatarMoeda(valorTotalVenda)" disabled readonly>
                                </div>
                            </div>
                            <div class="bg-white p-3 rounded-3 shadow-sm border mb-4">
                                <label class="form-label fw-bold small text-muted text-uppercase">Forma de
                                    Pagamento</label>
                                <select v-model="formVenda.formaPagamento" class="form-select border-0 bg-light"
                                    required>
                                    <option value="DINHEIRO">Dinheiro (Local)</option>
                                    <option value="PIX">PIX (Local)</option>
                                    <option value="CARTAO">Cartão (Local)</option>
                                </select>
                            </div>

                            <div class="text-end">
                                <button type="button" class="btn btn-light me-2"
                                    data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" class="btn btn-success fw-bold px-4"
                                    :disabled="salvandoVenda || !formVenda.produtoId || !formVenda.funcionarioId">
                                    <span v-if="salvandoVenda" class="spinner-border spinner-border-sm me-2"></span>
                                    Concluir Venda
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL: HISTÓRICO DE VENDAS -->
        <div class="modal fade" id="modalHistoricoVendas" tabindex="-1" aria-hidden="true" v-if="!isSuperAdmin">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white border-0">
                        <h5 class="modal-title fw-bold"><i class="bi bi-clock-history me-2"></i> Histórico de Vendas
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <div class="row mb-4 align-items-end">
                            <div class="col-md-5">
                                <label class="form-label fw-bold text-muted small text-uppercase">Período</label>
                                <div class="input-group shadow-sm">
                                    <span class="input-group-text bg-white border-end-0"><i
                                            class="bi bi-calendar3"></i></span>
                                    <input type="date" class="form-control border-start-0 ps-0"
                                        v-model="filtroInicioVendas" @change="carregarHistoricoVendas">
                                    <span class="input-group-text bg-white border-0">até</span>
                                    <input type="date" class="form-control border-start-0 ps-0"
                                        v-model="filtroFimVendas" @change="carregarHistoricoVendas">
                                    <button class="btn btn-white border-0 bg-white text-primary fw-bold"
                                        @click="resetFiltroHistorico">Hoje</button>
                                </div>
                            </div>
                            <div class="col-md-5 mt-3 mt-md-0">
                                <ul class="nav nav-pills nav-fill bg-white p-1 rounded-3 shadow-sm border">
                                    <li class="nav-item">
                                        <button class="nav-link rounded-3 small fw-bold"
                                            :class="{ active: filtroTipoHistorico === 'TODOS' }"
                                            @click="filtroTipoHistorico = 'TODOS'">Todos</button>
                                    </li>
                                    <li class="nav-item">
                                        <button class="nav-link rounded-3 small fw-bold"
                                            :class="{ active: filtroTipoHistorico === 'PRODUTO' }"
                                            @click="filtroTipoHistorico = 'PRODUTO'">Produtos</button>
                                    </li>
                                    <li class="nav-item">
                                        <button class="nav-link rounded-3 small fw-bold"
                                            :class="{ active: filtroTipoHistorico === 'CONSUMIVEL' }"
                                            @click="filtroTipoHistorico = 'CONSUMIVEL'">Consumíveis</button>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-2 text-md-end mt-3 mt-md-0">
                                <button class="btn btn-outline-secondary shadow-sm w-100"
                                    @click="carregarHistoricoVendas"><i class="bi bi-arrow-clockwise me-1"></i>
                                    Atualizar</button>
                            </div>
                        </div>

                        <div class="card border-0 shadow-sm">
                            <div class="card-body p-0">
                                <div class="text-center py-5" v-if="carregandoHistorico">
                                    <div class="spinner-border text-primary" role="status"></div>
                                </div>
                                <div class="table-responsive" v-else-if="historicoFiltrado.length > 0"
                                    style="max-height: 500px;">
                                    <table class="table table-hover align-middle mb-0">
                                        <thead class="table-light sticky-top">
                                            <tr>
                                                <th class="border-0 px-4 py-3">Data da Venda</th>
                                                <th class="border-0 py-3">Vendedor</th>
                                                <th class="border-0 py-3">Item</th>
                                                <th class="border-0 py-3 text-center">Qtd</th>
                                                <th class="border-0 py-3">Pagamento</th>
                                                <th class="border-0 text-end px-4 py-3">Valor Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="venda in historicoFiltrado" :key="venda.id">
                                                <td class="px-4 text-nowrap">
                                                    <span class="d-block fw-bold text-dark">{{
                                                        formatarDataPtBr(venda.dataVenda)
                                                    }}</span>
                                                    <small class="text-muted"><i class="bi bi-clock me-1"></i> {{ new
                                                        Date(venda.dataVenda).toLocaleTimeString('pt-BR', {
                                                            hour:
                                                                '2-digit',
                                                            minute: '2-digit'
                                                        }) }}</small>
                                                </td>
                                                <td class="text-muted">{{ venda.funcionario ? venda.funcionario.nome :
                                                    'N/A' }}
                                                </td>
                                                <td>
                                                    <span class="d-block fw-medium">{{ venda.nomeItem }}</span>
                                                    <span class="badge"
                                                        :class="venda.tipoOrigem === 'PRODUTO' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning'">
                                                        {{ venda.tipoOrigem === 'PRODUTO' ? 'Produto' : 'Consumível' }}
                                                    </span>
                                                </td>
                                                <td class="text-center fw-bold">{{ venda.quantidade }}</td>
                                                <td>
                                                    <span class="badge bg-light text-dark border">{{
                                                        venda.formaPagamento
                                                    }}</span>
                                                </td>
                                                <td class="text-end px-4">
                                                    <span class="fw-bold text-success">{{
                                                        formatarMoeda(Number(venda.valorUnitario) * venda.quantidade)
                                                    }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-else class="text-center py-5 text-muted">
                                    <i class="bi bi-receipt display-4 d-block mb-3 opacity-25"></i>
                                    <h5>Nenhuma venda encontrada.</h5>
                                    <p class="small">Tente alterar os filtros acima.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 👇 NOVO MODAL: LANÇAR CUSTO NO PRODUTO (DIRETO DO ESTOQUE) -->
        <div class="modal fade" id="modalCustoProduto" ref="modalCustoRef" tabindex="-1" aria-hidden="true"
            style="z-index: 1060;" v-show="!isSuperAdmin">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-danger text-white border-0">
                        <h6 class="modal-title fw-bold"><i class="bi bi-graph-down-arrow me-2"></i> Adicionar Custo</h6>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close" id="btnFecharModalCusto"></button>
                    </div>
                    <div class="modal-body p-4 bg-light">
                        <div
                            class="alert alert-danger bg-opacity-10 border-danger border-opacity-25 py-2 px-3 small fw-bold text-danger mb-3">
                            Item: {{ formCusto.produtoNome }}
                        </div>
                        <form @submit.prevent="salvarCustoProduto">
                            <div class="mb-3">
                                <label class="small fw-bold text-muted">O que foi gasto?</label>
                                <input type="text" class="form-control" v-model="formCusto.description"
                                    placeholder="Ex: Pintura, IPVA, Lavagem" required>
                            </div>
                            <div class="mb-4">
                                <label class="small fw-bold text-muted">Valor</label>
                                <CurrencyInput v-model="formCusto.amount" required />
                            </div>
                            <button type="submit" class="btn btn-danger w-100 fw-bold" :disabled="salvandoCusto">
                                <span v-if="salvandoCusto" class="spinner-border spinner-border-sm me-2"></span>
                                Registrar Custo
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- 👇 NOVO MODAL: RESUMO FINANCEIRO DO PRODUTO (EXTRATO) -->
        <div class="modal fade" id="modalExtratoProduto" ref="modalExtratoRef" tabindex="-1" aria-hidden="true"
            style="z-index: 1060;" v-show="!isSuperAdmin">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header bg-dark text-white border-0">
                        <h6 class="modal-title fw-bold"><i class="bi bi-receipt me-2"></i> Resumo Financeiro do Item
                        </h6>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 bg-light" v-if="produtoExtrato">

                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="fw-bold text-dark mb-0">{{ produtoExtrato.nome }}</h5>
                            <span class="badge bg-primary-subtle text-primary border border-primary-subtle">{{
                                produtoExtrato.tipo }}</span>
                        </div>

                        <!-- LISTA DE CUSTOS -->
                        <h6 class="fw-bold text-muted small text-uppercase mb-2"><i class="bi bi-list-ul"></i> Histórico
                            de Custos</h6>
                        <div class="bg-white border rounded shadow-sm mb-4"
                            style="max-height: 200px; overflow-y: auto;">
                            <table class="table table-sm table-hover mb-0 align-middle">
                                <thead class="table-light sticky-top">
                                    <tr>
                                        <th class="border-0 px-3 py-2 text-muted small">Data</th>
                                        <th class="border-0 py-2 text-muted small">Descrição</th>
                                        <th class="border-0 text-end px-3 py-2 text-muted small">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="!produtoExtrato.despesas || produtoExtrato.despesas.length === 0">
                                        <td colspan="3" class="text-center py-3 text-muted small">Nenhum custo
                                            registrado neste item.</td>
                                    </tr>
                                    <tr v-for="custo in produtoExtrato.despesas" :key="custo.id">
                                        <td class="px-3 small text-muted">{{ formatarDataPtBr(custo.date) }}</td>
                                        <td class="small fw-medium">{{ limparNomeCusto(custo.description,
                                            produtoExtrato.nome) }}</td>
                                        <td class="text-end px-3 text-danger fw-bold">- {{ formatarMoeda(custo.amount)
                                        }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- BALANÇO FINAL DO ITEM -->
                        <div class="bg-white p-3 rounded border shadow-sm font-monospace">
                            <div class="d-flex justify-content-between mb-2 pb-2 border-bottom border-dashed">
                                <span class="text-success"><i class="bi bi-plus-circle-fill me-1"></i> Preço de Venda
                                    (Receita)</span>
                                <span class="fw-bold text-success">+ {{ formatarMoeda(produtoExtrato.valor) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom border-dashed">
                                <span class="text-danger"><i class="bi bi-dash-circle-fill me-1"></i> Total de
                                    Custos</span>
                                <span class="fw-bold text-danger">- {{ formatarMoeda(totalCustosProduto) }}</span>
                            </div>
                            <div
                                class="d-flex justify-content-between align-items-center bg-light p-2 rounded border border-secondary-subtle">
                                <span class="fw-bold text-dark text-uppercase small">Lucro Líquido Real</span>
                                <span class="fw-bold fs-5"
                                    :class="balancoProduto >= 0 ? 'text-success' : 'text-danger'">
                                    {{ formatarMoeda(balancoProduto) }}
                                </span>
                            </div>
                        </div>

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
import ConfirmModal from '../components/ConfirmModal.vue';
import CurrencyInput from '../components/CurrencyInput.vue';
import RelatorioBarbeiroDetalhe from '../components/RelatorioBarbeiroDetalhe.vue';
import { ehContaAdmin } from '../utils/funcionarios.js';

const router = useRouter();
const confirmModalRef = ref(null);
const nomeEmpresa = ref('Carregando...');
const isSuperAdmin = ref(false);

const temModuloAgendamento = ref(true);
const temModuloFinanceiro = ref(false);
const temModuloProdutos = ref(false);
const temModuloVendas = ref(false);
const planoAtual = ref('');

const toastRef = ref(null);
const toastInstance = ref(null);
const toastMessage = ref('');
const toastIcon = ref('');

const equipe = ref([]);
// Só funcionários ativos podem ser escolhidos pra agendamento/venda —
// quem foi desligado continua na lista de gestão, mas some dos dropdowns.
const equipeAtiva = computed(() => equipe.value.filter(f => f.ativo));
// A conta "Admin {loja}" administra, não presta serviço nem marca horário —
// não deve aparecer como opção de profissional pra agendar.
const equipeParaAgendamento = computed(() => equipeAtiva.value.filter(f => !ehContaAdmin(f.nome)));
const carregandoEquipe = ref(false);
const salvandoFuncionario = ref(false);
const novoFuncionario = ref({ nome: '', email: '', descricao: '' });

const servicos = ref([]);
const carregandoServicos = ref(false);
const salvandoServico = ref(false);
const novoServico = ref({ nome: '', valor: '', descricao: '' });
const servicoEditandoId = ref(null);
const fotoServicoSelecionada = ref(null);
const fotoServicoPreview = ref('');

const selecionarFotoServico = (evento) => {
    const arquivo = evento.target.files?.[0] || null;
    fotoServicoSelecionada.value = arquivo;
    fotoServicoPreview.value = arquivo ? URL.createObjectURL(arquivo) : '';
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

axios.interceptors.response.use(
    (response) => {
        // Se a requisição deu certo, apenas deixa passar
        return response;
    },
    (error) => {
        // Se a requisição voltou com erro 401 (Sessão expirada, token inválido ou ausente)
        if (error.response && error.response.status === 401) {
            console.warn('Acesso negado ou sessão expirada. Redirecionando...');

            // 1. Limpamos qualquer lixo que tenha ficado nos Cookies
            Cookies.remove('access_token', { domain: '.zencut.com.br' });
            Cookies.remove('tenant_id', { domain: '.zencut.com.br' });
            Cookies.remove('access_token');
            Cookies.remove('tenant_id');

            // 2. Redireciona para o login do subdomínio atual
            window.location.href = '/login';
        }

        // Repassa o erro para o catch original poder lidar (ex: exibir o toast de erro)
        return Promise.reject(error);
    }
);

const getConfig = () => ({ headers: { 'Authorization': `Bearer ${Cookies.get('access_token')}`, 'x-tenant-id': Cookies.get('tenant_id') } });
const getHoje = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().split('T')[0]; };
const getHoraAtual = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const getLocalISODate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

const dashboard = ref({ faturamentoMes: 0, agendamentosHoje: 0, despesasPendentes: 0, novosClientes: 0 });

// --- DASHBOARD DO SUPER ADMIN (CENTRAL ZENCUT) ---
const carregandoDashboardAdmin = ref(false);
const dashboardAdmin = ref({ totalLojas: 0, lojasAtivas: 0, faturamentoMes: 0, faturasPendentes: 0 });
const lojasRecentes = ref([]);

const carregarDashboardAdmin = async () => {
    carregandoDashboardAdmin.value = true;
    try {
        const hoje = new Date();
        const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
        const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0];

        const [resTenants, resResumo] = await Promise.all([
            axios.get(`${API_URL}/adm/tenants`, getConfig()),
            axios.get(`${API_URL}/financeiro/saas/resumo`, { params: { inicio: primeiroDiaMes, fim: ultimoDiaMes }, ...getConfig() })
        ]);

        const lojas = resTenants.data || [];

        dashboardAdmin.value.totalLojas = lojas.length;
        dashboardAdmin.value.lojasAtivas = lojas.filter(l => l.ativo).length;
        dashboardAdmin.value.faturasPendentes = lojas.filter(l => {
            const ultimaFatura = l.faturasSaaS?.[0];
            return ultimaFatura && ultimaFatura.status !== 'ATIVO';
        }).length;
        dashboardAdmin.value.faturamentoMes = resResumo.data?.totais?.receitaBrutaTotal || 0;

        lojasRecentes.value = [...lojas]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar o painel administrativo.', 'danger');
    } finally {
        carregandoDashboardAdmin.value = false;
    }
};

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

const irParaHorarios = () => router.push('/horarios');
const abrirHorarios = (idDoFuncionario) => router.push(`/horarios?funcionario=${idDoFuncionario}`);
const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
const formatarDataPtBr = (isoString) => isoString ? new Date(isoString).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';

// AGENDAMENTO AVULSO
const horariosLivres = ref([]);
const carregandoHorariosLivre = ref(false);
const salvandoAgendamento = ref(false);
const formAgendamento = ref({ nomeCliente: '', funcionarioId: '', data: getHoje(), horarioId: '', servicoIds: [], formaPagamento: 'PIX' });
const valorTotalAgendamento = computed(() => servicos.value.filter(s => formAgendamento.value.servicoIds.includes(s.id)).reduce((total, s) => total + Number(s.valor), 0));

// Autocomplete de cliente cadastrado: digita nome/e-mail/telefone no MESMO campo,
// escolhe da lista se achar, e o plano ativo dele já é aplicado automaticamente.
const clienteEncontrado = ref(null);
const sugestoesCliente = ref([]);
let timeoutSugestaoCliente = null;

const buscarSugestoesCliente = () => {
    if (timeoutSugestaoCliente) clearTimeout(timeoutSugestaoCliente);
    const termo = formAgendamento.value.nomeCliente.trim();
    if (termo.length < 2) {
        sugestoesCliente.value = [];
        return;
    }
    timeoutSugestaoCliente = setTimeout(async () => {
        try {
            const response = await axios.get(`${API_URL}/clientes`, { params: { busca: termo, take: 5 }, ...getConfig() });
            sugestoesCliente.value = response.data.data || [];
        } catch (error) {
            console.error(error);
        }
    }, 350);
};

const selecionarClienteAgendamento = (cliente) => {
    clienteEncontrado.value = cliente;
    formAgendamento.value.nomeCliente = cliente.nome;
    sugestoesCliente.value = [];
    verificarStatusPlanoCliente(cliente);
};

const limparClienteEncontrado = () => {
    clienteEncontrado.value = null;
    sugestoesCliente.value = [];
    formAgendamento.value.nomeCliente = '';
};

// =========================================================================
// AVISO DE PLANO VENCIDO / SEM CRÉDITO
// =========================================================================
const whatsappLoja = ref('');
const modalAvisoPlanoRef = ref(null);
let bsModalAvisoPlano = null;
const avisoPlanoStatus = ref(null); // { tipo: 'VENCIDO' | 'SEM_CREDITO', cliente }

const verificarStatusPlanoCliente = (cliente) => {
    const assinatura = cliente.assinatura;
    if (!assinatura || !assinatura.ativo) return;

    const vencido = assinatura.dataFim && new Date(assinatura.dataFim) < new Date();
    const semCredito = !assinatura.ilimitado && assinatura.creditosRestantes <= 0;

    if (!vencido && !semCredito) return;

    avisoPlanoStatus.value = { tipo: vencido ? 'VENCIDO' : 'SEM_CREDITO', cliente };
    if (!bsModalAvisoPlano) bsModalAvisoPlano = new Modal(modalAvisoPlanoRef.value);
    bsModalAvisoPlano.show();
};

const fecharAvisoPlanoStatus = () => {
    // "Marcar como Avulso": só fecha o aviso e segue o agendamento normalmente —
    // o backend já cobra em cheio automaticamente quando o plano não cobre.
    avisoPlanoStatus.value = null;
    bsModalAvisoPlano?.hide();
};

const renovarPlanoPeloWhatsapp = () => {
    const numero = whatsappLoja.value.replace(/\D/g, '');
    if (!numero) {
        showToast('Cadastre o WhatsApp da loja em "Meu Perfil" pra usar esse atalho.', 'warning');
        return;
    }
    const nomeCliente = avisoPlanoStatus.value?.cliente?.nome || '';
    const mensagem = encodeURIComponent(`Olá! Vim renovar/assinar meu plano aqui na barbearia. Meu nome é ${nomeCliente}.`);
    window.open(`https://wa.me/55${numero}?text=${mensagem}`, '_blank');
    avisoPlanoStatus.value = null;
    bsModalAvisoPlano?.hide();
};

const cancelarPorPlanoStatus = () => {
    avisoPlanoStatus.value = null;
    bsModalAvisoPlano?.hide();
    limparClienteEncontrado();
};

// =========================================================================
// CONFIGURAR REGRAS DE COMISSÃO (mesmo modal do Financeiro → Performance Equipe)
// =========================================================================
const modalComissoesRef = ref(null);
let bsModalComissoes = null;
const formComissoes = ref({ percentualProduto: 0, percentualConsumivel: 0, percentualAvulso: 0, valorFixoPlano: 0 });
const salvandoComissoes = ref(false);

const abrirModalComissoes = async () => {
    try {
        const response = await axios.get(`${API_URL}/comissoes`, getConfig());
        formComissoes.value = {
            percentualProduto: Number(response.data.percentualProduto) || 0,
            percentualConsumivel: Number(response.data.percentualConsumivel) || 0,
            percentualAvulso: Number(response.data.percentualAvulso) || 0,
            valorFixoPlano: Number(response.data.valorFixoPlano) || 0,
        };
    } catch (error) {
        showToast('Erro ao carregar as regras de comissão.', 'danger');
    }
    if (!bsModalComissoes) bsModalComissoes = new Modal(modalComissoesRef.value);
    bsModalComissoes.show();
};

const salvarComissoes = async () => {
    salvandoComissoes.value = true;
    try {
        await axios.put(`${API_URL}/comissoes`, formComissoes.value, getConfig());
        showToast('Regras de comissão salvas!', 'success');
        bsModalComissoes.hide();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao salvar as regras.', 'danger');
    } finally {
        salvandoComissoes.value = false;
    }
};

// =========================================================================
// RELATÓRIO DE BARBEIROS — mesma função usada em "Meu Perfil" pelo próprio
// funcionário, só que aqui trazendo todos de uma vez.
// =========================================================================
const modalRelatorioBarbeirosRef = ref(null);
let bsModalRelatorioBarbeiros = null;
const relatorioBarbeiros = ref([]);
const carregandoRelatorioBarbeiros = ref(false);
const barbeiroDetalhado = ref(null);

const dataRefRelatorio = new Date();
const relBarbeirosInicio = ref(getLocalISODate(new Date(dataRefRelatorio.getFullYear(), dataRefRelatorio.getMonth(), 1)));
const relBarbeirosFim = ref(getLocalISODate(new Date(dataRefRelatorio.getFullYear(), dataRefRelatorio.getMonth() + 1, 0)));

const carregarRelatorioBarbeiros = async () => {
    carregandoRelatorioBarbeiros.value = true;
    try {
        const response = await axios.get(`${API_URL}/financeiro/equipe`, {
            params: { inicio: relBarbeirosInicio.value, fim: relBarbeirosFim.value },
            ...getConfig()
        });
        relatorioBarbeiros.value = response.data;
    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar o relatório de barbeiros.', 'danger');
    } finally {
        carregandoRelatorioBarbeiros.value = false;
    }
};

const abrirRelatorioBarbeiros = () => {
    barbeiroDetalhado.value = null;
    if (!bsModalRelatorioBarbeiros) bsModalRelatorioBarbeiros = new Modal(modalRelatorioBarbeirosRef.value);
    bsModalRelatorioBarbeiros.show();
    carregarRelatorioBarbeiros();
};

// --- PRODUTOS, ESTOQUE E VENDAS ---
const produtos = ref([]);
const carregandoProdutos = ref(false);
const salvandoProduto = ref(false);
const novoProduto = ref({
    nome: '',
    valor: '',
    estoque: 0,
    tipo: 'PRODUTO',
    caracteristicasLista: []
});

const formVenda = ref({
    produtoId: '',
    quantidade: 1,
    formaPagamento: 'PIX',
    funcionarioId: '',
});

const salvandoVenda = ref(false);
const valorTotalVenda = computed(() => {
    if (!formVenda.value.produtoId) return 0;
    const p = produtos.value.find(prod => prod.id === formVenda.value.produtoId);
    return p ? Number(p.valor) * formVenda.value.quantidade : 0;
});

const addCaracteristica = () => {
    novoProduto.value.caracteristicasLista.push({ chave: '', valor: '' });
};

const removerCaracteristica = (index) => {
    novoProduto.value.caracteristicasLista.splice(index, 1);
};

// ESTADOS PARA FILTROS E HISTÓRICO
const filtroTipoProduto = ref('TODOS');
const filtroTipoHistorico = ref('TODOS');
const historicoVendas = ref([]);
const carregandoHistorico = ref(false);
const filtroInicioVendas = ref(getHoje());
const filtroFimVendas = ref(getHoje());

const produtosFiltrados = computed(() => {
    if (filtroTipoProduto.value === 'TODOS') return produtos.value;
    return produtos.value.filter(p => p.tipo === filtroTipoProduto.value);
});

const historicoFiltrado = computed(() => {
    if (filtroTipoHistorico.value === 'TODOS') return historicoVendas.value;
    return historicoVendas.value.filter(v => v.tipoOrigem === filtroTipoHistorico.value);
});

// 👇 NOVOS ESTADOS PARA CUSTO DIRETO NO PRODUTO
const modalCustoRef = ref(null);
let bsModalCusto = null;
const salvandoCusto = ref(false);
const formCusto = ref({ produtoId: null, produtoNome: '', description: '', amount: '' });

// 👇 ESTADOS PARA O RESUMO/EXTRATO DO PRODUTO (3 PONTINHOS)
const modalExtratoRef = ref(null);
let bsModalExtrato = null;
const produtoExtrato = ref(null);

const abrirModalExtrato = (prod) => {
    // Sempre busca o objeto mais atualizado da lista (com despesas frescas do backend)
    const prodAtualizado = produtos.value.find(p => p.id === prod.id) || prod;
    produtoExtrato.value = {
        ...prodAtualizado,
        despesas: prodAtualizado.despesas ? [...prodAtualizado.despesas] : []
    };
    if (!bsModalExtrato) bsModalExtrato = new Modal(modalExtratoRef.value);
    bsModalExtrato.show();
};

const limparNomeCusto = (descricaoCompleta, nomeProduto) => {
    if (!descricaoCompleta) return '';
    return descricaoCompleta.replace(`[Custo] ${nomeProduto} - `, '');
};

const totalCustosProduto = computed(() => {
    if (!produtoExtrato.value || !produtoExtrato.value.despesas) return 0;
    return produtoExtrato.value.despesas.reduce((acc, d) => acc + Number(d.amount), 0);
});

const balancoProduto = computed(() => {
    if (!produtoExtrato.value) return 0;
    const receita = Number(produtoExtrato.value.valor);
    return receita - totalCustosProduto.value;
});

const carregarDashboard = async () => {
    if (isSuperAdmin.value) return;
    const dataAtual = new Date();
    const primeiroDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1).toISOString().split('T')[0];
    const ultimoDiaMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0).toISOString().split('T')[0];
    try {
        if (temModuloFinanceiro.value) {
            const resFin = await axios.get(`${API_URL}/financeiro/resumo`, { params: { inicio: primeiroDiaMes, fim: ultimoDiaMes }, ...getConfig() });
            dashboard.value.faturamentoMes = resFin.data.totais?.totalFinanceiro?.receitaBrutaTotal || 0;
            dashboard.value.despesasPendentes = resFin.data.totais?.custosOperacionais?.pendentes || 0;
        }
        if (temModuloAgendamento.value) {
            const resAg = await axios.get(`${API_URL}/agendamentos`, { params: { inicio: getHoje(), fim: getHoje() }, ...getConfig() });
            dashboard.value.agendamentosHoje = resAg.data.length || 0;
        }
        try {
            const resCli = await axios.get(`${API_URL}/clientes`, getConfig());
            const listaClientes = Array.isArray(resCli.data) ? resCli.data : (resCli.data?.data || []);
            const criadosEsteMes = listaClientes.filter(c => c.createdAt && c.createdAt.startsWith(primeiroDiaMes.substring(0, 7)));
            dashboard.value.novosClientes = criadosEsteMes.length || 0;
        } catch (e) { }
    } catch (error) { console.error(error); }
};

const carregarEquipe = async () => {
    if (isSuperAdmin.value) return;
    carregandoEquipe.value = true;
    try {
        const response = await axios.get(`${API_URL}/funcionarios`, getConfig());
        equipe.value = response.data;
    } catch (error) { console.error(error); } finally { carregandoEquipe.value = false; }
};

// Senha padrão de todo funcionário novo — ele troca depois em "Meu Perfil".
const SENHA_PADRAO_FUNCIONARIO = 'senhaSegura123';

const fotoFuncionarioSelecionada = ref(null);
const onSelecionarFotoFuncionario = (evento) => {
    fotoFuncionarioSelecionada.value = evento.target.files[0] || null;
};

const salvarFuncionario = async () => {
    salvandoFuncionario.value = true;
    try {
        const formData = new FormData();
        formData.append('nome', novoFuncionario.value.nome);
        formData.append('email', novoFuncionario.value.email);
        formData.append('senha', SENHA_PADRAO_FUNCIONARIO);
        formData.append('password', SENHA_PADRAO_FUNCIONARIO);
        formData.append('descricao', novoFuncionario.value.descricao || '');
        if (fotoFuncionarioSelecionada.value) {
            formData.append('foto', fotoFuncionarioSelecionada.value);
        }

        const config = getConfig();
        await axios.post(`${API_URL}/funcionarios`, formData, {
            headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
        });

        novoFuncionario.value = { nome: '', email: '', descricao: '' };
        fotoFuncionarioSelecionada.value = null;
        await carregarEquipe();
        showToast(`Criado! Login: senha padrão "${SENHA_PADRAO_FUNCIONARIO}" — ele troca em Meu Perfil.`, 'success');
    } catch (error) { showToast(error.response?.data?.message || 'Erro ao criar funcionário.', 'danger'); } finally { salvandoFuncionario.value = false; }
};

// --- Editar membro existente (nome, bio, foto) ---
const modalEditarFuncionarioRef = ref(null);
let bsModalEditarFuncionario = null;
const funcionarioEditando = ref(null);
const fotoEdicaoSelecionada = ref(null);
const fotoEdicaoPreview = ref('');
const salvandoEdicaoFuncionario = ref(false);

const abrirEdicaoFuncionario = (membro) => {
    funcionarioEditando.value = { id: membro.id, nome: membro.nome, descricao: membro.descricao || '' };
    fotoEdicaoSelecionada.value = null;
    fotoEdicaoPreview.value = membro.fotoUrl || '';
    if (!bsModalEditarFuncionario) bsModalEditarFuncionario = new Modal(modalEditarFuncionarioRef.value);
    bsModalEditarFuncionario.show();
};

const onSelecionarFotoEdicaoFuncionario = (evento) => {
    const arquivo = evento.target.files?.[0] || null;
    fotoEdicaoSelecionada.value = arquivo;
    if (arquivo) fotoEdicaoPreview.value = URL.createObjectURL(arquivo);
};

const salvarEdicaoFuncionario = async () => {
    if (!funcionarioEditando.value) return;
    salvandoEdicaoFuncionario.value = true;
    try {
        const formData = new FormData();
        formData.append('nome', funcionarioEditando.value.nome);
        formData.append('descricao', funcionarioEditando.value.descricao || '');
        if (fotoEdicaoSelecionada.value) formData.append('foto', fotoEdicaoSelecionada.value);

        const config = getConfig();
        await axios.patch(`${API_URL}/funcionarios/${funcionarioEditando.value.id}`, formData, {
            headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
        });

        showToast('Membro da equipe atualizado!', 'success');
        bsModalEditarFuncionario.hide();
        await carregarEquipe();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao salvar as alterações.', 'danger');
    } finally {
        salvandoEdicaoFuncionario.value = false;
    }
};

const alternarStatusFuncionario = async (membro, ativo) => {
    const acao = ativo ? 'reativar' : 'desligar';
    const ok = await confirmModalRef.value.confirmar(`Tem certeza que deseja ${acao} ${membro.nome}?`, {
        titulo: ativo ? 'Reativar funcionário' : 'Desligar funcionário',
        variante: ativo ? 'primary' : 'danger',
        textoConfirmar: ativo ? 'Reativar' : 'Desligar'
    });
    if (!ok) return;
    try {
        await axios.patch(`${API_URL}/funcionarios/${membro.id}/status`, { ativo }, getConfig());
        showToast(`${membro.nome} foi ${ativo ? 'reativado' : 'desligado'} com sucesso.`, 'success');
        await carregarEquipe();
    } catch (error) {
        showToast(error.response?.data?.message || `Erro ao ${acao} o funcionário.`, 'danger');
    }
};

const excluirFuncionario = async (membro) => {
    const ok = await confirmModalRef.value.confirmar(
        `Excluir ${membro.nome} definitivamente? Essa ação não pode ser desfeita.`,
        { titulo: 'Excluir funcionário', textoConfirmar: 'Excluir' }
    );
    if (!ok) return;
    try {
        await axios.delete(`${API_URL}/funcionarios/${membro.id}`, getConfig());
        showToast(`${membro.nome} foi excluído.`, 'success');
        await carregarEquipe();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao excluir o funcionário.', 'danger');
    }
};

const carregarServicos = async () => {
    if (isSuperAdmin.value) return;
    carregandoServicos.value = true;
    try {
        const response = await axios.get(`${API_URL}/servicos`, getConfig());
        servicos.value = response.data;
    } catch (error) { console.error(error); } finally { carregandoServicos.value = false; }
};

const salvarServico = async () => {
    salvandoServico.value = true;
    try {
        const formData = new FormData();
        formData.append('nome', novoServico.value.nome);
        formData.append('valor', Number(novoServico.value.valor));
        formData.append('descricao', novoServico.value.descricao || '');
        if (fotoServicoSelecionada.value) formData.append('foto', fotoServicoSelecionada.value);

        const config = getConfig();
        const httpConfig = { headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } };

        if (servicoEditandoId.value) {
            await axios.put(`${API_URL}/servicos/${servicoEditandoId.value}`, formData, httpConfig);
            showToast('Serviço atualizado com sucesso!', 'success');
        } else {
            await axios.post(`${API_URL}/servicos`, formData, httpConfig);
            showToast('Serviço adicionado com sucesso!', 'success');
        }

        cancelarEdicaoServico();
        await carregarServicos();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao salvar o serviço.', 'danger');
    } finally {
        salvandoServico.value = false;
    }
};

const iniciarEdicaoServico = (servico) => {
    servicoEditandoId.value = servico.id;
    novoServico.value = { nome: servico.nome, valor: servico.valor, descricao: servico.descricao || '' };
    fotoServicoSelecionada.value = null;
    fotoServicoPreview.value = servico.fotoUrl || '';
};

const cancelarEdicaoServico = () => {
    servicoEditandoId.value = null;
    novoServico.value = { nome: '', valor: '', descricao: '' };
    fotoServicoSelecionada.value = null;
    fotoServicoPreview.value = '';
};

const deletarServico = async (id) => {
    const ok = await confirmModalRef.value.confirmar('Deseja realmente excluir este serviço da barbearia?', { titulo: 'Excluir serviço', textoConfirmar: 'Excluir' });
    if (!ok) return;
    try {
        await axios.delete(`${API_URL}/servicos/${id}`, getConfig());
        await carregarServicos(); showToast('Serviço removido com sucesso.', 'success');
    } catch (error) { showToast('Erro ao deletar serviço.', 'danger'); }
};

const buscarHorariosLivres = async () => {
    if (!formAgendamento.value.funcionarioId || !formAgendamento.value.data) return;
    carregandoHorariosLivre.value = true; formAgendamento.value.horarioId = '';
    try {
        const response = await axios.get(`${API_URL}/funcionarios/${formAgendamento.value.funcionarioId}/horarios`, { params: { inicio: formAgendamento.value.data, fim: formAgendamento.value.data }, ...getConfig() });
        const ehHoje = formAgendamento.value.data === getHoje();
        const horaAtual = getHoraAtual();
        horariosLivres.value = (response.data.horarios || [])
            .filter(h => h.disponivel === true)
            .filter(h => !ehHoje || (h.horaInicio || h.horario) > horaAtual);
    } catch (error) { showToast('Erro ao carregar horários livres.', 'danger'); } finally { carregandoHorariosLivre.value = false; }
};

const salvarAgendamento = async () => {
    salvandoAgendamento.value = true;
    try {
        await axios.post(`${API_URL}/agendamentos`, {
            ...(clienteEncontrado.value ? { clienteId: clienteEncontrado.value.id } : { nomeClienteAvulso: formAgendamento.value.nomeCliente }),
            funcionarioId: formAgendamento.value.funcionarioId,
            horarioId: formAgendamento.value.horarioId,
            servicoIds: formAgendamento.value.servicoIds,
            formaPagamento: formAgendamento.value.formaPagamento
        }, getConfig());
        showToast('Agendamento realizado com sucesso!', 'success');
        formAgendamento.value = { nomeCliente: '', funcionarioId: '', data: getHoje(), horarioId: '', servicoIds: [], formaPagamento: 'PIX' };
        limparClienteEncontrado();
        horariosLivres.value = []; document.getElementById('btnFecharModalAgendamento').click();
        carregarDashboard();
    } catch (error) { showToast(error.response?.data?.message || 'Erro ao criar agendamento.', 'danger'); } finally { salvandoAgendamento.value = false; }
};

const carregarProdutos = async () => {
    if (isSuperAdmin.value) return;
    carregandoProdutos.value = true;
    try {
        const response = await axios.get(`${API_URL}/produtos`, getConfig());
        produtos.value = response.data;
    } catch (error) { console.error(error); } finally { carregandoProdutos.value = false; }
};

const salvarProduto = async () => {
    salvandoProduto.value = true;
    try {
        const objCaracteristicas = {};
        novoProduto.value.caracteristicasLista.forEach(item => {
            if (item.chave.trim() !== '') {
                objCaracteristicas[item.chave] = item.valor;
            }
        });

        await axios.post(`${API_URL}/produtos`, {
            nome: novoProduto.value.nome,
            valor: Number(novoProduto.value.valor),
            tipo: novoProduto.value.tipo,
            estoque: 0,
            caracteristicas: objCaracteristicas
        }, getConfig());

        novoProduto.value = { nome: '', valor: '', estoque: 0, tipo: 'PRODUTO', caracteristicasLista: [] };
        await carregarProdutos();
        showToast('Item adicionado ao catálogo!', 'success');
    } catch (error) { showToast('Erro ao cadastrar item.', 'danger'); }
    finally { salvandoProduto.value = false; }
};

const deletarProduto = async (id) => {
    const ok = await confirmModalRef.value.confirmar('Excluir este item do catálogo?', { titulo: 'Excluir item', textoConfirmar: 'Excluir' });
    if (!ok) return;
    try {
        await axios.delete(`${API_URL}/produtos/${id}`, getConfig());
        await carregarProdutos();
        showToast('Item removido com sucesso.', 'success');
    } catch (error) { showToast('Erro ao excluir item.', 'danger'); }
};

const abrirModalCusto = (produto) => {
    formCusto.value = {
        produtoId: produto.id,
        produtoNome: produto.nome,
        description: '',
        amount: ''
    };
    // Sempre recria a instância para garantir foco correto nos inputs
    bsModalCusto = new Modal(modalCustoRef.value);
    bsModalCusto.show();
};

const salvarCustoProduto = async () => {
    salvandoCusto.value = true;
    try {
        await axios.post(`${API_URL}/financeiro/despesas/variavel`, {
            produtoId: formCusto.value.produtoId, // <--- Este campo é obrigatório agora
            description: `[Custo] ${formCusto.value.produtoNome} - ${formCusto.value.description}`,
            amount: Number(formCusto.value.amount),
            date: getLocalISODate(new Date()),
            isPaid: true
        }, getConfig());

        showToast('Custo registrado!', 'success');
        document.getElementById('btnFecharModalCusto').click();

        // RECARREGA A LISTA DE PRODUTOS PARA ATUALIZAR OS CUSTOS NA TELA
        await carregarProdutos();

    } catch (error) {
        console.error(error);
        showToast('Erro ao salvar custo.', 'danger');
    } finally {
        salvandoCusto.value = false;
    }
};


const realizarVenda = async () => {
    salvandoVenda.value = true;
    try {
        const produtoSelecionado = produtos.value.find(p => p.id === formVenda.value.produtoId);
        await axios.post(`${API_URL}/produtos/venda`, {
            produtoId: produtoSelecionado.id,
            funcionarioId: formVenda.value.funcionarioId,
            nomeItem: produtoSelecionado.nome,
            tipoOrigem: produtoSelecionado.tipo,
            quantidade: formVenda.value.quantidade,
            valorUnitario: produtoSelecionado.valor,
            formaPagamento: formVenda.value.formaPagamento,
        }, getConfig());

        showToast('Venda realizada e contabilizada com sucesso!', 'success');
        formVenda.value = { produtoId: '', quantidade: 1, formaPagamento: 'PIX', funcionarioId: '' };
        document.getElementById('btnFecharModalVenda').click();

        await carregarProdutos();
        await carregarDashboard();
        await carregarHistoricoVendas();
    } catch (error) { showToast('Erro ao processar venda no caixa.', 'danger'); }
    finally { salvandoVenda.value = false; }
};

const carregarHistoricoVendas = async () => {
    if (isSuperAdmin.value) return;
    carregandoHistorico.value = true;
    try {
        const config = getConfig();
        config.params = { inicio: filtroInicioVendas.value, fim: filtroFimVendas.value };
        const response = await axios.get(`${API_URL}/produtos/item-venda`, config);
        historicoVendas.value = response.data;
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        showToast('Erro ao carregar histórico de vendas.', 'danger');
    } finally {
        carregandoHistorico.value = false;
    }
};

const resetFiltroHistorico = () => {
    filtroInicioVendas.value = getHoje();
    filtroFimVendas.value = getHoje();
    carregarHistoricoVendas();
};

onMounted(async () => {
    // Descobre se é o Dono da Plataforma de verdade (flag no banco, não o subdomínio)
    // Mesma regra usada no MainLayout, pra sidebar e conteúdo baterem sempre.
    try {
        const response = await axios.get(`${API_URL}/funcionarios/me`, getConfig());
        isSuperAdmin.value = response.data.isPlatformOwner === true;
    } catch (error) {
        console.error("Erro ao verificar permissões do usuário:", error);
        isSuperAdmin.value = false;
    }

    if (isSuperAdmin.value) {
        nomeEmpresa.value = 'ZenCut Cloud';
        carregarDashboardAdmin();
    }

    // Lógica exclusiva do Painel do Cliente/Loja
    if (!isSuperAdmin.value) {
        if (toastRef.value) toastInstance.value = new Toast(toastRef.value);

        // 👇 NOVA LÓGICA: Busca as permissões direto do banco de dados (API)
        try {
            const tenantId = Cookies.get('tenant_id');
            if (tenantId) {
                const response = await axios.get(`${API_URL}/tenants/${tenantId}/plano`, getConfig());

                // Mapeia exatamente as chaves que retornam do seu backend NestJS
                nomeEmpresa.value = response.data.nomeNegocio || 'Meu Negócio';
                temModuloAgendamento.value = response.data.moduloAgendamento === true;
                temModuloFinanceiro.value = response.data.moduloFinanceiro === true;
                temModuloProdutos.value = response.data.moduloProdutos === true;
                temModuloVendas.value = response.data.moduloVendas === true;
                planoAtual.value = response.data.planoSaaS || 'BÁSICO';
                whatsappLoja.value = response.data.whatsapp || '';
            }
        } catch (error) {
            console.error("Erro ao buscar as permissões dos módulos do cliente:", error);
            showToast("Não foi possível verificar as permissões do seu plano.", "danger");
        }

        // Carrega os dados operacionais após definir o que está liberado
        carregarEquipe();
        carregarServicos();
        carregarProdutos();
        carregarDashboard();
    }
});
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.custom-checkbox-card:hover {
    background-color: #f8f9fa;
    border-color: #dee2e6 !important;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>