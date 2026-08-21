<template>
    <div class="dashboard-container fade-in">

        <header class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
            <div>
                <h2 class="fw-bold text-dark mb-1">
                    <i class="bi text-primary me-2" :class="isSuperAdmin ? 'bi-clouds-fill' : 'bi-wallet2'"></i>
                    {{ labels.titulo }}
                </h2>
                <p class="text-muted mb-0">{{ labels.subtitulo }}</p>

                <div v-if="isEspectador" class="badge bg-warning text-dark mt-2 border border-warning-subtle shadow-sm">
                    <i class="bi bi-eye-fill me-1"></i> Modo Espectador (Somente Leitura)
                </div>
            </div>

            <div class="d-flex gap-2 w-100 w-md-auto flex-wrap justify-content-end">
                <div class="input-group shadow-sm position-relative" style="max-width: 320px;">
                    <span class="input-group-text bg-white border-end-0"><i class="bi bi-calendar3"></i></span>
                    <input type="date" class="form-control border-start-0 ps-0" v-model="dataInicio">
                    <span class="input-group-text bg-white border-0">até</span>
                    <input type="date" class="form-control border-start-0 ps-0" v-model="dataFim">

                    <div v-if="carregando" class="position-absolute end-0 top-50 translate-middle-y me-2 text-primary">
                        <div class="spinner-border spinner-border-sm" role="status"></div>
                    </div>
                </div>

                <button
                    class="btn btn-outline-success shadow-sm fw-bold px-3 d-none d-md-inline-flex align-items-center"
                    @click="gerarExcel" :disabled="!dadosRelatorio || carregando" title="Baixar Planilha">
                    <i class="bi bi-file-earmark-excel-fill me-1"></i> Excel
                </button>

                <button class="btn btn-success shadow-sm d-flex align-items-center gap-2 fw-bold px-4"
                    @click="abrirModalCriacao" :disabled="isEspectador">
                    <i class="bi bi-plus-lg"></i> <span class="d-none d-md-inline">{{ labels.btnNovoLancamento }}</span>
                </button>
            </div>
        </header>

        <div v-if="dadosRelatorio" class="animate-up">

            <div class="row g-4 mb-5">
                <div class="col-md-6 col-xl-3">
                    <div class="stat-card bg-white p-4 rounded-4 shadow-sm h-100 border-start border-4 border-primary">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p class="text-uppercase text-muted fw-bold small mb-2">{{ labels.cardReceita }}</p>
                                <h3 class="fw-bold text-dark mb-0">{{ formatarValor(totais.receita) }}</h3>
                            </div>
                            <div class="icon-box bg-primary-subtle text-primary rounded-circle">
                                <i class="bi fs-4" :class="isSuperAdmin ? 'bi-cash-stack' : 'bi-graph-up-arrow'"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-xl-3">
                    <div class="stat-card bg-white p-4 rounded-4 shadow-sm h-100 border-start border-4"
                        :class="isSuperAdmin ? 'border-info' : 'border-warning'">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p class="text-uppercase text-muted fw-bold small mb-2">{{ labels.cardSecundario }}</p>
                                <h3 class="fw-bold text-dark mb-0">{{ formatarValor(totais.secundario) }}</h3>
                            </div>
                            <div class="icon-box rounded-circle"
                                :class="isSuperAdmin ? 'bg-info-subtle text-info' : 'bg-warning-subtle text-warning'">
                                <i class="bi fs-4" :class="isSuperAdmin ? 'bi-arrow-repeat' : 'bi-people-fill'"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-xl-3">
                    <div class="stat-card bg-white p-4 rounded-4 shadow-sm h-100 border-start border-4 border-danger">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <p class="text-uppercase text-muted fw-bold small mb-2">{{ labels.cardDespesa }}</p>
                                <h3 class="fw-bold text-dark mb-0">{{ formatarValor(totais.despesas) }}</h3>
                            </div>
                            <div class="icon-box bg-danger-subtle text-danger rounded-circle">
                                <i class="bi fs-4" :class="isSuperAdmin ? 'bi-server' : 'bi-lightning-charge-fill'"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-xl-3">
                    <div
                        class="stat-card bg-success text-white p-4 rounded-4 shadow h-100 position-relative overflow-hidden">
                        <div class="d-flex align-items-center justify-content-between position-relative z-1">
                            <div>
                                <p class="text-uppercase text-white-50 fw-bold small mb-2">{{ labels.cardLucro }}</p>
                                <h2 class="fw-bold mb-0">{{ formatarValor(totais.lucro) }}</h2>
                            </div>
                            <i class="bi display-4 opacity-25"
                                :class="isSuperAdmin ? 'bi-graph-up' : 'bi-cash-stack'"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-5">

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
                            <ul class="nav nav-pills nav-fill bg-light p-1 rounded-3" role="tablist">
                                <li class="nav-item">
                                    <button class="nav-link active rounded-3 small fw-bold" data-bs-toggle="pill"
                                        data-bs-target="#tab-resumo">
                                        <i class="bi bi-file-text me-1"></i>Resumo
                                    </button>
                                </li>
                                <li class="nav-item" v-if="!isSuperAdmin">
                                    <button class="nav-link rounded-3 small fw-bold" data-bs-toggle="pill"
                                        data-bs-target="#tab-detalhes">
                                        <i class="bi bi-list-ul me-1"></i>Detalhes
                                    </button>
                                </li>
                                <li class="nav-item" v-if="isSuperAdmin">
                                    <button class="nav-link rounded-3 small fw-bold" data-bs-toggle="pill"
                                        data-bs-target="#tab-planos-saas">
                                        <i class="bi bi-layers me-1"></i>Planos
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button class="nav-link rounded-3 small fw-bold" data-bs-toggle="pill"
                                        data-bs-target="#tab-secundaria">
                                        <i class="bi me-1" :class="isSuperAdmin ? 'bi-buildings' : 'bi-people'"></i>{{
                                            labels.tabSecundaria }}
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div class="card-body p-4">
                            <div class="tab-content">
                                <div class="tab-pane fade show active" id="tab-resumo">
                                    <h5 class="fw-bold mb-4 text-dark">Demonstrativo Líquido</h5>
                                    <div class="finance-flow">
                                        <div class="d-flex justify-content-between mb-3 align-items-center">
                                            <span class="text-muted">
                                                <div class="dot bg-success"></div> Entrada Bruta
                                            </span>
                                            <span class="fw-bold text-dark">{{ formatarValor(totais.receita) }}</span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2 text-danger small">
                                            <span class="ps-3">{{ labels.cardDespesa }} (Pagas)</span>
                                            <span>- {{ formatarValor(totais.despesas) }}</span>
                                        </div>
                                        <hr class="my-4">
                                        <div
                                            class="bg-success bg-opacity-10 p-3 rounded-3 d-flex justify-content-between align-items-center">
                                            <span class="fw-bold text-success text-uppercase small">Resultado
                                                Líquido</span>
                                            <span class="fw-bolder fs-4 text-success">{{ formatarValor(totais.lucro)
                                            }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="tab-pane fade" id="tab-detalhes" v-if="!isSuperAdmin">
                                    <h5 class="fw-bold mb-3 text-dark">Origem da Receita</h5>
                                    <div class="list-group list-group-flush rounded-3 mb-4">
                                        <div
                                            class="list-group-item d-flex justify-content-between px-0 py-3 border-bottom">
                                            <span class="fw-bold text-dark small text-uppercase">Total</span>
                                            <span class="fw-bold text-primary">{{ formatarValor(totais.receita)
                                            }}</span>
                                        </div>
                                        <div
                                            class="list-group-item d-flex justify-content-between px-0 py-3 border-bottom">
                                            <span>Serviços Sistema</span>
                                            <span class="text-dark">{{ formatarValor(kpisDetalhados.avulsos) }}</span>
                                        </div>
                                        <div
                                            class="list-group-item d-flex justify-content-between px-0 py-3 border-bottom">
                                            <span>Planos de Assinatura</span>
                                            <span class="text-dark">{{ formatarValor(kpisDetalhados.planos) }}</span>
                                        </div>
                                        <div
                                            class="list-group-item d-flex justify-content-between px-0 py-3 border-bottom">
                                            <span>Lançamentos Manuais</span>
                                            <span class="text-success fw-bold">+ {{
                                                formatarValor(kpisDetalhados.manuais) }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="tab-pane fade" id="tab-secundaria">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <h5 class="fw-bold mb-0 text-dark">{{ labels.tabSecundaria }}</h5>
                                        <button v-if="!isSuperAdmin" class="btn btn-sm btn-outline-primary fw-bold"
                                            @click="abrirModalComissoes">
                                            <i class="bi bi-gear-fill me-1"></i> Configurar Comissões
                                        </button>
                                    </div>
                                    <div class="d-flex flex-column gap-2" style="max-height: 400px; overflow-y: auto;">
                                        <div v-if="!isSuperAdmin" v-for="barbeiro in listasSecundarias.barbeiros"
                                            :key="barbeiro.id" role="button"
                                            class="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center cursor-pointer"
                                            @click="abrirRelatorioIndividual(barbeiro)">
                                            <div>
                                                <h6 class="mb-1 fw-bold text-dark">{{ barbeiro.nome }}</h6>
                                                <span class="badge bg-primary-subtle text-primary border">{{
                                                    barbeiro.total }} serviços</span>
                                            </div>
                                            <div class="text-end">
                                                <small class="text-muted d-block">Comissão</small>
                                                <span class="fw-bold text-success">{{ formatarValor(barbeiro.comissao)
                                                    }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-header bg-white border-bottom-0 pt-4 px-4">
                            <ul class="nav nav-tabs card-header-tabs nav-justified" role="tablist">
                                <li class="nav-item">
                                    <button class="nav-link active" data-bs-toggle="tab"
                                        data-bs-target="#tab-historico-despesas">Despesas</button>
                                </li>
                                <li class="nav-item" v-if="!isSuperAdmin">
                                    <button class="nav-link text-success fw-bold" data-bs-toggle="tab"
                                        data-bs-target="#tab-historico-entradas">Entradas</button>
                                </li>
                            </ul>
                        </div>

                        <div class="card-body p-4">
                            <div class="tab-content">

                                <div class="tab-pane fade show active" id="tab-historico-despesas">
                                    <div class="table-responsive" v-if="listaDespesas.length > 0"
                                        style="max-height: 400px; overflow-y: auto;">
                                        <table class="table table-hover align-middle mb-0">
                                            <thead class="bg-light sticky-top">
                                                <tr>
                                                    <th class="text-center" style="width: 50px">Pago</th>
                                                    <th>Data</th>
                                                    <th>Descrição</th>
                                                    <th class="text-end">Valor</th>
                                                    <th class="text-center">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="despesa in listaDespesas" :key="despesa.id"
                                                    :class="{ 'opacity-75': !despesa.isPaid }">
                                                    <td class="text-center">
                                                        <input class="form-check-input" type="checkbox"
                                                            :checked="despesa.isPaid"
                                                            @change="alternarPagamento(despesa, 'DESPESA')"
                                                            :disabled="isEspectador"
                                                            style="cursor: pointer; transform: scale(1.2);">
                                                    </td>
                                                    <td class="small">{{ formatarData(despesa.date) }}</td>
                                                    <td
                                                        :class="{ 'text-decoration-line-through text-muted': despesa.isPaid }">
                                                        {{ despesa.description }}
                                                        <span v-if="despesa.type === 'FIXED'"
                                                            class="badge bg-secondary-subtle text-secondary border ms-1"
                                                            title="Despesa fixa recorrente">Fixa</span>
                                                    </td>
                                                    <td class="text-end fw-bold text-danger">- {{
                                                        formatarValor(despesa.amount) }}</td>
                                                    <td class="text-center">
                                                        <button class="btn btn-sm text-primary me-2"
                                                            @click="abrirModalEdicao(despesa, 'DESPESA')"
                                                            :disabled="isEspectador"><i
                                                                class="bi bi-pencil-square"></i></button>
                                                        <button class="btn btn-sm text-danger"
                                                            @click="prepararDelecao(despesa.id, 'DESPESA', despesa.type === 'FIXED')"
                                                            :disabled="isEspectador"><i
                                                                class="bi bi-trash"></i></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div v-else class="text-center py-4 text-muted">Nenhuma despesa neste período.</div>
                                </div>

                                <div class="tab-pane fade" id="tab-historico-entradas" v-if="!isSuperAdmin">
                                    <div class="table-responsive" v-if="listaEntradas.length > 0"
                                        style="max-height: 400px; overflow-y: auto;">
                                        <table class="table table-hover align-middle mb-0">
                                            <thead class="bg-light sticky-top">
                                                <tr>
                                                    <th class="text-center" style="width: 50px">Recebido</th>
                                                    <th>Data</th>
                                                    <th>Descrição</th>
                                                    <th class="text-end">Valor</th>
                                                    <th class="text-center">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="entrada in listaEntradas" :key="entrada.id"
                                                    :class="{ 'opacity-75': !entrada.isPaid }">
                                                    <td class="text-center">
                                                        <input class="form-check-input bg-success border-success"
                                                            type="checkbox" :checked="entrada.isPaid"
                                                            @change="alternarPagamento(entrada, 'ENTRADA')"
                                                            :disabled="isEspectador"
                                                            style="cursor: pointer; transform: scale(1.2);">
                                                    </td>
                                                    <td class="small">{{ formatarData(entrada.date) }}</td>
                                                    <td
                                                        :class="{ 'text-decoration-line-through text-muted': entrada.isPaid }">
                                                        {{ entrada.description }}</td>
                                                    <td class="text-end fw-bold text-success">+ {{
                                                        formatarValor(entrada.amount) }}</td>
                                                    <td class="text-center">
                                                        <button class="btn btn-sm text-primary me-2"
                                                            @click="abrirModalEdicao(entrada, 'ENTRADA')"
                                                            :disabled="isEspectador"><i
                                                                class="bi bi-pencil-square"></i></button>
                                                        <button class="btn btn-sm text-danger"
                                                            @click="prepararDelecao(entrada.id, 'ENTRADA')"
                                                            :disabled="isEspectador"><i
                                                                class="bi bi-trash"></i></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div v-else class="text-center py-4 text-muted">Nenhuma entrada manual neste
                                        período.</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ========================= GRÁFICOS ========================= -->
            <div class="row g-4 mb-5" v-if="!isSuperAdmin">
                <div class="col-12">
                    <h5 class="fw-bold text-dark mb-0">Gráficos</h5>
                    <p class="text-muted small mb-0">Últimos {{ mesesGrafico }} meses.</p>
                </div>

                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            <h6 class="fw-bold text-dark mb-1"><i class="bi bi-graph-up-arrow text-primary me-2"></i>Faturamento mensal</h6>
                            <p class="text-muted small mb-4">Receita total (serviços, produtos, planos e entradas) por mês.</p>
                            <div v-if="carregandoGraficos" class="text-center py-5">
                                <div class="spinner-border spinner-border-sm text-primary"></div>
                            </div>
                            <MonthlyBarChart v-else :dados="dadosFaturamentoMensal" :cor="corGraficoPrimario"
                                :formatar-valor="formatarValorCompacto" />
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            <h6 class="fw-bold text-dark mb-1"><i class="bi bi-scissors text-warning me-2"></i>Serviços mais usados</h6>
                            <p class="text-muted small mb-4">Quantidade de vezes que cada serviço foi realizado no período.</p>
                            <div v-if="carregandoGraficos" class="text-center py-5">
                                <div class="spinner-border spinner-border-sm text-primary"></div>
                            </div>
                            <RankedBarChart v-else :dados="graficos?.servicosMaisUsados || []" :cor="corGraficoSecundario" />
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            <h6 class="fw-bold text-dark mb-1"><i class="bi bi-award text-success me-2"></i>Crescimento de assinaturas</h6>
                            <p class="text-muted small mb-4">Novas assinaturas e renovações de planos por mês.</p>
                            <div v-if="carregandoGraficos" class="text-center py-5">
                                <div class="spinner-border spinner-border-sm text-primary"></div>
                            </div>
                            <MonthlyBarChart v-else :dados="dadosCrescimentoPlanos" cor="#16A34A" />
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100">
                        <div class="card-body p-4">
                            <h6 class="fw-bold text-dark mb-1"><i class="bi bi-people-fill text-info me-2"></i>Novos clientes</h6>
                            <p class="text-muted small mb-4">Clientes cadastrados por mês.</p>
                            <div v-if="carregandoGraficos" class="text-center py-5">
                                <div class="spinner-border spinner-border-sm text-primary"></div>
                            </div>
                            <MonthlyBarChart v-else :dados="dadosCrescimentoClientes" cor="#0EA5E9" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalLancamento" tabindex="-1" ref="modalLancamentoRef" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header text-white"
                        :class="modoEdicao ? 'bg-warning' : (form.tipo === 'ENTRADA' ? 'bg-success' : 'bg-danger')">
                        <h5 class="modal-title fw-bold">
                            <i class="bi" :class="modoEdicao ? 'bi-pencil-square' : 'bi-plus-circle'"></i>
                            {{ modoEdicao ? 'Editar Lançamento' : 'Novo Lançamento' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="salvarLancamento">

                            <!-- Escolha do Tipo -->
                            <div class="mb-4" v-if="!modoEdicao && !isSuperAdmin">
                                <label class="d-block mb-2 fw-bold">Tipo de Movimentação</label>
                                <div class="btn-group w-100" role="group">
                                    <input type="radio" class="btn-check" id="btnradio1" value="ENTRADA"
                                        v-model="form.tipo">
                                    <label class="btn btn-outline-success fw-bold" for="btnradio1">Receita
                                        (Entrada)</label>

                                    <input type="radio" class="btn-check" id="btnradio2" value="DESPESA"
                                        v-model="form.tipo">
                                    <label class="btn btn-outline-danger fw-bold" for="btnradio2">Custo (Saída)</label>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label>Descrição</label>
                                <input type="text" class="form-control" v-model="form.description" required>
                            </div>
                            <div class="row mb-3">
                                <div class="col-6">
                                    <label>Valor</label>
                                    <CurrencyInput v-model="form.amount" required />
                                </div>
                                <div class="col-6">
                                    <label>Data</label>
                                    <input type="date" class="form-control" v-model="form.date" required>
                                </div>
                            </div>

                            <div class="form-check mb-3" v-if="form.tipo === 'DESPESA' && !modoEdicao">
                                <input class="form-check-input" type="checkbox" id="modalFixa" v-model="form.isFixed">
                                <label class="form-check-label" for="modalFixa">
                                    É uma despesa fixa (repete todo mês, ex: aluguel)
                                </label>
                                <div class="form-text" v-if="form.isFixed">
                                    Vamos lançar automaticamente essa mesma despesa todo mês, sempre no dia {{
                                    form.date ? new Date(form.date + 'T12:00:00').getDate() : '—' }}, a partir de
                                    {{ form.date ? formatarData(form.date) : 'hoje' }}. Se um dia você excluir um dos
                                    lançamentos gerados, os meses anteriores continuam intactos e só os meses
                                    seguintes (a partir daquele) são removidos.
                                </div>
                            </div>

                            <div class="form-check mb-4">
                                <input class="form-check-input" type="checkbox" id="modalPago" v-model="form.isPaid">
                                <label class="form-check-label" for="modalPago">
                                    {{ form.tipo === 'ENTRADA' ? 'O valor já foi recebido?' : 'Essa conta já está paga?'
                                    }}
                                </label>
                            </div>

                            <button type="submit" class="btn w-100 fw-bold text-white"
                                :class="modoEdicao ? 'btn-warning' : (form.tipo === 'ENTRADA' ? 'btn-success' : 'btn-danger')"
                                :disabled="salvandoLancamento">
                                <span v-if="salvandoLancamento" class="spinner-border spinner-border-sm me-2"></span>
                                Salvar Lançamento
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalRelatorioIndividual" tabindex="-1" ref="modalRelatorioIndividualRef">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title fw-bold" v-if="barbeiroSelecionado">
                            <i class="bi bi-person-badge me-2"></i>{{ barbeiroSelecionado.nome }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4" v-if="barbeiroSelecionado">
                        <p class="text-muted small mb-3">Período: {{ dataInicio }} até {{ dataFim }} — os mesmos
                            números que ele vê em "Meu Perfil → Meu Financeiro".</p>
                        <div class="row g-3">
                            <div class="col-6">
                                <div class="p-3 bg-light rounded-3 border text-center">
                                    <small class="text-muted d-block text-uppercase fw-bold">Serviços</small>
                                    <h4 class="fw-bold mb-0">{{ barbeiroSelecionado.total }}</h4>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-3 bg-light rounded-3 border text-center">
                                    <small class="text-muted d-block text-uppercase fw-bold">Faturamento</small>
                                    <h4 class="fw-bold mb-0">{{ formatarValor(barbeiroSelecionado.faturamento) }}</h4>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-3 bg-light rounded-3 border text-center">
                                    <small class="text-muted d-block text-uppercase fw-bold">Ticket Médio</small>
                                    <h4 class="fw-bold mb-0">{{ formatarValor(ticketMedioBarbeiro) }}</h4>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-3 bg-success bg-opacity-10 rounded-3 border border-success text-center">
                                    <small class="text-success d-block text-uppercase fw-bold">Comissão</small>
                                    <h4 class="fw-bold mb-0 text-success">{{ formatarValor(barbeiroSelecionado.comissao) }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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

        <div class="modal fade" id="modalConfirmDelete" tabindex="-1" ref="modalConfirmDeleteRef">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-body text-center p-4">
                        <div class="text-danger mb-3"><i class="bi bi-exclamation-circle display-4"></i></div>
                        <h5 class="fw-bold mb-2">Tem certeza?</h5>
                        <div class="alert alert-warning small text-start" v-if="itemAcaoEhFixa">
                            <i class="bi bi-info-circle me-1"></i> Essa é uma despesa fixa recorrente. Excluir remove
                            esse lançamento e todos os meses seguintes a partir dele — os meses anteriores continuam
                            intactos.
                        </div>
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-danger fw-bold" @click="confirmarExclusao">Sim,
                                Excluir</button>
                            <button type="button" class="btn btn-light text-muted"
                                data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" class="toast align-items-center border-0 text-white" :class="toastClass" role="alert"
                ref="toastRef">
                <div class="d-flex">
                    <div class="toast-body"><i :class="toastIcon"></i> {{ toastMessage }}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-toast="toast"></button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { Modal, Toast } from 'bootstrap'
import * as XLSX from 'xlsx'
import Cookies from 'js-cookie'
import CurrencyInput from '../components/CurrencyInput.vue'
import MonthlyBarChart from '../components/MonthlyBarChart.vue'
import RankedBarChart from '../components/RankedBarChart.vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// =========================================================================
//  IDENTIFICAÇÃO
// =========================================================================
const isSuperAdmin = computed(() => {
    const subdomain = window.location.hostname.split('.')[0];
    return subdomain === 'adm' || subdomain === 'admin' || subdomain === 'localhost';
});

const userRole = ref(null)
const isEspectador = computed(() => userRole.value === 6);

// =========================================================================
//  TEXTOS DINÂMICOS
// =========================================================================
const labels = computed(() => {
    if (isSuperAdmin.value) {
        return { titulo: 'Financeiro Global SaaS', subtitulo: 'Visão consolidada de assinaturas.', cardReceita: 'Faturamento SaaS', cardSecundario: 'MRR Atual', cardDespesa: 'Custos Infra', cardLucro: 'Lucro Líquido SaaS', btnNovoLancamento: 'Nova Despesa', tabSecundaria: 'Tenants (Lojas)' };
    }
    return { titulo: 'Financeiro da Operação', subtitulo: 'Visão consolidada da barbearia.', cardReceita: 'Receita Bruta', cardSecundario: 'Comissões', cardDespesa: 'Saídas (Custos)', cardLucro: 'Lucro Líquido Real', btnNovoLancamento: 'Novo Lançamento', tabSecundaria: 'Performance Equipe' };
});

// =========================================================================
//  VARIÁVEIS
// =========================================================================
const dadosRelatorio = ref(null)
const relatorioSecundario = ref([])

const dataInicio = ref('')
const dataFim = ref('')
const carregando = ref(false)
const salvandoLancamento = ref(false)

const modalLancamentoRef = ref(null)
const modalConfirmDeleteRef = ref(null)
const modalComissoesRef = ref(null)
const modalRelatorioIndividualRef = ref(null)
const barbeiroSelecionado = ref(null)
let bsModalRelatorioIndividual = null
const toastRef = ref(null)

const modoEdicao = ref(false)
const idAcao = ref(null)
const tipoAcao = ref('DESPESA')

const form = ref({ tipo: 'DESPESA', description: '', amount: '', date: '', isFixed: false, isPaid: false })

const formComissoes = ref({ percentualProduto: 0, percentualConsumivel: 0, percentualAvulso: 0, valorFixoPlano: 0 })
const salvandoComissoes = ref(false)

let bsModalLancamento = null; let bsModalDelete = null; let bsModalComissoes = null; let bsToast = null;
const toastMessage = ref(''); const toastClass = ref(''); const toastIcon = ref('');

// =========================================================================
//  AUTO-RELOAD DE DATAS E UTILITÁRIOS
// =========================================================================
let timeoutDebounce = null;
// onMounted seta dataInicio/dataFim (os valores padrão do mês atual) e chama
// carregarRelatorio() direto — sem essa flag, esse MESMO set de valores
// também disparava esse watcher, que 1.5s depois refazia a mesma requisição
// de novo (dobro de chamada à API em todo carregamento da página).
let primeiraExecucaoWatch = true;
watch([dataInicio, dataFim], () => {
    if (primeiraExecucaoWatch) { primeiraExecucaoWatch = false; return; }
    if (timeoutDebounce) clearTimeout(timeoutDebounce);
    // Enquanto o usuário edita o <input type="date"> (ex: apagando pra digitar
    // de novo), o v-model passa por um estado intermediário vazio — disparar a
    // requisição nesse instante manda uma data inválida pro back.
    if (!dataInicio.value || !dataFim.value) return;
    carregando.value = true;
    timeoutDebounce = setTimeout(() => { carregarRelatorio(); }, 1500);
});

const formatarValor = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const formatarData = (d) => new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
const getLocalISODate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};
const getConfig = () => ({ headers: { 'Authorization': `Bearer ${Cookies.get('access_token')}`, 'x-tenant-id': Cookies.get('tenant_id') } });
const formatServico = (s) => s ? s.replace(/_PLANO[BPRS]+$/, '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : '';

const showToast = (msg, type = 'success') => {
    toastMessage.value = msg;
    toastClass.value = type === 'success' ? 'bg-success' : 'bg-danger';
    toastIcon.value = type === 'success' ? 'bi bi-check-circle-fill me-2' : 'bi bi-exclamation-octagon-fill me-2';
    if (!bsToast) bsToast = new Toast(toastRef.value);
    bsToast.show();
};

// =========================================================================
//  GRÁFICOS (série histórica mês a mês)
// =========================================================================
const graficos = ref(null);
const carregandoGraficos = ref(false);
const mesesGrafico = ref(6);

// Usa a cor personalizada da loja quando existir (ver .tenant-themed no
// theme.scss); cai pro indigo/âmbar padrão da ZenCut quando não há.
const corGraficoPrimario = 'var(--tenant-primary, #4F46E5)';
const corGraficoSecundario = 'var(--tenant-secondary, #F59E0B)';

const dadosFaturamentoMensal = computed(() => (graficos.value?.faturamentoMensal || []).map(m => ({ label: m.label, valor: m.total })));
const dadosCrescimentoPlanos = computed(() => (graficos.value?.crescimentoPlanos || []).map(m => ({ label: m.label, valor: m.qtd })));
const dadosCrescimentoClientes = computed(() => (graficos.value?.crescimentoClientes || []).map(m => ({ label: m.label, valor: m.qtd })));

const formatarValorCompacto = (v) => v >= 1000 ? `R$ ${(v / 1000).toFixed(1).replace('.', ',')}k` : `R$ ${Math.round(v)}`;

const carregarGraficos = async () => {
    carregandoGraficos.value = true;
    try {
        const response = await axios.get(`${API_URL}/financeiro/graficos`, { params: { meses: mesesGrafico.value }, ...getConfig() });
        graficos.value = response.data;
    } catch (error) {
        console.error('Erro ao carregar gráficos:', error);
    } finally {
        carregandoGraficos.value = false;
    }
};

// =========================================================================
//  COMPUTEDS (KPIS INTELIGENTES)
// =========================================================================
const ticketMedioBarbeiro = computed(() => {
    if (!barbeiroSelecionado.value || !barbeiroSelecionado.value.total) return 0;
    return barbeiroSelecionado.value.faturamento / barbeiroSelecionado.value.total;
});

const abrirRelatorioIndividual = (barbeiro) => {
    barbeiroSelecionado.value = barbeiro;
    if (!bsModalRelatorioIndividual) bsModalRelatorioIndividual = new Modal(modalRelatorioIndividualRef.value);
    bsModalRelatorioIndividual.show();
};

const totais = computed(() => {
    if (!dadosRelatorio.value) return { receita: 0, secundario: 0, despesas: 0, lucro: 0 };
    if (isSuperAdmin.value) {
        const d = dadosRelatorio.value.totais;
        return { receita: d.receitaBrutaTotal || 0, secundario: d.mrrAtual || 0, despesas: d.custosInfraestrutura?.total || 0, lucro: (d.receitaBrutaTotal || 0) - (d.custosInfraestrutura?.total || 0) };
    } else {
        const d = dadosRelatorio.value;
        const tc = d.totais.totalComissoes;
        return { receita: d.totais.totalFinanceiro?.receitaBrutaTotal || 0, secundario: (tc?.total || 0) + (tc?.consultorias || 0), despesas: d.totais.custosOperacionais?.total || 0, lucro: d.lucroLiquidoReal || 0 };
    }
});

const listaDespesas = computed(() => isSuperAdmin.value ? (dadosRelatorio.value?.totais?.custosInfraestrutura?.lista || []) : (dadosRelatorio.value?.totais?.custosOperacionais?.lista || []));
const listaEntradas = computed(() => isSuperAdmin.value ? [] : (dadosRelatorio.value?.totais?.entradas?.lista || []));
const kpisDetalhados = computed(() => isSuperAdmin.value || !dadosRelatorio.value ? {} : { avulsos: dadosRelatorio.value.totais.totalFinanceiro.avulsos, produtos: dadosRelatorio.value.totais.totalFinanceiro.produtos, planos: dadosRelatorio.value.totais.totalFinanceiro.planos || 0, manuais: dadosRelatorio.value.totais.totalFinanceiro.manuais || 0 });

const listasSecundarias = computed(() => {
    if (!relatorioSecundario.value) return { lojas: [], barbeiros: [] };
    if (isSuperAdmin.value) return { lojas: relatorioSecundario.value.sort((a, b) => b.valorAssinatura - a.valorAssinatura), barbeiros: [] };
    return { lojas: [], barbeiros: relatorioSecundario.value.map(b => ({ id: b.barbeiroId, nome: b.nomeBarbeiro, total: b.totalServicosRealizados || 0, faturamento: b.totalFaturamento || 0, comissao: b.comissaoTotal || 0 })).sort((a, b) => b.total - a.total) };
});

// =========================================================================
//  API & CRUD 
// =========================================================================
const carregarRelatorio = async () => {
    carregando.value = true;
    try {
        let urlResumo = isSuperAdmin.value ? '/financeiro/saas/resumo' : '/financeiro/resumo';
        let urlSecundario = isSuperAdmin.value ? '/financeiro/saas/lojas' : '/financeiro/equipe';

        // Dispara as requisições em paralelo
        const requests = [
            axios.get(`${API_URL}${urlResumo}`, { params: { inicio: dataInicio.value, fim: dataFim.value }, ...getConfig() }),
            axios.get(`${API_URL}${urlSecundario}`, { params: { inicio: `${dataInicio.value}T00:00:00`, fim: `${dataFim.value}T23:59:59` }, ...getConfig() })
        ];

        const results = await Promise.all(requests);

        dadosRelatorio.value = results[0].data;
        relatorioSecundario.value = results[1].data;

    } catch (error) {
        console.error(error);
    } finally {
        carregando.value = false;
    }
};

const salvarLancamento = async () => {
    if (isEspectador.value) return;
    salvandoLancamento.value = true;
    try {
        const ds = `${form.value.date}T12:00:00.000Z`;

        const payload = {
            description: form.value.description,
            amount: parseFloat(form.value.amount),
            date: ds,
            isPaid: form.value.isPaid,
        };

        const tipoBase = form.value.tipo === 'ENTRADA' ? 'entradas' : 'despesas';

        if (modoEdicao.value) {
            await axios.patch(`${API_URL}/financeiro/${tipoBase}/${idAcao.value}`, payload, getConfig());
            showToast('Atualizado com sucesso!');
        } else {
            if (form.value.tipo === 'DESPESA' && form.value.isFixed) {
                await axios.post(`${API_URL}/financeiro/despesas/recorrente`, { ...payload, dayOfMonth: parseInt(ds.split('-')[2]) }, getConfig());
            } else {
                const subrota = form.value.tipo === 'DESPESA' ? '/variavel' : '';
                await axios.post(`${API_URL}/financeiro/${tipoBase}${subrota}`, payload, getConfig());
            }
            showToast('Lançamento salvo!');
        }

        bsModalLancamento.hide();
        // ♻️ O RECARREGAR AQUI É A MÁGICA: Ele vai buscar tudo de novo e os KPIs verdes/vermelhos lá em cima atualizam sozinhos!
        await carregarRelatorio();
    } catch (error) {
        showToast('Erro ao salvar.', 'error');
    } finally {
        salvandoLancamento.value = false;
    }
};

const alternarPagamento = async (item, tipo) => {
    if (isEspectador.value) return;
    try {
        const rota = tipo === 'ENTRADA' ? 'entradas' : 'despesas';
        await axios.patch(`${API_URL}/financeiro/${rota}/${item.id}/status`, { isPaid: !item.isPaid }, getConfig());
        showToast('Status alterado.', 'success');
        await carregarRelatorio();
    } catch (error) {
        showToast('Erro ao atualizar.', 'error');
    }
};

const confirmarExclusao = async () => {
    if (isEspectador.value) return;
    try {
        const rota = tipoAcao.value === 'ENTRADA' ? 'entradas' : 'despesas';
        await axios.delete(`${API_URL}/financeiro/${rota}/${idAcao.value}`, getConfig());
        showToast('Lançamento excluído com sucesso!');

        bsModalDelete.hide();
        // Recarrega o painel (os KPIs vão atualizar removendo aquele valor apagado)
        await carregarRelatorio();
    } catch (error) {
        showToast('Erro ao excluir.', 'error');
    }
};

// =========================================================================
//  CONTROLE DE MODAIS (AUXILIARES)
// =========================================================================
const abrirModalCriacao = () => {
    if (isEspectador.value) return;
    modoEdicao.value = false;
    form.value = { tipo: isSuperAdmin.value ? 'DESPESA' : 'ENTRADA', description: '', amount: '', date: getLocalISODate(new Date()), isFixed: false, isPaid: false };
    if (!bsModalLancamento) bsModalLancamento = new Modal(modalLancamentoRef.value);
    bsModalLancamento.show();
};

const abrirModalEdicao = (item, tipo) => {
    if (isEspectador.value) return;
    modoEdicao.value = true;
    idAcao.value = item.id;
    form.value = {
        tipo: tipo,
        description: item.description,
        amount: item.amount,
        date: new Date(item.date).toISOString().split('T')[0],
        isPaid: item.isPaid,
    };
    if (!bsModalLancamento) bsModalLancamento = new Modal(modalLancamentoRef.value);
    bsModalLancamento.show();
};

const itemAcaoEhFixa = ref(false);

const prepararDelecao = (id, tipo, ehFixa = false) => {
    if (isEspectador.value) return;
    idAcao.value = id;
    tipoAcao.value = tipo;
    itemAcaoEhFixa.value = ehFixa;
    if (!bsModalDelete) bsModalDelete = new Modal(modalConfirmDeleteRef.value);
    bsModalDelete.show();
};

// =========================================================================
//  REGRAS DE COMISSÃO
// =========================================================================
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
        showToast('Erro ao carregar as regras de comissão.', 'error');
    }
    if (!bsModalComissoes) bsModalComissoes = new Modal(modalComissoesRef.value);
    bsModalComissoes.show();
};

const salvarComissoes = async () => {
    salvandoComissoes.value = true;
    try {
        await axios.put(`${API_URL}/comissoes`, formComissoes.value, getConfig());
        showToast('Regras de comissão salvas!');
        bsModalComissoes.hide();
        await carregarRelatorio();
    } catch (error) {
        showToast(error.response?.data?.message || 'Erro ao salvar as regras.', 'error');
    } finally {
        salvandoComissoes.value = false;
    }
};

const gerarExcel = () => {
    if (!dadosRelatorio.value) return;
    const wb = XLSX.utils.book_new();
    const r = [["Métrica", "Valor"], ["Receita", totais.value.receita], ["Despesas", totais.value.despesas], ["Lucro", totais.value.lucro]];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(r), "Resumo");
    XLSX.writeFile(wb, isSuperAdmin.value ? 'Financeiro_SaaS.xlsx' : 'Financeiro_Operacao.xlsx');
};

onMounted(() => {
    const cookieData = Cookies.get("saveData");
    if (cookieData) {
        try { userRole.value = JSON.parse(cookieData).data?.role; } catch (e) { }
    }

    const dataRef = new Date();
    dataInicio.value = getLocalISODate(new Date(dataRef.getFullYear(), dataRef.getMonth(), 1));
    dataFim.value = getLocalISODate(new Date(dataRef.getFullYear(), dataRef.getMonth() + 1, 0));

    bsModalLancamento = new Modal(modalLancamentoRef.value);
    bsModalDelete = new Modal(modalConfirmDeleteRef.value);
    bsModalComissoes = new Modal(modalComissoesRef.value);
    bsToast = new Toast(toastRef.value);

    carregarRelatorio();
    if (!isSuperAdmin.value) carregarGraficos();
});
</script>

<style scoped>
.dashboard-container {
    padding: 2rem;
    background: #f8f9fa;
    min-height: 100vh;
}

.stat-card {
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-3px);
}

.nav-pills .nav-link.active {
    background-color: #0d6efd;
    color: white;
}

.nav-pills .nav-link {
    color: #6c757d;
    font-weight: 500;
}

.animate-up {
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.finance-flow .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
}

.cursor-pointer {
    cursor: pointer;
}
</style>