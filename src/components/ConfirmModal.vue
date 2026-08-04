<template>
    <div class="modal fade" ref="modalRef" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header border-0" :class="corHeader">
                    <h5 class="modal-title fw-bold text-white"><i :class="icone" class="me-2"></i>{{ titulo }}</h5>
                    <button type="button" class="btn-close btn-close-white" @click="cancelar" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <p class="mb-0">{{ mensagem }}</p>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-light" @click="cancelar">{{ textoCancelar }}</button>
                    <button type="button" class="btn" :class="corBotao" @click="confirmarAcao">{{ textoConfirmar }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Modal } from 'bootstrap';

const modalRef = ref(null);
let modalInstance = null;
let resolvePromise = null;

const titulo = ref('Confirmar ação');
const mensagem = ref('');
const textoConfirmar = ref('Confirmar');
const textoCancelar = ref('Cancelar');
const variante = ref('danger');

const corHeader = computed(() => variante.value === 'danger' ? 'bg-danger' : 'bg-primary');
const corBotao = computed(() => variante.value === 'danger' ? 'btn-danger' : 'btn-primary');
const icone = computed(() => variante.value === 'danger' ? 'bi bi-exclamation-triangle-fill' : 'bi bi-question-circle-fill');

const finalizar = (resultado) => {
    if (resolvePromise) {
        resolvePromise(resultado);
        resolvePromise = null;
    }
};

const confirmarAcao = () => {
    finalizar(true);
    modalInstance?.hide();
};

const cancelar = () => {
    finalizar(false);
    modalInstance?.hide();
};

const confirmar = (mensagemTexto, opcoes = {}) => {
    mensagem.value = mensagemTexto;
    titulo.value = opcoes.titulo || 'Confirmar ação';
    textoConfirmar.value = opcoes.textoConfirmar || 'Confirmar';
    textoCancelar.value = opcoes.textoCancelar || 'Cancelar';
    variante.value = opcoes.variante || 'danger';

    if (!modalInstance) modalInstance = new Modal(modalRef.value);
    modalInstance.show();

    return new Promise((resolve) => { resolvePromise = resolve; });
};

const onHidden = () => finalizar(false);

onMounted(() => {
    modalRef.value?.addEventListener('hidden.bs.modal', onHidden);
});

onBeforeUnmount(() => {
    modalRef.value?.removeEventListener('hidden.bs.modal', onHidden);
});

defineExpose({ confirmar });
</script>
