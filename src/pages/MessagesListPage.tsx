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
    const resp: any = data as any;
    const items: any[] = Array.isArray(resp)
        ? resp
        : Array.isArray(resp?.data)
            ? resp.data
            : Array.isArray(resp?.items)
                ? resp.items
                : Array.isArray(resp?.results)
                    ? resp.results
                    : [];
    console.log(items)

    if (isLoading) return <Loader/>;

    return (
        <div className="messages-container fade-in">
          <div className="header">
            <h2>Mensagens</h2>

            <div className="filter">
              <label>Status:</label>
              <select
                  value={status || ''}
                  onChange={(e) => {
                  const v = e.target.value;
                  v ? sp.set('status', v) : sp.delete('status');
                  setSp(sp, { replace: true });
                  }}
              >
                  <option value="">Todos</option>
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
              </select>
            </div>
          </div>
      
        <ErrorAlert problem={(error || del.error) as ProblemDetails | null} />
      
        <table className="messages-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Criado em</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.length == 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
                  Nenhuma mensagem cadastrada
                </td>
              </tr>
            ) : (
              items.map((m) => (
                <tr key={m.id}>
                  <td>
                    <Link to={`/messages/${m.id}`}>{m.title}</Link>
                  </td>
                  <td>{m.status}</td>
                  <td>{new Date(m.created_at).toLocaleString()}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => nav(`/messages/${m.id}/edit`)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => setToDelete(m.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>

        {(() => {
            const meta: any = (resp && (resp.meta || resp.pagination)) || null;
            return meta ? (
                <Pagination page={meta.page} limit={meta.limit} total={meta.total} onPage={onPage} />
            ) : null;
        })()}

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
