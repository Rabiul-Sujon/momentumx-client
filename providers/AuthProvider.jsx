// 'use client';

// import { createContext, useContext } from 'react';
// import { useSession } from '@/lib/auth-client';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const { data: session, isPending } = useSession();

//   const user = session?.user || null;

//   return (
//     <AuthContext.Provider value={{ user, isPending, session }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// export default AuthProvider;

// .......................................................

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import axios from '@/lib/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data: session, isPending } = useSession();
  const [dbUser, setDbUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchDbUser = async () => {
      if (session?.user?.email) {
        setUserLoading(true);
        try {
          const res = await axios.get('/api/users/profile');
          setDbUser(res.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setUserLoading(false);
        }
      } else {
        setDbUser(null);
      }
    };

    fetchDbUser();
  }, [session?.user?.email]);

  const user = dbUser ? {
    ...session?.user,
    role: dbUser.role,
    status: dbUser.status,
     image: dbUser.image || session?.user?.image || '',
  } : session?.user || null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isPending: isPending || userLoading, 
      session,
      dbUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;