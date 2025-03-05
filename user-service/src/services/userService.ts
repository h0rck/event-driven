import { UserRepository } from '../domain/repositories/UserRepository';
import { User } from '../domain/entities/User';
import { RabbitMQClient } from '../infrastructure/messaging/rabbitmq';

export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly messagingClient: RabbitMQClient
    ) {}

    async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const user = await this.userRepository.createUser(userData);
        
        await this.messagingClient.publishUserEvent('user.created', {
            id: user.id,
            email: user.email,
            name: user.name
        });

        return user;
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.findUserById(id);
    }

    async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        const updatedUser = await this.userRepository.updateUser(id, userData);
        
        if (updatedUser) {
            await this.messagingClient.publishUserEvent('user.updated', {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name
            });
        }

        return updatedUser;
    }

    async deleteUser(id: string): Promise<boolean> {
        const deleted = await this.userRepository.deleteUser(id);
        
        if (deleted) {
            await this.messagingClient.publishUserEvent('user.deleted', { id });
        }

        return deleted;
    }

    async listUsers(): Promise<User[]> {
        return this.userRepository.listUsers();
    }
}