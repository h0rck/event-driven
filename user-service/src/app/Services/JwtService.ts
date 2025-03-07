import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

export class JwtService {

    static gerar(payload: JwtPayload, options?: SignOptions): string {

        payload.iat = Math.floor(Date.now() / 1000);
        payload.exp = Math.floor(Date.now() / 1000) + 60 * 60;

        return jwt.sign(payload, SECRET_KEY, options);
    }

    static validar(token: string): JwtPayload | string {
        return jwt.verify(token, SECRET_KEY) as JwtPayload;
    }

}
