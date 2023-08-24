import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { auth } from './config.js';
export const login = async ({ email, password }) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch ({ code }) {
    if (code === 'auth/wrong-password') {
      return { response: 'error', msg: 'Contraseña incorrecta' };
    }
    if (code === 'auth/user-not-found') {
      return {
        response: 'error',
        msg: 'Dirección de correo no encontrada',
      };
    }
    return { response: 'error', msg: 'Algo salió mal, intenta nuevamente' };
  }
};

export const logout = (authentication) => signOut(authentication);
