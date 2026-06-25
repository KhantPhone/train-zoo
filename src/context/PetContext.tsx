import React, { createContext, useContext, useState } from 'react';
import { ANIMALS } from '@/data/animals';

type PetContextType = {
  activePetId: number;
  setActivePetId: (id: number) => void;
  userName: string;
  setUserName: (name: string) => void;
  petNames: Record<number, string>;
  setPetName: (id: number, name: string) => void;
};

const PetContext = createContext<PetContextType>({
  activePetId: 1,
  setActivePetId: () => {},
  userName: 'ポン',
  setUserName: () => {},
  petNames: {},
  setPetName: () => {},
});

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [activePetId, setActivePetId] = useState(1);
  const [userName, setUserName] = useState('ポン');
  const [petNames, setPetNamesState] = useState<Record<number, string>>(
    Object.fromEntries(ANIMALS.map(a => [a.id, a.name]))
  );
  const setPetName = (id: number, name: string) =>
    setPetNamesState(prev => ({ ...prev, [id]: name }));

  return (
    <PetContext.Provider value={{ activePetId, setActivePetId, userName, setUserName, petNames, setPetName }}>
      {children}
    </PetContext.Provider>
  );
}

export const usePet = () => useContext(PetContext);
