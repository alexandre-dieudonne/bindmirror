import {Service} from '@angular/core';

@Service()
export class StorageService {
    getItem<T>(key: string): T | null {
        let value: string | null;
        try {
            value = localStorage.getItem(key);
        } catch {
            return null;
        }
        if (!value) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return null;
        }
    }

    setItem<T>(key: string, value: T): boolean {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }

    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch {
            return;
        }
    }
}
