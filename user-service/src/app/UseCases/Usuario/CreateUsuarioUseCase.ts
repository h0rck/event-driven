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
    sendWelcomeEmail?: boolean;
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

        // Sempre publica o evento de usuário criado
        const userCreatedEvent: UserCreatedEvent = {
            id: novoUsuario.id,
            email: novoUsuario.email,
            nome: novoUsuario.nome || '',
            usuario: novoUsuario.usuario,
            createdAt: novoUsuario.createdAt
        };

        await RabbitMQService.publishMessage('user.events', 'user.created', userCreatedEvent);

        // Só envia email se sendWelcomeEmail for true
        if (data.sendWelcomeEmail !== false) {
            const emailNotification: EmailNotification = {
                to: novoUsuario.email,
                subject: 'Bem-vindo ao nosso serviço!',
                template: 'welcome-email',
                data: {
                    nome: novoUsuario.nome,
                    usuario: novoUsuario.usuario
                }
            };

            await RabbitMQService.publishMessage('user.events', 'user.email.welcome', emailNotification);
        }

        console.log('RabbitMQService methods:', Object.keys(RabbitMQService));
        console.log('Messages after operation:', RabbitMQService.getPublishedMessages());

        return novoUsuario;
    }
}
