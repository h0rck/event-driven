import { CreateUsuarioUseCase } from '../CreateUsuarioUseCase';
import { UsuarioRepositoryMock } from '../../../Repositories/__mocks__/UsuarioRepositoryMock';


interface RabbitMessage {
    exchange: string;
    routingKey: string;
    message: any;
}

const messages: RabbitMessage[] = [];

const RabbitMQService = {
    initialize: jest.fn().mockResolvedValue(undefined),

    publishMessage: jest.fn().mockImplementation((exchange, routingKey, message) => {
        messages.push({ exchange, routingKey, message });
        return Promise.resolve();
    }),

    getPublishedMessages: jest.fn().mockImplementation(() => {
        return [...messages];
    }),

    clearMessages: jest.fn().mockImplementation(() => {
        messages.length = 0;
    })
};

jest.mock('../../../Services/RabbitMQService', () => ({
    RabbitMQService
}));

describe('CreateUsuarioUseCase', () => {
    let usuarioRepository: UsuarioRepositoryMock;
    let createUsuarioUseCase: CreateUsuarioUseCase;

    beforeEach(async () => {
        // Limpar mensagens no início de cada teste
        messages.length = 0;
        RabbitMQService.clearMessages();

        usuarioRepository = new UsuarioRepositoryMock();
        createUsuarioUseCase = new CreateUsuarioUseCase(usuarioRepository);
    });

    afterEach(() => {
        RabbitMQService.clearMessages();
        jest.clearAllMocks();
    });

    it('deve criar um usuário com disparo de email (comportamento padrão)', async () => {
        const data = {
            nome: 'Test User',
            email: 'test@test.com',
            usuario: 'testuser',
            senha: '123456'
        };

        const usuario = await createUsuarioUseCase.execute(data);

        expect(usuario).toHaveProperty('id');
        const messages = RabbitMQService.getPublishedMessages();

        // Verifica se foram publicados dois eventos
        expect(messages).toHaveLength(2);

        // Verifica evento de usuário criado
        expect(messages[0]).toMatchObject({
            exchange: 'user.events',
            routingKey: 'user.created',
            message: {
                id: usuario.id,
                email: data.email,
                usuario: data.usuario
            }
        });

        // Verifica evento de email
        expect(messages[1]).toMatchObject({
            exchange: 'user.events',
            routingKey: 'user.email.welcome',
            message: {
                to: data.email,
                template: 'welcome-email'
            }
        });

        await RabbitMQService.publishMessage('user.events', 'user.created', {
            id: usuario.id,
            email: data.email,
            usuario: data.usuario
        });
    });

    it('deve criar um usuário sem disparo de email quando sendWelcomeEmail é false', async () => {
        const data = {
            nome: 'Test User 2',
            email: 'test2@test.com',
            usuario: 'testuser2',
            senha: '123456',
            sendWelcomeEmail: false
        };

        console.log('Antes de execute - mensagens:', RabbitMQService.getPublishedMessages());
        const usuario = await createUsuarioUseCase.execute(data);
        console.log('Depois de execute - mensagens:', RabbitMQService.getPublishedMessages());

        expect(usuario).toHaveProperty('id');
        const messages = RabbitMQService.getPublishedMessages();
        console.log('Messages obtidas para teste:', messages);

        // Verifica se foi publicado apenas um evento
        expect(messages).toHaveLength(1);

        // Verifica se é apenas o evento de usuário criado
        expect(messages[0]).toMatchObject({
            exchange: 'user.events',
            routingKey: 'user.created',
            message: {
                id: usuario.id,
                email: data.email,
                usuario: data.usuario
            }
        });

        // Verifica que não existe evento de email
        expect(messages.find((m: RabbitMessage) => m.routingKey === 'user.email.welcome')).toBeUndefined();
    });

    it('deve lançar erro ao tentar criar usuário com email duplicado', async () => {
        const data = {
            nome: 'Test User',
            email: 'test@test.com',
            usuario: 'testuser',
            senha: '123456'
        };

        await createUsuarioUseCase.execute(data);

        const messages = RabbitMQService.getPublishedMessages();

        await expect(createUsuarioUseCase.execute(data))
            .rejects
            .toThrow('Email já cadastrado');
    });
});
