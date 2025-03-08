import { FastifyRequest, FastifyReply } from 'fastify';
import { OrderEvent, UserActivityEvent, SystemEvent } from '../Interfaces/Events';
import { randomUUID } from 'crypto';
import { IMessageBroker } from '../Interfaces/IMessageBroker';

export class EventController {
    constructor(private messageBroker: IMessageBroker) { }

    private generateOrderEvent(): OrderEvent {
        const orderTypes = ['order.created', 'order.updated', 'order.cancelled'] as const;
        return {
            id: randomUUID(),
            timestamp: new Date(),
            type: orderTypes[Math.floor(Math.random() * orderTypes.length)],
            data: {
                orderId: randomUUID(),
                customerName: `Customer ${Math.floor(Math.random() * 1000)}`,
                amount: Number((Math.random() * 1000).toFixed(2)),
                items: Math.floor(Math.random() * 10) + 1
            }
        };
    }

    private generateUserActivityEvent(): UserActivityEvent {
        const activityTypes = ['user.login', 'user.logout', 'user.action'] as const;
        const platforms = ['web', 'mobile', 'desktop'];
        const locations = ['BR', 'US', 'EU', 'AS'];

        return {
            id: randomUUID(),
            timestamp: new Date(),
            type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
            data: {
                userId: randomUUID(),
                action: `action_${Math.floor(Math.random() * 100)}`,
                platform: platforms[Math.floor(Math.random() * platforms.length)],
                location: locations[Math.floor(Math.random() * locations.length)]
            }
        };
    }

    private generateSystemEvent(): SystemEvent {
        const systemTypes = ['system.alert', 'system.status', 'system.metric'] as const;
        const components = ['database', 'api', 'cache', 'queue'];
        const statuses = ['healthy', 'degraded', 'critical'];
        const severities = ['low', 'medium', 'high'] as const;

        return {
            id: randomUUID(),
            timestamp: new Date(),
            type: systemTypes[Math.floor(Math.random() * systemTypes.length)],
            data: {
                component: components[Math.floor(Math.random() * components.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                metric: Math.floor(Math.random() * 100),
                severity: severities[Math.floor(Math.random() * severities.length)]
            }
        };
    }

    async generateEvents(request: FastifyRequest, reply: FastifyReply) {
        try {
            await this.messageBroker.initialize();

            const orderEvent = this.generateOrderEvent();
            const userEvent = this.generateUserActivityEvent();
            const systemEvent = this.generateSystemEvent();

            await Promise.all([
                this.messageBroker.publishMessage('events.orders', orderEvent.type, orderEvent),
                this.messageBroker.publishMessage('events.users', userEvent.type, userEvent),
                this.messageBroker.publishMessage('events.system', systemEvent.type, systemEvent)
            ]);

            await this.messageBroker.closeConnection();

            return reply.status(200).send({
                message: 'Events generated successfully',
                events: {
                    order: orderEvent,
                    user: userEvent,
                    system: systemEvent
                }
            });

        } catch (error) {
            console.error('Error generating events:', error);
            return reply.status(500).send({
                message: 'Error generating events',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async generateEmailEvent(request: FastifyRequest, reply: FastifyReply) {
        try {
            await this.messageBroker.initialize();
            const emailEvent = {
                id: randomUUID(),
                timestamp: new Date(),
                type: 'email.notification',
                data: {
                    to: `user${Math.floor(Math.random() * 1000)}@example.com`,
                    subject: `Notification ${randomUUID().slice(0, 8)}`,
                    template: 'welcome_email',
                    variables: {
                        name: `User ${Math.floor(Math.random() * 1000)}`,
                        activationCode: randomUUID().slice(0, 6)
                    }
                }
            };

            await this.messageBroker.publishMessage('events.email', 'email.notification', emailEvent);
            await this.messageBroker.closeConnection();

            return reply.status(200).send({
                message: 'Email event generated successfully',
                event: emailEvent
            });
        } catch (error) {
            console.error('Error generating email event:', error);
            return reply.status(500).send({
                message: 'Error generating email event',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async generatePaymentEvent(request: FastifyRequest, reply: FastifyReply) {
        try {
            await this.messageBroker.initialize();
            const paymentEvent = {
                id: randomUUID(),
                timestamp: new Date(),
                type: 'payment.processed',
                data: {
                    transactionId: randomUUID(),
                    amount: Number((Math.random() * 1000).toFixed(2)),
                    currency: ['USD', 'EUR', 'BRL'][Math.floor(Math.random() * 3)],
                    status: ['approved', 'declined', 'pending'][Math.floor(Math.random() * 3)],
                    paymentMethod: ['credit_card', 'debit_card', 'pix'][Math.floor(Math.random() * 3)]
                }
            };

            await this.messageBroker.publishMessage('events.payments', 'payment.processed', paymentEvent);
            await this.messageBroker.closeConnection();

            return reply.status(200).send({
                message: 'Payment event generated successfully',
                event: paymentEvent
            });
        } catch (error) {
            console.error('Error generating payment event:', error);
            return reply.status(500).send({
                message: 'Error generating payment event',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async generateInventoryEvent(request: FastifyRequest, reply: FastifyReply) {
        try {
            await this.messageBroker.initialize();
            const inventoryEvent = {
                id: randomUUID(),
                timestamp: new Date(),
                type: 'inventory.updated',
                data: {
                    productId: randomUUID(),
                    sku: `SKU-${Math.floor(Math.random() * 10000)}`,
                    quantity: Math.floor(Math.random() * 100),
                    warehouse: `WH-${Math.floor(Math.random() * 5) + 1}`,
                    action: ['add', 'remove', 'adjust'][Math.floor(Math.random() * 3)]
                }
            };

            await this.messageBroker.publishMessage('events.inventory', 'inventory.updated', inventoryEvent);
            await this.messageBroker.closeConnection();

            return reply.status(200).send({
                message: 'Inventory event generated successfully',
                event: inventoryEvent
            });
        } catch (error) {
            console.error('Error generating inventory event:', error);
            return reply.status(500).send({
                message: 'Error generating inventory event',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}