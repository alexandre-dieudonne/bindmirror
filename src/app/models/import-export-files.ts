export type ImportExportFiles<T extends Record<string, unknown> = Record<string, unknown>> = {
    kind: string;
    data: T;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
