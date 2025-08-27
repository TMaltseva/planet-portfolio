import { createContext, useContext, ReactNode } from 'react';

interface ModalContextType {
  showModal: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
  showModal: boolean;
}

export function ModalProvider({ children, showModal }: ModalProviderProps) {
  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}
