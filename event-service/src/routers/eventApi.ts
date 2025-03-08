import { FastifyInstance } from "fastify";
import { gerenciadorDeDependencias } from "../config/GerenciadorDeDependencias.service";
import { EventController } from "../app/Controllers/EventController";

export async function eventApi(app: FastifyInstance) {
    const eventController = gerenciadorDeDependencias.obter<EventController>('EventController');


    app.post('/events/email', eventController.generateEmailEvent.bind(eventController));
    app.post('/events/payment', eventController.generatePaymentEvent.bind(eventController));
    app.post('/events/inventory', eventController.generateInventoryEvent.bind(eventController));


    app.get('', async (request, reply) => {
        return reply.status(200).send({ status: 'ok', message: 'Event service is running' });
    });
}