import bcrypt from 'bcrypt';
import { BcryptService } from '../BcryptService';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('BcryptService', () => {
    const password = 'mypassword';
    const hash = 'hashedpassword';

    // Teste para o método de hash
    it('should hash a password', async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue(hash);

        const result = await BcryptService.hash(password);

        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
        expect(result).toBe(hash);
    });

    // Teste para o método de comparação
    it('should compare a password and hash', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await BcryptService.comparar(password, hash);

        expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
        expect(result).toBe(true);
    });

    it('should return false when password does not match', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const result = await BcryptService.comparar(password, hash);

        expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
        expect(result).toBe(false);
    });
});