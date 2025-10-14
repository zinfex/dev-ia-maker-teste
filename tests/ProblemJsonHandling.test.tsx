import { render } from '@testing-library/react';
import ErrorAlert from '../src/components/ErrorAlert';
import type { ProblemDetails } from '../src/types/problem';

test('exibe detalhes de application/problem+json', () => {
    const problem: ProblemDetails = {
        title: 'Invalid input',
        status: 400,
        detail: 'One or more fields failed validation',
        invalid_params: [ { name: 'title', reason: 'required' }, { name: 'body', reason: 'minLength 10' } ],
        extras: { requestId: 'req_abc123' }
    };
    const { getByText } = render(<ErrorAlert problem={problem} />);
    expect(getByText(/Invalid input/i)).toBeInTheDocument();
    expect(getByText(/title/i)).toBeInTheDocument();
    expect(getByText(/req_abc123/i)).toBeInTheDocument();
});