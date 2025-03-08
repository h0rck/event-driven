import { Usuario } from '@prisma/client';
import { IUsuarioRepository } from '../../Repositories/UsuarioRepository';
import { BcryptService } from '../../Services/BcryptService';
import { RabbitMQService } from '../../Services/RabbitMQService';
import { UserCreatedEvent, EmailNotification } from '../../Interfaces/Events';

interface ICreateUsuarioDTO {
    nome: string;
    email: string;
    usuario: string;
    senha: string;
}

export class CreateUsuarioUseCase {
    constructor(private usuarioRepository: IUsuarioRepository) { }

    async execute(data: ICreateUsuarioDTO): Promise<Usuario> {
        const existingUser = await this.usuarioRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        const existingUsername = await this.usuarioRepository.findByUsuario(data.usuario);
        if (existingUsername) {
            throw new Error('Nome de usuário já cadastrado');
        }

        const senha = await BcryptService.hash(data.senha);

        const novoUsuario = await this.usuarioRepository.create({
            ...data,
            senha
        });

        // Enviar evento de usuário criado
        const userCreatedEvent: UserCreatedEvent = {
            id: novoUsuario.id,
            email: novoUsuario.email,
            nome: novoUsuario.nome || '',
            usuario: novoUsuario.usuario,
            createdAt: novoUsuario.createdAt
        };

        // Enviar notificação de email
        const emailNotification: EmailNotification = {
            to: novoUsuario.email,
            subject: 'Bem-vindo ao nosso serviço!',
            template: 'welcome-email',
            data: {
                nome: novoUsuario.nome,
                usuario: novoUsuario.usuario
            }
        };

        try {
            await RabbitMQService.publishMessage('user.events', 'user.created', userCreatedEvent);
            await RabbitMQService.publishMessage('user.events', 'user.email.welcome', emailNotification);
        } catch (error) {
            console.error('Erro ao enviar eventos:', error);
            // Não vamos lançar o erro para não impedir a criação do usuário
        }

        return novoUsuario;
    }
}
