import { User } from '../entities/User';

export class UserRepository {
    private users: Map<string, User> = new Map();

    public async createUser(user: Omit<User, 'id'>): Promise<User> {
        const id = this.generateId();
        const newUser: User = {
            ...user,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.set(id, newUser);
        return newUser;
    }

    public async findUserById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }

    public async findUserByEmail(email: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.email === email) return user;
        }
        return null;
    }

    public async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        const existingUser = this.users.get(id);
        if (!existingUser) return null;

        const updatedUser: User = {
            ...existingUser,
            ...userData,
            id,
            updatedAt: new Date()
        };
        this.users.set(id, updatedUser);
        return updatedUser;
    }

    public async deleteUser(id: string): Promise<boolean> {
        return this.users.delete(id);
    }

    public async listUsers(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}