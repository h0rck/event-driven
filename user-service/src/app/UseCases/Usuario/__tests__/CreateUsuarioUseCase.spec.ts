import { CreateUsuarioUseCase } from '../CreateUsuarioUseCase';
import { UsuarioRepositoryMock } from '../../../Repositories/mocks/UsuarioRepositoryMock';

describe('CreateUsuarioUseCase', () => {
    let usuarioRepository: UsuarioRepositoryMock;
    let createUsuarioUseCase: CreateUsuarioUseCase;

    beforeEach(() => {
        usuarioRepository = new UsuarioRepositoryMock();
        createUsuarioUseCase = new CreateUsuarioUseCase(usuarioRepository);
    });

    it('deve criar um novo usuário', async () => {
        const data = {
            nome: 'Test User',
            email: 'test@test.com',
            usuario: 'testuser',
            senha: '123456'
        };

        const usuario = await createUsuarioUseCase.execute(data);

        expect(usuario).toHaveProperty('id');
        expect(usuario.email).toBe(data.email);
        expect(usuario.usuario).toBe(data.usuario);
    });

    it('deve lançar erro ao tentar criar usuário com email duplicado', async () => {
        const data = {
            nome: 'Test User',
            email: 'test@test.com',
            usuario: 'testuser',
            senha: '123456'
        };

        await createUsuarioUseCase.execute(data);

        await expect(createUsuarioUseCase.execute(data))
            .rejects
            .toThrow('Email já cadastrado');
    });
});
