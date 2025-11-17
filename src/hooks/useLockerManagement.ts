import { useState, useEffect } from 'react';

export interface Locker {
  id: string;
  lockerCode: string;
  brazilianAddress: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  customerEmail: string;
  status: 'active' | 'inactive';
  packagesReceived: number;
  createdAt: string;
}

const LOCKERS_STORAGE_KEY = 'customer_lockers';

const generateBrazilianAddress = (lockerCode: string) => {
  const streets = [
    'Av. Paulista',
    'Rua Augusta',
    'Av. Rebouças',
    'Rua Oscar Freire',
    'Av. Brigadeiro Faria Lima'
  ];

  const randomStreet = streets[Math.floor(Math.random() * streets.length)];
  const randomNumber = Math.floor(Math.random() * 2000) + 100;

  return {
    street: randomStreet,
    number: randomNumber.toString(),
    complement: `Casillero ${lockerCode}`,
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    country: 'Brasil'
  };
};

export const useLockerManagement = () => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCKERS_STORAGE_KEY);
    if (stored) {
      setLockers(JSON.parse(stored));
    }
  }, []);

  const saveLockers = (newLockers: Locker[]) => {
    localStorage.setItem(LOCKERS_STORAGE_KEY, JSON.stringify(newLockers));
    setLockers(newLockers);
  };

  const assignLocker = async (customerEmail: string): Promise<Locker> => {
    setIsAssigning(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lockerCode = `VE${Date.now().toString().slice(-6)}`;

    const locker: Locker = {
      id: `lock_${Date.now()}`,
      lockerCode,
      brazilianAddress: generateBrazilianAddress(lockerCode),
      customerEmail,
      status: 'active',
      packagesReceived: 0,
      createdAt: new Date().toISOString()
    };

    const newLockers = [locker, ...lockers];
    saveLockers(newLockers);
    setIsAssigning(false);

    return locker;
  };

  const getLockerByEmail = (email: string): Locker | undefined => {
    return lockers.find(locker => locker.customerEmail === email && locker.status === 'active');
  };

  const registerPackage = (lockerId: string) => {
    const newLockers = lockers.map(locker =>
      locker.id === lockerId
        ? { ...locker, packagesReceived: locker.packagesReceived + 1 }
        : locker
    );
    saveLockers(newLockers);
  };

  const deactivateLocker = (lockerId: string) => {
    const newLockers = lockers.map(locker =>
      locker.id === lockerId
        ? { ...locker, status: 'inactive' as const }
        : locker
    );
    saveLockers(newLockers);
  };

  const getAllLockers = () => lockers;

  const clearAllLockers = () => {
    localStorage.removeItem(LOCKERS_STORAGE_KEY);
    setLockers([]);
  };

  return {
    lockers,
    isAssigning,
    assignLocker,
    getLockerByEmail,
    registerPackage,
    deactivateLocker,
    getAllLockers,
    clearAllLockers
  };
};
