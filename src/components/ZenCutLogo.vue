<template>
    <span>
        <span :class="variant === 'light' ? 'text-white' : 'text-dark'">Zen</span><span class="text-warning">Cut</span>
    </span>
</template>

<script setup>
// variant="light": "Zen" em branco — usar sobre fundo escuro (sidebar, header da landing).
// variant="dark": "Zen" na cor escura da marca — usar sobre fundo claro/branco.
defineProps({
    variant: { type: String, default: 'light' }
});
</script>
