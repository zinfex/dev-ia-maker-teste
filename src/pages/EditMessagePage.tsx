import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessage, useUpdateMessage } from '../api/hooks';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';
import { useEffect, useState } from 'react';

const schema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    body: z.string().min(10, 'Mínimo de 10 caracteres'),
    status: z.enum(['draft', 'published'])
});

type FormData = z.infer<typeof schema>;

export default function EditMessagePage(){
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: message, isLoading, error } = useMessage(id || '');
    const update = useUpdateMessage(id || '');
    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ 
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            body: '',
            status: 'draft'
        }
    });
    
    // Preencher formulário quando os dados chegarem
    useEffect(() => {
        if (message) {
            setValue('title', message.title);
            setValue('body', message.body);
            setValue('status', message.status);
        }
    }, [message, setValue]);
    
    async function onSubmit(values: FormData) {
        if (!id) return;
        
        setIsSubmitting(true);
        try {
            await update.mutateAsync(values);
            navigate(`/messages/${id}`);
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (isLoading) {return <Loader />}
    
    if (error) {
        return (
            <div className="message-form-container fade-in">
                <h2>Erro ao carregar mensagem</h2>
                <ErrorAlert problem={error as unknown as ProblemDetails} />
                
                <button className="btn-secondary" onClick={() => navigate(-1)}>
                    Voltar
                </button>
            </div>
        );
    }
    
    if (!message) {
        return (
            <div className="message-form-container fade-in">
                <h2>Mensagem não encontrada</h2>
                <p>A mensagem que você está tentando editar não foi encontrada.</p>
                <button className="btn-secondary" onClick={() => navigate('/messages')}>
                    Voltar para lista
                </button>
            </div>
        );
    }
    
    return (
        <div className="message-form-container fade-in">
            <h2>Editar mensagem</h2>
            
            <ErrorAlert problem={(update.error as ProblemDetails) || null} />
            
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
                        disabled={isSubmitting || update.isPending}
                    >
                        {isSubmitting || update.isPending ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting || update.isPending}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
