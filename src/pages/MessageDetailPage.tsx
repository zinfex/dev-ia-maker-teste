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
        <div className="detail-container">
            <h2>Detalhe</h2>

            <ErrorAlert problem={error as ProblemDetails | null} />

            {data && (
                <article className="detail-article">
                <h3>{data.title}</h3>
                <small className="detail-meta">
                    Status: {data.status} | Atualizado: {new Date(data.updated_at).toLocaleString()}
                </small>
                <p className="detail-body">{data.body}</p>
                <div className="detail-actions">
                    <Link className="btn-edit" to={`/messages/${data.id}/edit`}>Editar</Link>
                </div>
                </article>
            )}
        </div>
    );
}
