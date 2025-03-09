import React, { useEffect, useState } from 'react';
import { connectSocket, getQueues, cleanup } from '../services/socket';
import { customFetch } from '../utils/api';

interface QueueData {
    name: string;
    messages: number;
    consumers: number;
    state: 'running' | 'stopped';
}

interface MonitorState {
    queues: QueueData[];
    isConnected: boolean;
    error: string | null;
}

interface SocketError extends Error {
    message: string;
    data?: any;
}

interface CustomEvent extends Event {
    detail: SocketError;
}

const initialState: MonitorState = {
    queues: [],
    isConnected: false,
    error: null
};

const Monitor: React.FC = () => {
    const [state, setState] = useState<MonitorState>(initialState);

    useEffect(() => {
        try {
            connectSocket();

            getQueues((queues) => {
                setState(prev => ({
                    ...prev,
                    queues: queues || [],
                    isConnected: true,
                    error: null
                }));
            });

            // Listen for connection errors
            const handleError = (event: CustomEvent) => {
                setState(prev => ({
                    ...prev,
                    isConnected: false,
                    error: `Connection error: ${event.detail.message}`
                }));
            };

            window.addEventListener('socket:error', handleError as EventListener);

            return () => {
                cleanup();
                window.removeEventListener('socket:error', handleError as EventListener);
            };
        } catch (error) {
            setState(prev => ({
                ...prev,
                isConnected: false,
                error: `Failed to initialize connection: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
        }
    }, []);

    const refreshData = () => {
        try {
            connectSocket();
            getQueues((queues) => {
                setState(prev => ({
                    ...prev,
                    queues: queues || [],
                    isConnected: true,
                    error: null
                }));
            });
        } catch (error) {
            setState(prev => ({
                ...prev,
                isConnected: false,
                error: `Failed to refresh data: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
        }
    };

    const triggerTestEvent = async (eventType: 'email' | 'payment' | 'inventory') => {
        try {
            await customFetch(`events/${eventType}`, {
                method: 'POST',
            });
            console.log(`${eventType} event triggered successfully`);
        } catch (error) {
            console.error(`Error triggering ${eventType} event:`, error);

        }
    };

    if (state.error) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
                <p className="text-gray-700 mb-4">{state.error}</p>
                <button
                    onClick={refreshData}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen"> {/* p-6 -> p-4 */}
            {/* Header Principal */}
            <header className="mb-4 bg-white p-4 rounded-lg shadow-lg border border-gray-100"> {/* mb-8 -> mb-4, p-6 -> p-4 */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">Monitor de Eventos RabbitMQ</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                            <span className="mr-2">Status:</span>
                            {state.isConnected ? (
                                <div className="flex items-center text-green-600">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                    Conectado
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    Desconectado
                                </div>
                            )}
                        </div>
                        <button
                            onClick={refreshData}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Atualizar
                        </button>
                    </div>
                </div>
                <p className="text-gray-600">
                    Sistema de monitoramento em tempo real de filas e eventos do RabbitMQ
                </p>
            </header>

            {/* Seção de Eventos de Teste */}
            <section className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 mb-4"> {/* p-6 -> p-4, mb-8 -> mb-4 */}
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gerador de Eventos de Teste</h2>
                <p className="text-gray-600 mb-6">
                    Use os botões abaixo para simular diferentes tipos de eventos no sistema.
                    Cada evento será processado pelos respectivos microsserviços.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                        <h3 className="font-semibold text-lg mb-2 text-blue-800">Evento de Email</h3>
                        <p className="text-blue-600 text-sm mb-4">
                            Simula o envio de um email através do microsserviço de email
                        </p>
                        <button
                            onClick={() => triggerTestEvent('email')}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Disparar Evento de Email
                        </button>
                    </div>

                    <div className="p-4 border rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                        <h3 className="font-semibold text-lg mb-2 text-orange-800">Evento de Inventário</h3>
                        <p className="text-orange-600 text-sm mb-4">
                            Simula uma atualização no inventário do sistema
                        </p>
                        <button
                            onClick={() => triggerTestEvent('inventory')}
                            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Disparar Evento de Inventário
                        </button>
                    </div>

                    <div className="p-4 border rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                        <h3 className="font-semibold text-lg mb-2 text-green-800">Evento de Pagamento</h3>
                        <p className="text-green-600 text-sm mb-4">
                            Simula uma transação de pagamento no sistema
                        </p>
                        <button
                            onClick={() => triggerTestEvent('payment')}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Disparar Evento de Pagamento
                        </button>
                    </div>


                </div>
            </section>

            {/* Monitor de Filas */}
            <section className="bg-white rounded-lg shadow-lg border border-gray-100">
                <div className="p-4 border-b"> {/* p-6 -> p-4 */}
                    <h2 className="text-2xl font-semibold text-gray-800">Monitor de Filas</h2>
                    <p className="text-gray-600 mb-4">
                        Visualização em tempo real do estado das filas no RabbitMQ
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex flex-col">
                            <span className="text-blue-800 font-semibold mb-2">Mensagens</span>
                            <p className="text-sm text-blue-600">
                                Número total de mensagens na fila aguardando processamento.
                                Quanto maior este número, mais mensagens estão em espera.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-800 font-semibold mb-2">Consumidores</span>
                            <p className="text-sm text-blue-600">
                                Quantidade de serviços ativamente conectados e processando mensagens desta fila.
                                Zero consumidores significa que ninguém está processando as mensagens.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-800 font-semibold mb-2">Estado</span>
                            <p className="text-sm text-blue-600">
                                Indica se a fila está 'Ativa' (processando normalmente) ou
                                'Parada' (sem processar mensagens por algum problema).
                            </p>
                        </div>
                    </div>
                </div>

                {state.queues.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500">Nenhuma fila disponível no momento</p>
                    </div>
                ) : (
                    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3"> {/* gap-6 -> gap-4, p-6 -> p-4 */}
                        {state.queues.map((queue) => (
                            <div key={queue.name} className="bg-gray-50 rounded-lg p-4 border hover:border-blue-300 transition-colors"> {/* p-6 -> p-4 */}
                                <h3 className="font-semibold text-xl mb-4 text-gray-800">{queue.name}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Mensagens:</span>
                                        <span className="font-semibold">{queue.messages}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Consumidores:</span>
                                        <span className="font-semibold">{queue.consumers}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Estado:</span>
                                        <span className={`font-semibold px-3 py-1 rounded-full ${queue.state === 'running'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {queue.state === 'running' ? 'Ativo' : 'Parado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Monitor;