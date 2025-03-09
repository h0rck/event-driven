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
        <div className="container mx-auto p-6">
            <header className="flex items-center justify-between mb-8 bg-white p-4 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-gray-800">RabbitMQ Monitor</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center">
                        Status: {state.isConnected ?
                            <span className="ml-2 text-green-600 font-semibold">Connected</span> :
                            <span className="ml-2 text-red-600 font-semibold">Disconnected</span>
                        }
                    </div>
                    <button
                        onClick={refreshData}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </header>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Test Events</h2>
                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={() => triggerTestEvent('email')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Trigger Email Event
                    </button>
                    <button
                        onClick={() => triggerTestEvent('payment')}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        Trigger Payment Event
                    </button>
                    <button
                        onClick={() => triggerTestEvent('inventory')}
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                    >
                        Trigger Inventory Event
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                {state.queues.length === 0 ? (
                    <p className="p-6 text-gray-500 text-center">No queues available</p>
                ) : (
                    <ul className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                        {state.queues.map((queue) => (
                            <li key={queue.name} className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">{queue.name}</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-600">Messages: {queue.messages}</p>
                                    <p className="text-gray-600">Consumers: {queue.consumers}</p>
                                    <p className={`font-medium ${queue.state === 'running' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {queue.state}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Monitor;