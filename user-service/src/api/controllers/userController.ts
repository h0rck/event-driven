import { FastifyRequest, FastifyReply } from 'fastify';

import bcrypt from 'bcrypt';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { RabbitMQClient } from '../../infrastructure/messaging/rabbitmq';
import { User } from '../../domain/entities/User';
import { ILoginDTO } from '../../domain/interfaces/ILoginDTO';

export class UserController {
    private userRepository: UserRepository;
    private messagingClient: RabbitMQClient;

    constructor() {
        this.userRepository = new UserRepository();
        this.messagingClient = new RabbitMQClient();
        this.initializeMessaging();
    }

    private async initializeMessaging() {
        await this.messagingClient.connect();
    }

    async create(request: FastifyRequest<{ Body: Omit<User, 'id'> }>, reply: FastifyReply) {
        try {
            const userData = request.body;
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.userRepository.createUser({
                ...userData,
                password: hashedPassword
            });

            // Publish user created event
            await this.messagingClient.publishUserEvent('user.created', {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            });

            return reply.code(201).send(user);
        } catch (error) {
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    }

    async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const user = await this.userRepository.findUserById(id);
            if (!user) {
                return reply.code(404).send({ error: 'User not found' });
            }
            return reply.send(user);
        } catch (error) {
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    }

    async update(request: FastifyRequest<{ Params: { id: string }, Body: Partial<User> }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const userData = request.body;

            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            const updatedUser = await this.userRepository.updateUser(id, userData);
            if (!updatedUser) {
                return reply.code(404).send({ error: 'User not found' });
            }
            return reply.send(updatedUser);
        } catch (error) {
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    }

    async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const deleted = await this.userRepository.deleteUser(id);

            if (deleted) {
                // Publish user deleted event
                await this.messagingClient.publishUserEvent('user.deleted', { id });
                return reply.code(204).send();
            }

            return reply.code(404).send({ error: 'User not found' });
        } catch (error) {
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    }

    async list(request: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await this.userRepository.listUsers();
            return reply.send(users);
        } catch (error) {
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    }

    async login(request: FastifyRequest<{ Body: ILoginDTO }>, reply: FastifyReply) {
        try {
            const { email, password } = request.body;

            const user = await this.userRepository.findByEmail(email);
            if (!user || !user.id) {
                return reply.status(401).send({ message: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return reply.status(401).send({ message: 'Invalid credentials' });
            }

            const token = await reply.jwtSign({
                userId: user.id,
                email: user.email
            });

            return reply.send({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return reply.status(500).send({ message: 'Internal server error' });
        }
    }
}