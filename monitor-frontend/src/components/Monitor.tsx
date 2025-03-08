import React, { useEffect, useState } from 'react';
import { connectSocket, disconnectSocket, listenForUpdates } from '../services/socket';

const Monitor: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        connectSocket();

        listenForUpdates((updateData) => {
            setData(updateData);
        });

        return () => {
            disconnectSocket();
        };
    }, []);

    return (
        <div>
            <h1>Monitor</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Monitor;