import { FastifyInstance } from "fastify";
import { gerenciadorDeDependencias } from "../config/GerenciadorDeDependencias.service";
import { UsuarioController } from "../app/Controllers/UsuarioController";
import { ICreateUsuarioUseCase } from "../app/UseCases/Usuario/CreateUsuarioUseCase";

export async function usuarioApi(app: FastifyInstance) {

    const createUsuarioUseCase = gerenciadorDeDependencias.obter('CreateUsuarioUseCase') as ICreateUsuarioUseCase;

    const usuarioController = new UsuarioController(createUsuarioUseCase);

    app.post('/login', (request, reply) => usuarioController.login(request, reply));
    app.get('/usuarios', (request, reply) => usuarioController.index(request, reply));
    app.get('/usuario/:id', (request, reply) => usuarioController.show(request, reply));
    app.post('/usuario', (request, reply) => usuarioController.store(request, reply));
    app.put('/usuario/:id', (request, reply) => usuarioController.update(request, reply));
    app.delete('/usuario/:id', (request, reply) => usuarioController.destroy(request, reply));

    app.post('/usuario/:id/reenviar-email-confirmacao', (request, reply) => usuarioController.resendConfirmationEmail(request, reply));
}