// middlewere de autentificacao 

import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtService } from '../Services/JwtService';

export class AutenticacaoMiddleware {

    static async autenticar(request: FastifyRequest, reply: FastifyReply) {
        if (!request.headers.authorization) {
            return reply.status(401).send({ message: 'Não autorizado' });
        }

        const token = request.headers.authorization.replace('Bearer ', '');

        const verificar = JwtService.validar(token);


        if (!verificar) {
            return reply.status(401).send({ message: 'Não autorizado' });
        }

        return verificar;
    }

}

