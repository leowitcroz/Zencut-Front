// Escolhe branco ou escuro pro texto de acordo com o quão clara é a cor de
// fundo — sem isso, uma loja que escolhe uma cor clara (ex: salmão, amarelo
// claro) fica com texto branco ilegível em cima.
export function corContrastante(hexFundo) {
    const limpo = (hexFundo || '').replace('#', '');
    if (limpo.length !== 6) return '#ffffff';

    const r = parseInt(limpo.slice(0, 2), 16);
    const g = parseInt(limpo.slice(2, 4), 16);
    const b = parseInt(limpo.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return '#ffffff';

    // Luminância percebida (fórmula YIQ) — simples e confiável pra decidir
    // preto ou branco em cima de qualquer cor.
    const luminancia = (r * 299 + g * 587 + b * 114) / 1000;
    return luminancia > 150 ? '#1a1a1a' : '#ffffff';
}
