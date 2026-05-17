// Classe de erro customizada para o sistema

// ============================================
// TIPOS DE ERRO
// ============================================

export type TipoErro =
    | 'validacao'
    | 'autenticacao'
    | 'autorizacao'
    | 'servidor'
    | 'rede';

// ============================================
// CLASSE DE ERRO
// ============================================

export class AppError extends Error {
    public readonly codigo: string;
    public readonly tipo: TipoErro;
    public readonly mensagemUsuario: string;
    public readonly statusCode?: number;

    constructor({
        codigo,
        tipo,
        mensagem,
        mensagemUsuario,
        statusCode,
    }: {
        codigo: string;
        tipo: TipoErro;
        mensagem: string;
        mensagemUsuario?: string;
        statusCode?: number;
    }) {
        super(mensagem);
        this.codigo = codigo;
        this.tipo = tipo;
        this.mensagemUsuario = mensagemUsuario || mensagem;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }

    static validacao(campo: string, mensagem?: string): AppError {
        return new AppError({
            codigo: `VALIDACAO_${campo.toUpperCase()}`,
            tipo: 'validacao',
            mensagem: mensagem || `O campo ${campo} é inválido.`,
            mensagemUsuario: `Verifique o campo "${campo}". ${mensagem || ''}`,
        });
    }

    static autenticacao(mensagem?: string): AppError {
        return new AppError({
            codigo: 'AUTH_INVALIDO',
            tipo: 'autenticacao',
            mensagem: mensagem || 'Credenciais inválidas.',
            mensagemUsuario: 'Login ou senha incorretos. Tente novamente.',
        });
    }

    static autorizacao(recurso?: string): AppError {
        return new AppError({
            codigo: 'FORBIDDEN',
            tipo: 'autorizacao',
            mensagem: `Acesso negado a ${recurso || 'recurso'}.`,
            mensagemUsuario: 'Você não tem permissão para realizar esta ação.',
            statusCode: 403,
        });
    }

    static servidor(mensagem?: string): AppError {
        return new AppError({
            codigo: 'ERRO_INTERNO',
            tipo: 'servidor',
            mensagem: mensagem || 'Erro interno do servidor.',
            mensagemUsuario:
                'Algo deu errado. Tente novamente em alguns instantes.',
            statusCode: 500,
        });
    }

    static rede(): AppError {
        return new AppError({
            codigo: 'ERRO_REDE',
            tipo: 'rede',
            mensagem: 'Erro de conexão.',
            mensagemUsuario:
                'Verifique sua conexão com a internet e tente novamente.',
        });
    }
}

// ============================================
// FUNÇÃO AUXILIAR: Extrair erro de uma Response HTTP
// ============================================

export async function extrairErroApi(res: Response): Promise<AppError> {
    try {
        const body = await res.json();

        if (body.error) {
            return new AppError({
                codigo: body.error.code || `HTTP_${res.status}`,
                tipo: mapStatusParaTipo(res.status),
                mensagem: body.error.message || `Erro HTTP ${res.status}`,
                mensagemUsuario:
                    body.error.message || 'Erro ao processar requisição.',
                statusCode: res.status,
            });
        }
    } catch {
        // Se não conseguir parsear JSON, retorna erro genérico
    }

    return AppError.servidor(`Erro HTTP ${res.status}`);
}

// ============================================
// FUNÇÃO AUXILIAR: Mapear HTTP status para tipo de erro
// ============================================

function mapStatusParaTipo(status: number): TipoErro {
    if (status === 400) return 'validacao';
    if (status === 401) return 'autenticacao';
    if (status === 403) return 'autorizacao';
    if (status >= 500) return 'servidor';
    return 'rede';
}