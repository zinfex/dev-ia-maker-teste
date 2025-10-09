export type InvalidParam = { name: string; reason: string };

export type ProblemDetails = {
    type?: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    invalid_params?: InvalidParam[];
    extras?: Record<string, unknown>;
};