"use client";

import { Session } from "next-auth";
import { createContext, useContext } from "react";

interface SessionContextType {
  session: Session | null;
}
const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  session: Session | null;
  children: React.ReactNode;
}

const SessionProvider: React.FC<SessionProviderProps> = ({
  session,
  children,
}) => {
  const contextValue = { session };
  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

function useCustomSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export { SessionProvider, useCustomSession as useSession };

