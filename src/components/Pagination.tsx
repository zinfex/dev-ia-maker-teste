export function Pagination({ page, limit, total, onPage }:{ page:number; limit:number; total:number; onPage:(p:number)=>void }){
    const pages = Math.max(1, Math.ceil(total / limit));
    return (
        <div className="pagination">
            <button className="btn-page" disabled={page<=1} onClick={()=>onPage(page-1)}>Anterior</button>
            <span>Página {page} de {pages}</span>
            <button className="btn-page" disabled={page>=pages} onClick={()=>onPage(page+1)}>Próxima</button>
        </div>
    );
}