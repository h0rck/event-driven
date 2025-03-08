import { PrismaClient, Usuario } from '@prisma/client';
import { Repository } from './Repository';

export interface IUsuarioRepository {
    findAll(): Promise<Usuario[]>;
    findById(id: number): Promise<Usuario | null>;
    findByEmail(email: string): Promise<Usuario | null>;
    findByUsuario(usuario: string): Promise<Usuario | null>;
    create(data: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'emailConfirmado'>): Promise<Usuario>;
    update(id: number, data: Partial<Usuario>): Promise<Usuario>;
    delete(id: number): Promise<void>;
}

export class UsuarioRepository extends Repository implements IUsuarioRepository {
    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    async findAll(): Promise<Usuario[]> {
        return this.prisma.usuario.findMany({
            where: { deletedAt: null }
        });
    }

    async findById(id: number): Promise<Usuario | null> {
        return this.prisma.usuario.findFirst({
            where: { id, deletedAt: null }
        });
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        return this.prisma.usuario.findFirst({
            where: { email, deletedAt: null }
        });
    }

    async findByUsuario(usuario: string): Promise<Usuario | null> {
        return this.prisma.usuario.findFirst({
            where: { usuario, deletedAt: null }
        });
    }

    async create(data: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'emailConfirmado'>): Promise<Usuario> {
        return this.prisma.usuario.create({ data });
    }

    async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
        return this.prisma.usuario.update({
            where: { id },
            data
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.usuario.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
}
