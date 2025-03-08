export interface SocketMessage {
    type: string;
    payload: any;
}

export interface Notification {
    id: string;
    message: string;
    timestamp: Date;
}