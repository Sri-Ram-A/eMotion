import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from "expo-secure-store";

type ContextType = {
  id: string | null;
  setId: (id: string | null) => void;
};

export const IDContext = createContext<ContextType>({id:"",setId:()=>{}});
export const IDProvider = ({ children }: { children: React.ReactNode }) => {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const loadId = async () => {
      const storedId = await SecureStore.getItemAsync("id");
      console.info(`[CONTEXT] ID: ${id}`)
      setId(storedId);
    };
    loadId();
  }, []);

  return (
    <IDContext.Provider value={{id,setId}}>
      {children}
    </IDContext.Provider>
  );
};