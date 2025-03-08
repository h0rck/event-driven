import { PrismaClient } from "@prisma/client";
import { gerenciadorDeDependencias } from "./GerenciadorDeDependencias.service";
import { UsuarioRepository } from "../app/Repositories/UsuarioRepository";
import { RabbitMQService } from "../app/Services/RabbitMQService";
import { CreateUsuarioUseCase } from "../app/UseCases/Usuario/CreateUsuarioUseCase";



const prismaClient = new PrismaClient();

export function registrarDependencias() {

    const usuarioRepository = new UsuarioRepository(prismaClient);
    const rabbitMQService = new RabbitMQService();

    const createUsuarioUseCase = new CreateUsuarioUseCase(
        usuarioRepository,
        rabbitMQService
    );
    gerenciadorDeDependencias.registrar('CreateUsuarioUseCase', createUsuarioUseCase);
}
