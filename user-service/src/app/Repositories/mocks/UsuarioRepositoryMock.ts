import { Usuario } from '@prisma/client';
import { IUsuarioRepository } from '../UsuarioRepository';

export class UsuarioRepositoryMock implements IUsuarioRepository {
    private usuarios: Usuario[] = [];

    async findAll(): Promise<Usuario[]> {
        return this.usuarios.filter(u => !u.deletedAt);
    }

    async findById(id: number): Promise<Usuario | null> {
        return this.usuarios.find(u => u.id === id && !u.deletedAt) || null;
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        return this.usuarios.find(u => u.email === email && !u.deletedAt) || null;
    }

    async findByUsuario(usuario: string): Promise<Usuario | null> {
        return this.usuarios.find(u => u.usuario === usuario && !u.deletedAt) || null;
    }

    async create(data: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'emailConfirmado'>): Promise<Usuario> {
        const usuario = {
            id: this.usuarios.length + 1,
            ...data,
            emailConfirmado: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        } as Usuario;

        this.usuarios.push(usuario);
        return usuario;
    }

    async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
        const index = this.usuarios.findIndex(u => u.id === id);
        if (index === -1) throw new Error('Usuário não encontrado');

        const usuario = {
            ...this.usuarios[index],
            ...data,
            updatedAt: new Date()
        };

        this.usuarios[index] = usuario;
        return usuario;
    }

    async delete(id: number): Promise<void> {
        const index = this.usuarios.findIndex(u => u.id === id);
        if (index !== -1) {
            this.usuarios[index].deletedAt = new Date();
        }
    }
}
