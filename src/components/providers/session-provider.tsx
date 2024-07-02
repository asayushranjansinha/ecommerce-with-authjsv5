"use client";

import React, { useContext } from "react";
import { createContext, ReactNode, useEffect, useState } from "react";

// Create context
export const SessionContext = createContext<any>({});

// provider
export const SessionProvider = ({
  children,
  propsData,
}: {
  children: ReactNode;
  propsData: any;
}) => {
  const [session, setSession] = useState({});

  useEffect(() => {
    async function fetchSession() {
      setSession(propsData);
    }
    fetchSession();
  }, [propsData]);
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

// hook to use session
export const useCustomSession = () => {
  const session = useContext(SessionContext);
  return session;
};

