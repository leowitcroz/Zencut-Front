<template>
    <div class="d-flex flex-column gap-3">
        <div v-for="item in dadosNormalizados" :key="item.nome">
            <div class="d-flex justify-content-between small mb-1">
                <span class="fw-medium text-dark text-truncate pe-2">{{ item.nome }}</span>
                <span class="fw-bold text-nowrap" :style="{ color: cor }">{{ item.qtd }}x</span>
            </div>
            <div class="ranked-track">
                <div class="ranked-fill" :style="{ width: item.largura + '%', background: cor }"></div>
            </div>
        </div>
        <div v-if="!dados.length" class="text-muted small text-center py-4">Sem dados suficientes ainda.</div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    dados: { type: Array, default: () => [] }, // [{ nome, qtd }]
    cor: { type: String, default: '#F59E0B' },
});

const maximo = computed(() => Math.max(...props.dados.map(d => d.qtd), 1));

const dadosNormalizados = computed(() => props.dados.map(d => ({
    ...d,
    largura: Math.max((d.qtd / maximo.value) * 100, 6),
})));
</script>

<style scoped>
.ranked-track {
    height: 10px;
    background: #f1f3f5;
    border-radius: 5px;
    overflow: hidden;
}

.ranked-fill {
    height: 100%;
    border-radius: 5px;
    transition: width .3s ease;
}
</style>
