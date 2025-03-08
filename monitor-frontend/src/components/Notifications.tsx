import React, { useEffect, useState } from 'react';
import { listenForNotifications } from '../services/socket';

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        listenForNotifications((notification) => {
            setNotifications(prev => [...prev, notification]);
        });
    }, []);

    return (
        <div>
            <h1>Notifications</h1>
            {notifications.map((notification, index) => (
                <div key={index}>
                    {JSON.stringify(notification)}
                </div>
            ))}
        </div>
    );
};

export default Notifications;