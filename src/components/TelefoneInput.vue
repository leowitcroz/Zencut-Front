<template>
    <input type="text" inputmode="tel" class="form-control" :class="inputClass" :placeholder="placeholder"
        :disabled="disabled" :required="required" v-model="textoExibido" @input="aoDigitar" maxlength="16">
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: { type: String, default: '' }, // sempre dígitos puros (ex: "11999998888")
    placeholder: { type: String, default: '(11) 99999-8888' },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    inputClass: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

// Formata progressivamente enquanto digita: (11 -> (11) 9999 -> (11) 9999-8888
// -> (11) 99999-8888 (DDD + fixo de 8 dígitos ou celular de 9 dígitos).
const mascarar = (digitos) => {
    if (!digitos) return '';
    if (digitos.length <= 2) return `(${digitos}`;
    if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    if (digitos.length <= 10) return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
};

const textoExibido = ref(mascarar((props.modelValue || '').replace(/\D/g, '').slice(0, 11)));

// Mantém o campo sincronizado se o valor vier de fora (ex: ao carregar o perfil)
watch(() => props.modelValue, (novoValor) => {
    const digitosAtuais = textoExibido.value.replace(/\D/g, '');
    const digitosNovos = (novoValor || '').replace(/\D/g, '');
    if (digitosNovos !== digitosAtuais) {
        textoExibido.value = mascarar(digitosNovos.slice(0, 11));
    }
});

const aoDigitar = (evento) => {
    const digitos = evento.target.value.replace(/\D/g, '').slice(0, 11);
    textoExibido.value = mascarar(digitos);
    emit('update:modelValue', digitos);
};
</script>
