import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../api/hooks';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ maxWidth: 360 }}>
        <h2>Login</h2>
        <ErrorAlert problem={(login.error as ProblemDetails) ?? null} />
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Usuário</label>
                <input {...register('username')} />
                {errors.username && <small style={{ color: 'crimson' }}>{errors.username.message}</small>}
            </div>
            <div>
                <label>Senha</label>
                <input type="password" {...register('password')} />
                {errors.password && <small style={{ color: 'crimson' }}>{errors.password.message}</small>}
            </div>
            <button type="submit" disabled={login.isPending}>{login.isPending ? 'Entrando...' : 'Entrar'}</button>
        </form>
    </div>
);
}