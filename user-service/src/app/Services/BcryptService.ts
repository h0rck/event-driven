import bcrypt from 'bcrypt';

export class BcryptService {

    static async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    static async comparar(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}