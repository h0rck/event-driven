import { FastifyInstance } from "fastify";
import { UsuarioController } from "../app/Controllers/UsuarioController";

export async function usuarioApi(app: FastifyInstance) {

    app.post('/login', (request, reply) => new UsuarioController().login(request, reply));

    app.get('/usuario', (request, reply) => new UsuarioController().index(request, reply));

    app.get('/usuario/:id', (request, reply) => new UsuarioController().show(request, reply));

    app.post('/usuario', (request, reply) => new UsuarioController().store(request, reply));

    app.put('/usuario/:id', (request, reply) => new UsuarioController().update(request, reply));

    app.delete('/usuario/:id', (request, reply) => new UsuarioController().destroy(request, reply));

}