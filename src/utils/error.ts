import type { ProblemDetails } from '../types/problem';


export async function parseProblem(res: Response): Promise<ProblemDetails> {
    let pd: ProblemDetails = { title: res.statusText || 'Erro', status: res.status } as ProblemDetails;
    try {
        const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/problem+json')) {
         pd = await res.json();
    } else if (ct.includes('application/json')) {
        const data = await res.json();
        pd = { title: 'Erro', status: res.status, detail: JSON.stringify(data) };
    } else {
        pd = { title: 'Erro', status: res.status, detail: await res.text() } as ProblemDetails;
    }
    } catch {
    // fallback
    }
    return pd;
}