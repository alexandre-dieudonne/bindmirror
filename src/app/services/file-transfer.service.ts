import {Service} from '@angular/core';
import {ImportExportFiles, isRecord} from '../models/import-export-files';

function isImportExportFile(value: unknown): value is ImportExportFiles {
    return isRecord(value) && typeof value['kind'] === 'string' && isRecord(value['data']);
}

@Service()
export class FileTransferService {
    exportFile<T extends Record<string, unknown>>(kind: string, data: T, filename: string): void {
        const blob = new Blob([JSON.stringify({kind, data})], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    }

    readFile<T extends Record<string, unknown>>(file: File): Promise<ImportExportFiles<T>> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                let parsed: unknown;
                try {
                    parsed = JSON.parse(reader.result as string);
                } catch {
                    reject(new Error('Invalid JSON'));
                    return;
                }
                if (!isImportExportFile(parsed)) {
                    reject(new Error('Invalid file shape'));
                    return;
                }
                resolve(parsed as ImportExportFiles<T>);
            };
            reader.onerror = () => reject(reader.error ?? new Error('File read error'));
            reader.readAsText(file);
        });
    }
}
