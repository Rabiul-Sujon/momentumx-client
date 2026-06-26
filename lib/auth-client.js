// 

// ..........................................
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'https://momentumx-client.vercel.app',
  fetchOptions: {
    credentials: 'include',
    mode: 'cors',
  },
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;