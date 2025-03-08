export interface UserCreatedEvent {
    id: number;
    email: string;
    nome: string;
    usuario: string;
    createdAt: Date;
}

export interface EmailNotification {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}
