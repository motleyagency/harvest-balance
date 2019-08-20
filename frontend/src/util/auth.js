import React, { useState, useEffect, useContext, createContext } from 'react';
import storage, { storageTokenKey, storageUserKey } from './storage';
import { useRouter } from './router';
import { getAuthUrl, handleAuth, account } from './harvestBalance';

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... update when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  // Try to validate the auth code if we got one
  const {
    query: { code, scope },
    push,
  } = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(!!code);
  const [user, setUser] = useState(() => storage.get(storageUserKey));
  const [token, setToken] = useState(() => storage.get(storageTokenKey));

  const signin = () => {
    return getAuthUrl().then(res => (window.location = res.url));
  };

  const signout = () => {
    setToken(null);
    setUser(null);
    storage.set(storageTokenKey, null);
    storage.set(storageUserKey, null);
  };

  useEffect(() => {
    if (code) {
      handleAuth(code, scope)
        .then(({ harvest_token, expires_in }) => {
          setToken(harvest_token);
          storage.set(storageTokenKey, harvest_token);
          return account();
        })
        .then(accountRes => {
          setUser(accountRes);
          storage.set(storageUserKey, accountRes);
        })
        .then(() => {
          push('/');
          setIsAuthenticating(false);
        });
    }
  }, [code, push, scope]);

  return {
    isAuthenticating,
    user,
    token,
    signin,
    signout,
  };
}
