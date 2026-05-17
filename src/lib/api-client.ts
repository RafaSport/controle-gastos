/**
 * Cliente HTTP tipado para consumo interno da API Next.js.
 * Centraliza tratamento de erro HTTP, parsing JSON e tipagem TypeScript.
 */

const BASE_URL = '';

/** Executa GET com tratamento padronizado de erro. */
export async function apiGet<T>(url: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`);
    return tratarResposta<T>(res);
}

/** Executa POST com body JSON. */
export async function apiPost<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return tratarResposta<T>(res);
}

/** Executa PUT com body JSON. */
export async function apiPut<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return tratarResposta<T>(res);
}

/** Executa DELETE. */
export async function apiDelete<T>(url: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, { method: 'DELETE' });
    return tratarResposta<T>(res);
}

/** Extrai erro da resposta HTTP e joga como exceção. */
async function tratarResposta<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let mensagem = `Erro ${res.status}: ${res.statusText}`;
        try {
            const body = await res.json();
            if (body?.erro) mensagem = body.erro;
        } catch {
            // corpo não é JSON
        }
        throw new Error(mensagem);
    }
    return res.json() as Promise<T>;
}

/** Executa PATCH com body JSON. */
export async function apiPatch<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return tratarResposta<T>(res);
}