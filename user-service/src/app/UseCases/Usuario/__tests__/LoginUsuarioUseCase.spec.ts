import { LoginUsuarioUseCase } from '../LoginUsuarioUseCase';
import { BcryptService } from '../../../Services/BcryptService';
import { UsuarioRepositoryMock } from '../../../Repositories/__mocks__/UsuarioRepositoryMock';

describe('LoginUsuarioUseCase', () => {
    let usuarioRepository: UsuarioRepositoryMock;
    let loginUsuarioUseCase: LoginUsuarioUseCase;

    beforeEach(() => {
        usuarioRepository = new UsuarioRepositoryMock();
        loginUsuarioUseCase = new LoginUsuarioUseCase(usuarioRepository);
    });

    it('deve fazer login com sucesso', async () => {
        const senha = await BcryptService.hash('123456');
        await usuarioRepository.create({
            nome: 'Test User',
            email: 'test@test.com',
            usuario: 'testuser',
            senha
        });

        const response = await loginUsuarioUseCase.execute({
            usuario: 'testuser',
            senha: '123456'
        });

        expect(response).toHaveProperty('token');
        expect(response.usuario).toHaveProperty('id');
        expect(response.usuario.usuario).toBe('testuser');
    });

    it('deve lançar erro com credenciais inválidas', async () => {
        await expect(loginUsuarioUseCase.execute({
            usuario: 'testuser',
            senha: '123456'
        })).rejects.toThrow('Credenciais inválidas');
    });
});
