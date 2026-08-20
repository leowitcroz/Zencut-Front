<template>
    <div class="min-vh-100 bg-light tenant-themed" :style="temaInlineStyle">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div class="container">
                <span class="navbar-brand fw-bold">
                    <i class="bi bi-person-badge me-2"></i> {{ nomeLoja || 'Área do Cliente' }}
                </span>
            </div>
        </nav>

        <main class="py-5">
            <router-view />
        </main>
    </div>
</template>

<script setup>
// Layout base do cliente final — aplica a mesma paleta de cores da loja
// (via .tenant-themed, igual ao MainLayout/AuthLayout) lendo o subdomínio
// atual num endpoint público, já que aqui o cliente não tem acesso ao
// endpoint /tenants/:id/plano (esse é só pra funcionário/dono).
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { corContrastante } from '@/utils/cor.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const nomeLoja = ref('');
const corPrimaria = ref('#0D1B2A');
const corSecundaria = ref('#0D6EFD');

const hexParaRgb = (hex) => {
    const limpo = (hex || '').replace('#', '');
    const num = parseInt(limpo.length === 3 ? limpo.split('').map(c => c + c).join('') : limpo, 16);
    if (Number.isNaN(num)) return '13, 27, 42';
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
};

const temaInlineStyle = computed(() => ({
    '--tenant-primary': corPrimaria.value,
    '--tenant-primary-rgb': hexParaRgb(corPrimaria.value),
    '--tenant-primary-text': corContrastante(corPrimaria.value),
    '--tenant-secondary': corSecundaria.value,
    '--tenant-secondary-rgb': hexParaRgb(corSecundaria.value),
    '--tenant-secondary-text': corContrastante(corSecundaria.value),
}));

onMounted(async () => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const isMainDomain = hostname === 'zencut.com.br' || hostname === 'www.zencut.com.br' || hostname === 'localhost';
    if (isMainDomain) return;

    try {
        const res = await axios.get(`${API_URL}/tenants/info/${subdomain}`);
        const dados = res.data;
        nomeLoja.value = dados.nomeNegocio || '';
        if (dados.corPrimaria) corPrimaria.value = dados.corPrimaria;
        if (dados.corSecundaria) corSecundaria.value = dados.corSecundaria;
    } catch (e) {
        console.error('Não foi possível carregar a personalização da loja', e);
    }
});
</script>