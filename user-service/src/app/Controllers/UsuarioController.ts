import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from '../Services/JwtService';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { BcryptService } from '../Services/BcryptService';

export class UsuarioController {

    async index(request: FastifyRequest, reply: FastifyReply) {
        return reply.status(200).send({ date: 'index' });
    }

    async show(request: FastifyRequest, reply: FastifyReply) {
        return reply.status(200).send({ message: 'show' });
    }

    async store(request: FastifyRequest, reply: FastifyReply) {
        const usuario = z.object({
            nome: z.string(),
            email: z.string(),
            usuario: z.string(),
            senha: z.string()
        }).parse(request.body);

        const Senha = await BcryptService.hash(usuario.senha);

        const query = await prisma.usuario.create({
            data: {
                nome: usuario.nome,
                email: usuario.email,
                usuario: usuario.usuario,
                senha: Senha
            }
        });

        return reply.status(201).send({
            date: {
                id: query.id,
                nome: query.nome,
                email: query.email,
                usuario: query.usuario
            }
        });
    }


    async update(request: FastifyRequest, reply: FastifyReply) {
        return reply.status(200).send({ message: 'update' });
    }

    async destroy(request: FastifyRequest, reply: FastifyReply) {
        return reply.status(204).send();
    }


    async login(request: FastifyRequest, reply: FastifyReply) {
        const usuario = z.object({
            usuario: z.string(),
            senha: z.string()
        }).parse(request.body);

        const query = await prisma.usuario.findFirst({
            where: {
                usuario: usuario.usuario
            }
        });

        if (!query) {
            return reply.status(400).send({ message: 'Usuário não encontrado' });
        }

        const comparar = await BcryptService.comparar(usuario.senha, query.senha);

        if (!comparar) {
            return reply.status(400).send({ message: 'Senha inválida' });
        }

        const jwtGerar = JwtService.gerar({ sub: query.email });

        return reply.status(200).send({ token: jwtGerar });
    }


}