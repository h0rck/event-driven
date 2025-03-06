
import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';
import { User } from '../../domain/entities/User';
import { ILoginDTO } from '../../domain/interfaces/ILoginDTO';

interface IParams {
    id: string;
}

interface ICreateUserBody extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> { }
interface IUpdateUserBody extends Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> { }

export async function userRoutes(fastify: FastifyInstance) {
    const userController = new UserController();

    fastify.post<{
        Body: ICreateUserBody
    }>('/users', {
        schema: {
            description: 'Create a new user',
            tags: ['users'],
            body: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    name: { type: 'string' }
                }
            },
            response: {
                201: {
                    description: 'Successful response',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return userController.create(request, reply);
    });

    fastify.get<{
        Params: IParams
    }>('/users/:id', {
        preHandler: [authenticate],
        schema: {
            security: [{ bearerAuth: [] }],
        }
    }, async (request, reply) => {
        return userController.getById(request, reply);
    });

    fastify.get('/users', {
        preHandler: [authenticate],
        schema: {
            security: [{ bearerAuth: [] }],
        }
    }, async (request, reply) => {
        return userController.list(request, reply);
    });

    fastify.put<{
        Params: IParams,
        Body: IUpdateUserBody
    }>('/users/:id', {
        schema: {
            security: [{ bearerAuth: [] }],
        }
    }, async (request, reply) => {
        return userController.update(request, reply);
    });

    fastify.delete<{
        Params: IParams
    }>('/users/:id', {
        schema: {
            security: [{ bearerAuth: [] }],
        }
    }, async (request, reply) => {
        return userController.delete(request, reply);
    });

    fastify.post<{
        Body: ILoginDTO
    }>('/login', async (request, reply) => {
        return userController.login(request, reply);
    });
}