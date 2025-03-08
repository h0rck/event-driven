export interface EmailNotification {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}