// Gera o login automático a partir do nome e sobrenome
// Exemplo: "Ana Bia" → "ana.bia"
export function gerarLogin(nome: string, sobrenome: string): string {
    const nomeLimpo = nome
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    const sobrenomeLimpo = sobrenome
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    return `${nomeLimpo}.${sobrenomeLimpo}`;
}

// Gera a senha padrão a partir do login
// Exemplo: "ana.bia" → "ana.bia123"
export function gerarSenhaPadrao(login: string): string {
    return `${login}123`;
}

// Calcula o mês e ano final de uma compra parcelada
// Exemplo: inicio maio/2025, 3 parcelas → final julho/2025
export function calcularMesFinal(
    mesInicio: number,
    anoInicio: number,
    qtdParcelas: number
): { mesFinal: number; anoFinal: number } {
    const totalMeses = mesInicio + qtdParcelas - 1;
    const mesFinal = ((totalMeses - 1) % 12) + 1;
    const anoFinal = anoInicio + Math.floor((totalMeses - 1) / 12);
    return { mesFinal, anoFinal };
}
