import { useState, useEffect } from 'react';

export interface PreAlert {
  id: string;
  lockerId: string;
  lockerCode: string;
  customerEmail: string;
  trackingNumber: string;
  carrier: string;
  productDescription: string;
  estimatedArrival: string;
  status: 'pending' | 'received' | 'forwarded';
  createdAt: string;
  receivedAt?: string;
}

const PREALERTS_STORAGE_KEY = 'package_prealerts';

export const usePreAlerts = () => {
  const [preAlerts, setPreAlerts] = useState<PreAlert[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PREALERTS_STORAGE_KEY);
    if (stored) {
      setPreAlerts(JSON.parse(stored));
    }
  }, []);

  const savePreAlerts = (newPreAlerts: PreAlert[]) => {
    localStorage.setItem(PREALERTS_STORAGE_KEY, JSON.stringify(newPreAlerts));
    setPreAlerts(newPreAlerts);
  };

  const createPreAlert = async (
    lockerId: string,
    lockerCode: string,
    customerEmail: string,
    trackingNumber: string,
    carrier: string,
    productDescription: string
  ): Promise<PreAlert> => {
    setIsCreating(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + Math.floor(Math.random() * 10) + 5);

    const preAlert: PreAlert = {
      id: `prealert_${Date.now()}`,
      lockerId,
      lockerCode,
      customerEmail,
      trackingNumber,
      carrier,
      productDescription,
      estimatedArrival: arrivalDate.toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const newPreAlerts = [preAlert, ...preAlerts];
    savePreAlerts(newPreAlerts);
    setIsCreating(false);

    return preAlert;
  };

  const updatePreAlertStatus = (
    preAlertId: string,
    status: PreAlert['status'],
    receivedAt?: string
  ) => {
    const newPreAlerts = preAlerts.map(alert =>
      alert.id === preAlertId
        ? { ...alert, status, receivedAt: receivedAt || alert.receivedAt }
        : alert
    );
    savePreAlerts(newPreAlerts);
  };

  const getPreAlertsByLocker = (lockerId: string) => {
    return preAlerts.filter(alert => alert.lockerId === lockerId);
  };

  const getPreAlertsByEmail = (email: string) => {
    return preAlerts.filter(alert => alert.customerEmail === email);
  };

  const deletePreAlert = (preAlertId: string) => {
    const newPreAlerts = preAlerts.filter(alert => alert.id !== preAlertId);
    savePreAlerts(newPreAlerts);
  };

  const clearAllPreAlerts = () => {
    localStorage.removeItem(PREALERTS_STORAGE_KEY);
    setPreAlerts([]);
  };

  return {
    preAlerts,
    isCreating,
    createPreAlert,
    updatePreAlertStatus,
    getPreAlertsByLocker,
    getPreAlertsByEmail,
    deletePreAlert,
    clearAllPreAlerts,
  };
};
