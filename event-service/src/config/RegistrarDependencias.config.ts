
import { gerenciadorDeDependencias } from "./GerenciadorDeDependencias.service";
import { RabbitMQService } from "../app/Services/RabbitMQService";
import { EventController } from "../app/Controllers/EventController";

export function registrarDependencias() {

    const rabbitMQService = new RabbitMQService();

    const eventController = new EventController(rabbitMQService);

    gerenciadorDeDependencias.registrar('EventController', eventController);
}
