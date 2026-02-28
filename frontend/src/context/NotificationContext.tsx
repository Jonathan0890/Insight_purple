import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    severity: 'info' | 'warning' | 'error' | 'success';
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Cargar notificaciones iniciales desde localStorage o usar datos mock
    useEffect(() => {
        const stored = localStorage.getItem('notifications');
        if (stored) {
            setNotifications(JSON.parse(stored));
        } else {
            // Notificaciones iniciales de ejemplo
            const initial: Notification[] = [
                {
                    id: '1',
                    title: 'Stock crítico: Mouse Ergónico',
                    description: '8 unidades',
                    time: 'Hace 12 min',
                    severity: 'error',
                    read: false,
                },
                {
                    id: '2',
                    title: 'CPC de "Brand Awareness Q1" supera umbral',
                    description: '$0.85',
                    time: 'Hace 45 min',
                    severity: 'warning',
                    read: false,
                },
                {
                    id: '3',
                    title: 'Stock crítico: Cable HDMI 2.1',
                    description: '5 unidades',
                    time: 'Hace 1h',
                    severity: 'error',
                    read: false,
                },
            ];
            setNotifications(initial);
            localStorage.setItem('notifications', JSON.stringify(initial));
        }
    }, []);

    // Simular nuevas notificaciones cada 30 segundos (solo para demo)
    useEffect(() => {
        const interval = setInterval(() => {
            const newNotification: Notification = {
                id: Date.now().toString(),
                title: 'Nueva alerta simulada',
                description: 'Esto es una notificación de prueba',
                time: 'Ahora mismo',
                severity: Math.random() > 0.5 ? 'info' : 'warning',
                read: false,
            };
            setNotifications(prev => [newNotification, ...prev]);
            localStorage.setItem('notifications', JSON.stringify([newNotification, ...notifications]));
        }, 30000); // cada 30 segundos

        return () => clearInterval(interval);
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            time: 'Ahora mismo',
            read: false,
        };
        const updated = [newNotification, ...notifications];
        setNotifications(updated);
        localStorage.setItem('notifications', JSON.stringify(updated));
    };

    const markAsRead = (id: string) => {
        const updated = notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        setNotifications(updated);
        localStorage.setItem('notifications', JSON.stringify(updated));
    };

    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
        localStorage.setItem('notifications', JSON.stringify(updated));
    };

    const clearNotification = (id: string) => {
        const updated = notifications.filter(n => n.id !== id);
        setNotifications(updated);
        localStorage.setItem('notifications', JSON.stringify(updated));
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};