'use client';

import { createContext, useContext } from 'react';
import { useSession } from '@/lib/auth-client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data: session, isPending } = useSession();

  const user = session?.user || null;

  return (
    <AuthContext.Provider value={{ user, isPending, session }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;