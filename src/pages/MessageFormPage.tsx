import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateMessage, useMessage, useUpdateMessage } from '../api/hooks';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';
import { useEffect } from 'react';

const schema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    body: z.string().min(10, 'Mínimo de 10 caracteres'),
    status: z.enum(['draft', 'published'])
});

export type FormData = z.infer<typeof schema>;

export default function MessageFormPage(){
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { data, isLoading } = useMessage(id || '');
    const create = useCreateMessage();
    const update = useUpdateMessage(id || '');
    const navigate = useNavigate();
    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
    
    useEffect(()=>{
        if (isEdit && data) {
        setValue('title', data.title);
        setValue('body', data.body);
        setValue('status', data.status);
        }
    }, [isEdit, data, setValue]);
    
    
    async function onSubmit(values: FormData){
        try {
            if (isEdit) {
                await update.mutateAsync(values);
                navigate(`/messages/${id}`);
            } else {
                const created = await create.mutateAsync(values);
                navigate(`/messages/${created.id}`);
            }
        } catch { /* handled o error alert */ }
    }
    
    if (isEdit && isLoading) return <Loader/>;

    const problem = (create.error || update.error) as ProblemDetails | null;


    return (
        <div style={{ maxWidth: 640 }}>
            <h2>{isEdit ? 'Editar mensagem' : 'Nova mensagem'}</h2>
            <ErrorAlert problem={problem} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Título</label>
                    <input {...register('title')} />
                    {errors.title && <small style={{ color:'crimson' }}>{errors.title.message}</small>}
                </div>
                <div>
                    <label>Conteúdo</label>
                    <textarea rows={6} {...register('body')} />
                    {errors.body && <small style={{ color:'crimson' }}>{errors.body.message}</small>}
                </div>
                <div>
                    <label>Status</label>
                    <select {...register('status')}>
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    </select>
                </div>
                <div style={{ marginTop: 12, display:'flex', gap:8 }}>
                    <button type="submit">{isEdit ? 'Salvar' : 'Criar'}</button>
                    <button type="button" onClick={()=>navigate(-1)}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}
