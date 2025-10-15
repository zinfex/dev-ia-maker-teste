import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../api/hooks';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';
import { useNavigate } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';

const schema = z.object({ username: z.string().min(1, 'Informe usuário'), password: z.string().min(1, 'Informe senha') });
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
const navigate = useNavigate();
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
const login = useLogin();

async function onSubmit(values: FormData) {
    try {
        await login.mutateAsync(values);
        navigate('/messages');
    } catch (e) {
        // handled via problem UI
    }
}

return (
    <div className="login-container fade-in">
        <h2 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><BiUser /> Login</h2>

        <ErrorAlert problem={(login.error as ProblemDetails) ?? null} />

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
            <label>Usuário</label>
            <input {...register('username')} />
            {errors.username && <small className="error">{errors.username.message}</small>}
            </div>

            <div className="form-group">
            <label>Senha</label>
            <input type="password" {...register('password')} />
            {errors.password && <small className="error">{errors.password.message}</small>}
            </div>

            <button type="submit" className="btn-login" disabled={login.isPending}>
            {login.isPending ? 'Entrando...' : 'Entrar'}
            </button>
            <button type="button" className="btn-register" onClick={() => navigate('/register')}>
            Criar conta
            </button>
        </form>
    </div>
);
}