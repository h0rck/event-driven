
import { IUsuarioRepository } from '../../Interfaces/IUsuarioRepository';
import { BcryptService } from '../../Services/BcryptService';
import { JwtService } from '../../Services/JwtService';

interface ILoginUsuarioDTO {
    usuario: string;
    senha: string;
}

interface ILoginResponse {
    token: string;
    usuario: {
        id: number;
        nome: string;
        email: string;
        usuario: string;
    }
}

export class LoginUsuarioUseCase {
    constructor(private usuarioRepository: IUsuarioRepository) { }

    async execute(data: ILoginUsuarioDTO): Promise<ILoginResponse> {
        const usuario = await this.usuarioRepository.findByUsuario(data.usuario)
            || await this.usuarioRepository.findByEmail(data.usuario);

        if (!usuario) {
            throw new Error('Credenciais inválidas');
        }

        const senhaValida = await BcryptService.comparar(data.senha, usuario.senha);
        if (!senhaValida) {
            throw new Error('Credenciais inválidas');
        }

        const token = JwtService.gerar({
            sub: usuario.email,
            userId: usuario.id,
            username: usuario.usuario
        });

        return {
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome || '',
                email: usuario.email,
                usuario: usuario.usuario
            }
        };
    }
}
