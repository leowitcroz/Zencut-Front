<template>
    <div class="input-group" :class="inputGroupClass">
        <span class="input-group-text bg-light border-end-0">R$</span>
        <input type="text" inputmode="decimal" class="form-control border-start-0 ps-0" :class="inputClass"
            :placeholder="placeholder" :disabled="disabled" :required="required" v-model="textoExibido"
            @input="aoDigitar" @focus="$event.target.select()">
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: { type: [Number, String], default: 0 },
    placeholder: { type: String, default: '0,00' },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    inputClass: { type: String, default: '' },
    inputGroupClass: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const formatarExibicao = (valorEmCentavos) => {
    const numero = valorEmCentavos / 100;
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const paraCentavos = (valor) => Math.round((Number(valor) || 0) * 100);

const textoExibido = ref(formatarExibicao(paraCentavos(props.modelValue)));

// Mantém o campo sincronizado se o valor vier de fora (ex: ao abrir um modal de edição)
watch(() => props.modelValue, (novoValor) => {
    const centavosAtuais = Math.round(parseFloat(textoExibido.value.replace(/\./g, '').replace(',', '.')) * 100) || 0;
    if (paraCentavos(novoValor) !== centavosAtuais) {
        textoExibido.value = formatarExibicao(paraCentavos(novoValor));
    }
});

const aoDigitar = (evento) => {
    // Extrai só os dígitos, tratando os 2 últimos como centavos (mesma lógica de app bancário)
    const apenasDigitos = evento.target.value.replace(/\D/g, '');
    const centavos = parseInt(apenasDigitos || '0', 10);

    textoExibido.value = formatarExibicao(centavos);
    emit('update:modelValue', centavos / 100);
};
</script>
