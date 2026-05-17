/**
 * Cliente HTTP minimalista para consumo interno da API.
 * Centraliza tratamento de erro HTTP e parsing JSON tipado.
 *
 * TODO: Expandir para POST/PUT/DELETE quando refatorar os modais.
 */

const BASE_URL = '';

/**
 * Executa GET na API com tratamento padronizado de erro.
 * @throws Error com mensagem da API se res.ok === false
 */
export async function apiGet<T>(url: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`);

    if (!res.ok) {
        // Tenta extrair mensagem de erro do corpo JSON
        let mensagem = `Erro ${res.status}: ${res.statusText}`;
        try {
            const body = await res.json();
            if (body?.erro) mensagem = body.erro;
        } catch {
            // corpo não é JSON, mantém mensagem padrão
        }
        throw new Error(mensagem);
    }

    return res.json() as Promise<T>;
}