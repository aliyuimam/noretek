// src/contexts/SessionContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Example: fetch token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setSession({ token });
    }
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
