import { Usuario } from '@prisma/client';
import { BcryptService } from '../../Services/BcryptService';
import { UserCreatedEvent, EmailNotification } from '../../Interfaces/Events';
import { IMessageBroker } from '../../Interfaces/IMessageBroker';
import { IUsuarioRepository } from '../../Interfaces/IUsuarioRepository';

interface ICreateUsuarioDTO {
    nome: string;
    email: string;
    usuario: string;
    senha: string;
}

export interface ICreateUsuarioUseCase {
    execute(data: ICreateUsuarioDTO, sendWelcomeEmail?: boolean): Promise<Usuario>;
}

export class CreateUsuarioUseCase implements ICreateUsuarioUseCase {

    constructor(
        private usuarioRepository: IUsuarioRepository,
        private messagBroker: IMessageBroker

    ) { }


    async execute(data: ICreateUsuarioDTO, sendWelcomeEmail = false): Promise<Usuario> {
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


        const userCreatedEvent: UserCreatedEvent = {
            id: novoUsuario.id,
            email: novoUsuario.email,
            nome: novoUsuario.nome || '',
            usuario: novoUsuario.usuario,
            createdAt: novoUsuario.createdAt
        };

        await this.messagBroker.publishMessage('user.events', 'user.created', userCreatedEvent);


        if (sendWelcomeEmail) {
            const emailNotification: EmailNotification = {
                to: novoUsuario.email,
                subject: 'Bem-vindo ao nosso serviço!',
                template: 'welcome-email',
                data: {
                    nome: novoUsuario.nome,
                    usuario: novoUsuario.usuario
                }
            };

            await this.messagBroker.publishMessage('user.events', 'user.email.welcome', emailNotification);
        }

        return novoUsuario;
    }
}
