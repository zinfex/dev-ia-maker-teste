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
    const { data, isLoading, error } = useMessage(id || '');
    const create = useCreateMessage();
    const update = useUpdateMessage(id || '');
    const navigate = useNavigate();
    
    console.log('MessageFormPage - id:', id, 'isEdit:', isEdit, 'data:', data, 'isLoading:', isLoading);
    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
    
    useEffect(()=>{
        if (isEdit && data) {
            setValue('title', data.title);
            setValue('body', data.body);
            setValue('status', data.status);
        }
    }, [isEdit, data, setValue]);

    // Reset form when switching between create/edit
    useEffect(() => {
        if (!isEdit) {
            setValue('title', '');
            setValue('body', '');
            setValue('status', 'draft');
        }
    }, [isEdit, setValue]);
    
    
    async function onSubmit(values: FormData){
        try {
            if (isEdit) {
                await update.mutateAsync(values);
                navigate(`/messages/${id}`);
            } else {
                const created = await create.mutateAsync(values);
                navigate(`/messages/${created.id}`);
            }
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
            // Error is handled via ErrorAlert component
        }
    }
    
    if (isEdit && isLoading) return <Loader/>;

    const problem = (create.error || update.error || error) as ProblemDetails | null;


    return (
        <div className="message-form-container fade-in">
            <h2>{isEdit ? 'Editar mensagem' : 'Nova mensagem'}</h2>

            <ErrorAlert problem={problem} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                <label>Título</label>
                <input {...register('title')} />
                {errors.title && <small className="error">{errors.title.message}</small>}
                </div>

                <div className="form-group">
                <label>Conteúdo</label>
                <textarea rows={6} {...register('body')} />
                {errors.body && <small className="error">{errors.body.message}</small>}
                </div>

                <div className="form-group">
                <label>Status</label>
                <select {...register('status')}>
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                </select>
                </div>

                <div className="form-actions">
                <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={create.isPending || update.isPending}
                >
                    {isEdit 
                        ? (update.isPending ? 'Salvando...' : 'Salvar') 
                        : (create.isPending ? 'Criando...' : 'Criar')
                    }
                </button>
                <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => navigate(-1)}
                    disabled={create.isPending || update.isPending}
                >
                    Cancelar
                </button>
                </div>
            </form>

            
        </div>
    );
}
