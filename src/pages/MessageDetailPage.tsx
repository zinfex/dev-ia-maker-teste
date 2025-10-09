import { Link, useParams } from 'react-router-dom';
import { useMessage } from '../api/hooks';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';

export default function MessageDetailPage(){
    const { id = '' } = useParams();
    const { data, isLoading, error } = useMessage(id);
    if (isLoading) return <Loader/>;
    return (
        <div>
            <h2>Detalhe</h2>
            <ErrorAlert problem={error as ProblemDetails | null} />
            {data && (
                <article>
                    <h3>{data.title}</h3>
                    <small>Status: {data.status} | Atualizado: {new Date(data.updated_at).toLocaleString()}</small>
                    <p style={{ whiteSpace:'pre-wrap', marginTop: 12 }}>{data.body}</p>
                    <div style={{ marginTop: 16 }}>
                        <Link to={`/messages/${data.id}/edit`}>Editar</Link>
                    </div>
                </article>
            )}
        </div>
    );
}
