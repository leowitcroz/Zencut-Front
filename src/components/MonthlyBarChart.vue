<template>
    <div>
        <div class="monthly-chart-bars">
            <div class="monthly-chart-col" v-for="(item, i) in dadosNormalizados" :key="i" :title="item.tooltip">
                <span class="monthly-chart-valor">{{ item.rotulo }}</span>
                <div class="monthly-chart-barra" :style="{ height: item.altura + '%', background: cor }"></div>
                <span class="monthly-chart-label">{{ item.label }}</span>
            </div>
        </div>
        <div v-if="!dados.length" class="text-muted small text-center py-4">Sem dados suficientes ainda.</div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    dados: { type: Array, default: () => [] }, // [{ label, valor }]
    cor: { type: String, default: '#0D6EFD' },
    formatarValor: { type: Function, default: (v) => String(v) },
});

const maximo = computed(() => Math.max(...props.dados.map(d => d.valor), 1));

const dadosNormalizados = computed(() => props.dados.map(d => ({
    ...d,
    altura: d.valor <= 0 ? 2 : Math.max((d.valor / maximo.value) * 100, 6),
    rotulo: props.formatarValor(d.valor),
    tooltip: `${d.label}: ${props.formatarValor(d.valor)}`,
})));
</script>

<style scoped>
.monthly-chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    height: 170px;
}

.monthly-chart-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    min-width: 0;
}

.monthly-chart-valor {
    font-size: .68rem;
    font-weight: 700;
    color: #6b7280;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.monthly-chart-barra {
    width: 100%;
    max-width: 34px;
    border-radius: 6px 6px 2px 2px;
    transition: height .3s ease;
}

.monthly-chart-label {
    font-size: .72rem;
    color: #9ca3af;
    margin-top: 6px;
}
</style>
