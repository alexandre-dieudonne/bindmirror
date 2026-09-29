export type ImportExportFiles<T extends Record<string, unknown> = Record<string, unknown>> = {
    kind: string;
    data: T;
};
