import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/userController';
import { User } from '../../domain/entities/User';

interface IParams {
  id: string;
}

interface ICreateUserBody extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {}
interface IUpdateUserBody extends Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> {}

export async function userRoutes(fastify: FastifyInstance) {
    const userController = new UserController();

    fastify.post<{
        Body: ICreateUserBody
    }>('/users', async (request, reply) => {
        return userController.create(request, reply);
    });

    fastify.get<{
        Params: IParams
    }>('/users/:id', async (request, reply) => {
        return userController.getById(request, reply);
    });

    fastify.get('/users', async (request, reply) => {
        return userController.list(request, reply);
    });

    fastify.put<{
        Params: IParams,
        Body: IUpdateUserBody
    }>('/users/:id', async (request, reply) => {
        return userController.update(request, reply);
    });

    fastify.delete<{
        Params: IParams
    }>('/users/:id', async (request, reply) => {
        return userController.delete(request, reply);
    });
}