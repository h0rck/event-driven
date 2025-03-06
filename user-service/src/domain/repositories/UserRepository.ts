import { User } from "../entities/User";
import { UserModel } from "../schemas/UserSchema";


export class UserRepository {
    private users: User[] = [];

    public async createUser(user: Omit<User, 'id'>): Promise<User> {
        const id = this.generateId();
        const newUser: User = {
            ...user,
            id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }

    public async findUserById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) || null;
    }

    public async findUserByEmail(email: string): Promise<User | null> {
        for (const user of this.users) {
            if (user.email === email) return user;
        }
        return null;
    }

    public async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        const existingUserIndex = this.users.findIndex(user => user.id === id);
        if (existingUserIndex === -1) return null;

        const existingUser = this.users[existingUserIndex];
        const updatedUser: User = {
            ...existingUser,
            ...userData,
            id,
            updatedAt: new Date()
        };
        this.users[existingUserIndex] = updatedUser;
        return updatedUser;
    }

    public async deleteUser(id: string): Promise<boolean> {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) return false;

        this.users.splice(userIndex, 1);
        return true;
    }

    public async listUsers(): Promise<User[]> {
        return this.users;
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email }).lean();
            return user;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}