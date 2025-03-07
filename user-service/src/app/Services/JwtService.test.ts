import jwt from 'jsonwebtoken';
import { JwtService } from './JwtService';

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

describe('JwtService', () => {
    const payload: jwt.JwtPayload = { userId: 1 };
    const token = 'fake-jwt-token';
    const SECRET_KEY = process.env.JWT_SECRET || 'secret';

    // Teste para o método de gerar token
    it('should generate a JWT token', () => {
        (jwt.sign as jest.Mock).mockReturnValue(token);

        const result = JwtService.gerar(payload);

        expect(jwt.sign).toHaveBeenCalledWith(
            expect.objectContaining({
                iat: expect.any(Number),
                exp: expect.any(Number),
            }),
            SECRET_KEY,
            undefined // No options passed in this case
        );
        expect(result).toBe(token);
    });

    // Teste para o método de validar token
    it('should validate a JWT token', () => {
        (jwt.verify as jest.Mock).mockReturnValue(payload);

        const result = JwtService.validar(token);

        expect(jwt.verify).toHaveBeenCalledWith(token, SECRET_KEY);
        expect(result).toBe(payload);
    });

    // Teste para o método de validar com um token inválido
    it('should throw an error for invalid JWT token', () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        expect(() => JwtService.validar(token)).toThrow('Invalid token');
    });
});
