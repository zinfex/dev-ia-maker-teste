import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMessages, useDeleteMessage } from '../api/hooks';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';
import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Pagination } from '../components/Pagination';


export default function MessagesListPage(){
    const [sp, setSp] = useSearchParams({ page: '1', limit: '10' });
    const page = Number(sp.get('page')||1);
    const limit = Number(sp.get('limit')||10);
    const status = sp.get('status')||undefined;
    const nav = useNavigate();


    const { data, isLoading, error } = useMessages({ page, limit, status });
    const del = useDeleteMessage();
    const [toDelete, setToDelete] = useState<string|null>(null);


    function onPage(p:number){
        sp.set('page', String(p));
        setSp(sp, { replace: true });
    }

    if (isLoading) return <Loader/>;

    return (
        <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h2>Mensagens</h2>
            <button onClick={()=>nav('/messages/new')}>Nova mensagem</button>
        </div>
        <ErrorAlert problem={(error || del.error) as ProblemDetails | null} />


        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom: 8 }}>
            <label>Status:</label>
            <select value={status||''} onChange={(e)=>{ const v = e.target.value; v ? sp.set('status', v) : sp.delete('status'); setSp(sp, { replace:true }); }}>
            <option value="">Todos</option>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            </select>
        </div>

        <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
            <thead>
            <tr style={{ textAlign:'left', borderBottom: '1px solid #ddd' }}>
            <th>Título</th>
            <th>Status</th>
            <th>Criado em</th>
            <th></th>
            </tr>
            </thead>
            <tbody>
                {data?.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td><Link to={`/messages/${m.id}`}>{m.title}</Link></td>
                    <td>{m.status}</td>
                    <td>{new Date(m.created_at).toLocaleString()}</td>
                    <td style={{ textAlign:'right' }}>
                        <button onClick={()=>nav(`/messages/${m.id}/edit`)}>Editar</button>{' '}
                        <button onClick={()=>setToDelete(m.id)} style={{ color:'#e00' }}>Excluir</button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>


        {data?.meta && (
            <Pagination page={data.meta.page} limit={data.meta.limit} total={data.meta.total} onPage={onPage} />
        )}

        <ConfirmDialog
            open={!!toDelete}
            title="Confirmar exclusão"
            description="Tem certeza que deseja excluir esta mensagem?"
            onConfirm={async () => {
            if (toDelete) {
                await del.mutateAsync(toDelete);
                setToDelete(null);
            }
            }}
            onCancel={() => setToDelete(null)}
        />
        </div>
    );
}
