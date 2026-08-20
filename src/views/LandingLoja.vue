<template>
    <div v-if="carregando" class="d-flex align-items-center justify-content-center" style="min-height: 100vh;">
        <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="!loja" class="d-flex align-items-center justify-content-center text-center px-3"
        style="min-height: 100vh;">
        <div>
            <h3 class="fw-bold mb-2">Estabelecimento não encontrado</h3>
            <router-link to="/login" class="btn btn-primary fw-bold mt-2">Ir para o login</router-link>
        </div>
    </div>

    <VitrineConteudo v-else :dados="loja" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import VitrineConteudo from '../components/VitrineConteudo.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const carregando = ref(true);
const loja = ref(null);

onMounted(async () => {
    const subdomain = window.location.hostname.split('.')[0];
    try {
        const res = await axios.get(`${API_URL}/tenants/info/${subdomain}`);
        loja.value = res.data;
    } catch (e) {
        console.error('Não foi possível carregar os dados da loja', e);
        loja.value = null;
    } finally {
        carregando.value = false;
    }
});
</script>
