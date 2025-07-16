// ✅ VERIFICAR: src/services/authService.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Login con email y contraseña
  loginWithEmail: async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      console.error('Error en loginWithEmail:', error);
      return { user: null, error: error.message };
    }
  },

  // Login con Google
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error) {
      console.error('Error en loginWithGoogle:', error);
      return { user: null, error: error.message };
    }
  },

  // Registro
  register: async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Actualizar el perfil con el nombre
      if (displayName) {
        await updateProfile(result.user, {
          displayName: displayName,
        });
      }

      return { user: result.user, error: null };
    } catch (error) {
      console.error('Error en register:', error);
      return { user: null, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      console.error('Error en logout:', error);
      return { error: error.message };
    }
  },
};
