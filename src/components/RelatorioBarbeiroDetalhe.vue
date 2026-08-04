<template>
    <div v-if="dados">
        <div class="row g-3 mb-4">
            <div class="col-4">
                <div class="p-3 bg-light rounded-3 border text-center h-100">
                    <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Serviços
                        Concluídos</small>
                    <h4 class="fw-bold mb-0 text-dark">{{ dados.totalServicosRealizados }}</h4>
                </div>
            </div>
            <div class="col-4">
                <div class="p-3 bg-light rounded-3 border text-center h-100">
                    <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Clientes com
                        Plano</small>
                    <h4 class="fw-bold mb-0 text-primary">{{ dados.detalhes?.clientesComPlano ?? 0 }}</h4>
                </div>
            </div>
            <div class="col-4">
                <div class="p-3 bg-light rounded-3 border text-center h-100">
                    <small class="text-muted d-block text-uppercase fw-bold" style="font-size: 0.7rem;">Clientes
                        Avulsos</small>
                    <h4 class="fw-bold mb-0 text-secondary">{{ dados.detalhes?.clientesAvulsos ?? 0 }}</h4>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3" v-if="mostrarArrecadacao">
            <div class="card-header bg-white border-bottom-0 pt-3">
                <h6 class="fw-bold mb-0"><i class="bi bi-building text-primary me-2"></i>Arrecadação Bruta Gerada</h6>
            </div>
            <div class="card-body pt-2">
                <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between px-0 py-2">
                        <span class="text-muted">Serviços Avulsos/Excedentes</span>
                        <span class="fw-medium">{{ formatarValor(dados.detalhes?.arrecadacao?.avulsos) }}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between px-0 py-2">
                        <span class="text-muted">Produtos Vendidos</span>
                        <span class="fw-medium">{{ formatarValor(dados.detalhes?.arrecadacao?.produtos) }}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between px-0 py-2">
                        <span class="text-muted">Bebidas Vendidas</span>
                        <span class="fw-medium">{{ formatarValor(dados.detalhes?.arrecadacao?.bebidas) }}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between px-0 py-2">
                        <span class="text-muted">Ticket Médio (por serviço)</span>
                        <span class="fw-medium">{{ formatarValor(ticketMedio) }}</span>
                    </div>
                    <div class="list-group-item d-flex justify-content-between px-0 pt-2 border-top fw-bold">
                        <span>Total Gerado</span>
                        <span>{{ formatarValor(dados.detalhes?.arrecadacao?.total ?? dados.totalFaturamento) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3 border-start border-4 border-success">
            <div class="card-header bg-success bg-opacity-10 border-bottom-0 pt-3">
                <h6 class="fw-bold mb-0 text-success"><i class="bi bi-wallet2 me-2"></i>Comissão a Receber</h6>
            </div>
            <div class="card-body pt-2">
                <div class="row">
                    <div class="col-6">
                        <div class="d-flex justify-content-between py-1">
                            <span class="text-muted small">Serviços Avulsos</span>
                            <span class="fw-medium small">{{ formatarValor(dados.detalhes?.comissao?.servicosAvulsos) }}</span>
                        </div>
                        <div class="d-flex justify-content-between py-1">
                            <span class="text-muted small">Serviços de Plano</span>
                            <span class="fw-medium small">{{ formatarValor(dados.detalhes?.comissao?.servicosPlano) }}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex justify-content-between py-1">
                            <span class="text-muted small">Produtos</span>
                            <span class="fw-medium small text-success">{{ formatarValor(dados.detalhes?.comissao?.produtos) }}</span>
                        </div>
                        <div class="d-flex justify-content-between py-1">
                            <span class="text-muted small">Bebidas</span>
                            <span class="fw-medium small text-success">{{ formatarValor(dados.detalhes?.comissao?.bebidas) }}</span>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <span class="fw-bold text-uppercase small">Total a Receber</span>
                    <h4 class="fw-bold text-success mb-0">{{ formatarValor(dados.detalhes?.comissao?.total ?? dados.comissaoTotal) }}</h4>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3">
            <div class="card-header bg-white border-bottom-0 pt-3">
                <h6 class="fw-bold mb-0"><i class="bi bi-list-check text-primary me-2"></i>Contagem de Serviços</h6>
            </div>
            <div class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-3">Serviço</th>
                            <th class="text-center" style="width: 110px;">Avulso</th>
                            <th class="text-center" style="width: 110px;">Plano</th>
                            <th class="text-center pe-3" style="width: 110px;" v-if="temServicoMisto">Misto*</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in dados.detalhes?.servicos" :key="s.nome">
                            <td class="ps-3">{{ s.nome }}</td>
                            <td class="text-center">
                                <span v-if="s.avulso" class="badge bg-secondary-subtle text-secondary">{{ s.avulso }}x</span>
                                <span v-else class="text-muted">—</span>
                            </td>
                            <td class="text-center">
                                <span v-if="s.plano" class="badge bg-success-subtle text-success">{{ s.plano }}x</span>
                                <span v-else class="text-muted">—</span>
                            </td>
                            <td class="text-center pe-3" v-if="temServicoMisto">
                                <span v-if="s.misto" class="badge bg-warning-subtle text-warning">{{ s.misto }}x</span>
                                <span v-else class="text-muted">—</span>
                            </td>
                        </tr>
                        <tr v-if="!dados.detalhes?.servicos?.length">
                            <td :colspan="temServicoMisto ? 4 : 3" class="text-center text-muted py-3">Nenhum serviço no
                                período.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-3 pb-2 form-text" v-if="temServicoMisto">
                *Misto: atendimento com serviço avulso e de plano juntos (ex: corte no plano + barba avulsa).
            </div>
        </div>

        <div class="card border-0 shadow-sm" v-if="dados.detalhes?.produtosVendidos?.length">
            <div class="card-header bg-white border-bottom-0 pt-3">
                <h6 class="fw-bold mb-0"><i class="bi bi-basket text-success me-2"></i>Produtos Vendidos</h6>
            </div>
            <div class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-3">Produto</th>
                            <th class="text-end pe-3">Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in dados.detalhes.produtosVendidos" :key="p.nome">
                            <td class="ps-3">{{ p.nome }}</td>
                            <td class="text-end pe-3 fw-bold">{{ p.quantidade }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div v-else class="text-center py-5 text-muted">
        <div class="spinner-border text-primary" role="status"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    dados: { type: Object, default: null },
    // Arrecadação bruta é informação do dono — o funcionário só vê a comissão dele.
    mostrarArrecadacao: { type: Boolean, default: true }
});

const formatarValor = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const ticketMedio = computed(() => {
    if (!props.dados || !props.dados.totalServicosRealizados) return 0;
    return (props.dados.totalFaturamento || 0) / props.dados.totalServicosRealizados;
});

const temServicoMisto = computed(() => {
    return (props.dados?.detalhes?.servicos || []).some(s => s.misto > 0);
});
</script>
