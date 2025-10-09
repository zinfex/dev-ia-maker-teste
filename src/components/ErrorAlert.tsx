import type { ProblemDetails } from '../types/problem';


export default function ErrorAlert({ problem }: { problem: ProblemDetails | null }) {
    if (!problem) return null;

    return (
        <div role="alert" style={{ border: '1px solid #e00', padding: 12, background: '#ffe6e6', marginBottom: 12 }}>
        <strong>{problem.title} ({problem.status})</strong>
        {problem.detail && <div style={{ marginTop: 8 }}>{problem.detail}</div>}
        {problem.invalid_params && problem.invalid_params.length > 0 && (
        <ul style={{ marginTop: 8 }}>
        {problem.invalid_params.map((ip) => (
        <li key={ip.name}><code>{ip.name}</code>: {ip.reason}</li>
    ))}
        </ul>
    )}
        {problem.extras?.requestId != null && (
            <div style={{ marginTop: 8, opacity: 0.8 }}>requestId: <code>{String(problem.extras.requestId)}</code></div>
        )}
    </div>
    );
}