import { Usuario } from "@prisma/client";

export interface IUsuarioRepository {
    findAll(): Promise<Usuario[]>;
    findById(id: number): Promise<Usuario | null>;
    findByEmail(email: string): Promise<Usuario | null>;
    findByUsuario(usuario: string): Promise<Usuario | null>;
    create(data: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'emailConfirmado'>): Promise<Usuario>;
    update(id: number, data: Partial<Usuario>): Promise<Usuario>;
    delete(id: number): Promise<void>;
}