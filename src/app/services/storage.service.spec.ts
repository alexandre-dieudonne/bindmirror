import {StorageService} from './storage.service';

describe('StorageService', () => {
    let service: StorageService;

    beforeEach(() => {
        localStorage.clear();
        service = new StorageService();
    });

    it('returns null when the key is absent', () => {
        expect(service.getItem('missing')).toBeNull();
    });

    it('round-trips a value through setItem/getItem', () => {
        service.setItem('key', {a: 1});
        expect(service.getItem('key')).toEqual({a: 1});
    });

    it('returns null instead of throwing on corrupted JSON', () => {
        localStorage.setItem('key', '{not json');
        expect(service.getItem('key')).toBeNull();
    });

    it('removes a stored value', () => {
        service.setItem('key', {a: 1});
        service.removeItem('key');
        expect(service.getItem('key')).toBeNull();
    });

    it('returns false instead of throwing when localStorage.setItem fails', () => {
        const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('QuotaExceededError');
        });
        expect(service.setItem('key', {a: 1})).toBe(false);
        spy.mockRestore();
    });
});
