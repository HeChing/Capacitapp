// ✅ CREAR: src/services/authService.js

// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   signOut,
//   sendPasswordResetEmail,
//   updateProfile,
// } from 'firebase/auth';
// import { auth } from './firebaseConfig';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Login con email
  async loginWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: this.getErrorMessage(error.code) };
    }
  },

  // Login con Google
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: this.getErrorMessage(error.code) };
    }
  },

  // Registro
  async register(email, password, displayName = '') {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: this.getErrorMessage(error.code) };
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: this.getErrorMessage(error.code) };
    }
  },

  // Mensajes de error amigables
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No existe una cuenta con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Email inválido',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/email-already-in-use': 'Ya existe una cuenta con este email',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión',
      'auth/popup-closed-by-user': 'Proceso cancelado',
      'auth/invalid-credential': 'Credenciales inválidas',
    };

    return errorMessages[errorCode] || 'Error inesperado. Intenta nuevamente';
  },
};
