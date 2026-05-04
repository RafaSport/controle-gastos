// Papéis disponíveis no sistema
export type Papel = 'ADMIN' | 'COMPRADOR';

// Cartões aceitos
export type Cartao = 'NUBANK' | 'INTER' | 'HIPER' | 'ITAU';

// Dados de um usuário comprador
export interface Usuario {
    id: string;
    nome: string;
    sobrenome: string;
    login: string;
    papel: Papel;
    primeiroLogin: boolean;
    qtdCompras?: number;
    totalAPagar?: number;
}

// Dados de uma compra
export interface Compra {
    id: string;
    usuarioId: string;
    cartao: Cartao;
    descricao: string;
    mesCompra: number;
    anoCompra: number;
    mesInicio: number;
    anoInicio: number;
    qtdParcelas: number;
    mesFinal: number;
    anoFinal: number;
    valorParcela: number;
}

// Dados de um mês fechado
export interface MesFechado {
    id: string;
    usuarioId: string;
    mes: number;
    ano: number;
    totalPago: number;
    dividaAnterior: number;
}

// Variantes de cor do botão
export type CorBotao = 'azul' | 'verde' | 'amarelo' | 'cinza' | 'vermelho';

// Tamanhos disponíveis para componentes
export type Tamanho = 'sm' | 'md' | 'lg';
