

export interface EmailNotification {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}

export interface BaseEvent {
    id: string;
    timestamp: Date;
    type: string;
}

export interface OrderEvent extends BaseEvent {
    type: 'order.created' | 'order.updated' | 'order.cancelled';
    data: {
        orderId: string;
        customerName: string;
        amount: number;
        items: number;
    };
}

export interface UserActivityEvent extends BaseEvent {
    type: 'user.login' | 'user.logout' | 'user.action';
    data: {
        userId: string;
        action: string;
        platform: string;
        location: string;
    };
}

export interface SystemEvent extends BaseEvent {
    type: 'system.alert' | 'system.status' | 'system.metric';
    data: {
        component: string;
        status: string;
        metric?: number;
        severity: 'low' | 'medium' | 'high';
    };
}
