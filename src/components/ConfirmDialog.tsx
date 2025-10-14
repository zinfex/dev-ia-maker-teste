export function ConfirmDialog({ open, title, description, onConfirm, onCancel }:{
        open: boolean; title: string; description?: string; onConfirm: () => void; onCancel: () => void;
    }) {
        if (!open) return null;
        return (
            <div role="dialog" aria-modal className="modal-backdrop">
                <div className="modal fade-in">
                    <h3>{title}</h3>
                    {description && <p>{description}</p>}
                    <div className="modal-actions">
                        <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
                        <button className="btn-danger" onClick={onConfirm}>Confirmar</button>
                    </div>
                </div>
            </div>
    );
}