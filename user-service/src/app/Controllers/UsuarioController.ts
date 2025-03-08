import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from '../Services/JwtService';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { BcryptService } from '../Services/BcryptService';
import { ICreateUsuarioUseCase } from '../UseCases/Usuario/CreateUsuarioUseCase';
import { IMessageBroker } from '../Interfaces/IMessageBroker';
import { EmailNotification } from '../Interfaces/Events';

export class UsuarioController {

    constructor(
        private createUsuarioUseCase: ICreateUsuarioUseCase,
        private messageBroker: IMessageBroker
    ) { }

    async index(request: FastifyRequest, reply: FastifyReply) {
        return reply.status(200).send({ date: 'index' });
    }

    async show(request: FastifyRequest, reply: FastifyReply) {
        return reply.status(200).send({ message: 'show' });
    }

    async store(request: FastifyRequest, reply: FastifyReply) {
        const usuarioSchema = z.object({
            nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
            email: z.string().email('Email inválido'),
            usuario: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres'),
            senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
        });

        const result = usuarioSchema.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({
                message: 'Dados inválidos',
                errors: result.error.errors.map(error => ({
                    field: error.path.join('.'),
                    message: error.message
                }))
            });
        }


        const { nome, email, usuario, senha } = result.data;


        const novoUsuario = await this.createUsuarioUseCase.execute({ nome, email, usuario, senha }, true);

        return reply.status(201).send({
            message: 'Usuário criado com sucesso',
            data: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                usuario: novoUsuario.usuario
            }
        });

    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        return reply.status(200).send({ message: 'update' });
    }

    async destroy(request: FastifyRequest, reply: FastifyReply) {
        return reply.status(204).send();
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        try {
            const loginSchema = z.object({
                usuario: z.string().min(1, 'Usuário é obrigatório'),
                senha: z.string().min(1, 'Senha é obrigatória')
            });

            const credentials = loginSchema.parse(request.body);

            const usuario = await prisma.usuario.findFirst({
                where: {
                    OR: [
                        { usuario: credentials.usuario },
                        { email: credentials.usuario }
                    ]
                }
            });

            if (!usuario) {
                return reply.status(401).send({
                    message: 'Credenciais inválidas'
                });
            }

            const senhaValida = await BcryptService.comparar(credentials.senha, usuario.senha);

            if (!senhaValida) {
                return reply.status(401).send({
                    message: 'Credenciais inválidas'
                });
            }

            const token = JwtService.gerar({
                sub: usuario.email,
                userId: usuario.id,
                username: usuario.usuario
            });

            return reply.status(200).send({
                message: 'Login realizado com sucesso',
                data: {
                    token,
                    usuario: {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        usuario: usuario.usuario
                    }
                }
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    message: 'Dados inválidos',
                    errors: error.errors
                });
            }
            return reply.status(500).send({
                message: 'Erro interno do servidor'
            });
        }
    }

    async resendConfirmationEmail(request: FastifyRequest, reply: FastifyReply) {
        const emailSchema = z.object({
            email: z.string().email('E-mail inválido')
        });

        const result = emailSchema.safeParse(request.body);
        if (!result.success) {
            return reply.status(400).send({
                message: 'Dados inválidos',
                errors: result.error.errors
            });
        }

        try {
            const { email } = result.data;

            const usuario = await prisma.usuario.findFirst({
                where: { email }
            });

            if (!usuario) {
                return reply.status(404).send({
                    message: 'Usuário não encontrado'
                });
            }

            const emailNotification: EmailNotification = {
                to: usuario.email,
                subject: 'Confirme seu e-mail',
                template: 'confirm-email',
                data: {
                    nome: usuario.nome,
                    usuario: usuario.usuario
                }
            };

            await this.messageBroker.publishMessage('user.events', 'user.email.confirmation', emailNotification);

            return reply.status(200).send({
                message: `E-mail de confirmação reenviado para ${email}`
            });
        } catch (error) {
            return reply.status(500).send({
                message: 'Erro ao reenviar e-mail de confirmação'
            });
        }
    }

    async resendResetPasswordEmail(request: FastifyRequest, reply: FastifyReply) {
        const emailSchema = z.object({
            email: z.string().email('E-mail inválido')
        });

        const result = emailSchema.safeParse(request.body);
        if (!result.success) {
            return reply.status(400).send({
                message: 'Dados inválidos',
                errors: result.error.errors
            });
        }

        const { email } = result.data;
        // Aqui você chamaria seu serviço de e-mail para reenviar o link de redefinição de senha
        // await EmailService.enviarEmailRedefinicaoSenha(email);

        return reply.status(200).send({
            message: `E-mail de redefinição de senha reenviado para ${email}`
        });
    }
}