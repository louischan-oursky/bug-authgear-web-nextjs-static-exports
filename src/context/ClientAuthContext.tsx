'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface ClientAuthContextValue {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  startAuth: () => void
}

const ClientAuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (val: boolean) => {},
  startAuth: () => {}
});

function ClientAuthContextProviderInner({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const authgearInit = useCallback(async () => {
    try {
      const authgear = (await import("@authgear/web")).default;

      await authgear.configure({
        endpoint: `${process.env.NEXT_PUBLIC_AUTHGEAR_ENDPOINT}`,
        clientID: `${process.env.NEXT_PUBLIC_CLIENT_ID}`,
        sessionType: 'refresh_token',
      });

      // console.log({
      //   endpoint: `${process.env.NEXT_PUBLIC_AUTHGEAR_ENDPOINT}`,
      //   clientID: `${process.env.NEXT_PUBLIC_CLIENT_ID}`,
      //   sessionType: 'refresh_token',
      // });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const startAuth = useCallback(async () => {
    try {
      const {
        default: authgear,
        PromptOption,
      }= await import("@authgear/web");

      await authgear.startAuthentication({
        redirectURI: `${process.env.NEXT_PUBLIC_BASE_URL}/auth-redirect/`,
        prompt: PromptOption.Login,
      });
    } catch (e) {
      console.error(e);
    }
  }, [])

  useEffect(() => {
    authgearInit();
  }, [authgearInit]);

  const contextData: ClientAuthContextValue = {
    isLoggedIn,
    setIsLoggedIn,
    startAuth
  };

  return (
    <ClientAuthContext.Provider value={contextData}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export const ClientAuthContextProvider = dynamic(() => Promise.resolve(ClientAuthContextProviderInner), {
    ssr: false,
  });

export function useAppContextInner() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContext component');
  }
  return context;
}

