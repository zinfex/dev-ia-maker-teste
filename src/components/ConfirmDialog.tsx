export function ConfirmDialog({ open, title, description, onConfirm, onCancel }:{
        open: boolean; title: string; description?: string; onConfirm: () => void; onCancel: () => void;
    }) {
        if (!open) return null;
        return (
            <div role="dialog" aria-modal style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)' }}>
                <div style={{ background: '#fff', maxWidth: 420, margin: '10% auto', padding: 16, borderRadius: 8 }}>
                    <h3>{title}</h3>
                    {description && <p>{description}</p>}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button onClick={onCancel}>Cancelar</button>
                        <button onClick={onConfirm} style={{ background: '#e00', color: '#fff' }}>Confirmar</button>
                    </div>
                </div>
            </div>
    );
}