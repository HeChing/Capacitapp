import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const userService = {
  // Crear perfil de usuario después del registro
  async createUserProfile(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      const defaultData = {
        uid: userId,
        email: userData.email,
        displayName: userData.displayName || '',
        role: 'empleado',
        createdAt: new Date(),
        isActive: true,
        lastLogin: new Date(),
        photoURL: userData.photoURL || null,
        department: '',
        position: '',
      };

      await setDoc(userRef, { ...defaultData, ...userData });
      return { user: { ...defaultData, ...userData }, error: null };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { user: null, error: error.message };
    }
  },

  // Obtener perfil de usuario
  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { user: { id: userSnap.id, ...userSnap.data() }, error: null };
      } else {
        return { user: null, error: 'Usuario no encontrado' };
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { user: null, error: error.message };
    }
  },

  // Actualizar perfil de usuario
  async updateUserProfile(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: new Date(),
      });
      return { error: null };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { error: error.message };
    }
  },

  // Obtener todos los usuarios (solo admin)
  async getAllUsers() {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);

      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return { users, error: null };
    } catch (error) {
      console.error('Error getting all users:', error);
      return { users: [], error: error.message };
    }
  },

  // Cambiar rol de usuario (solo admin)
  async changeUserRole(userId, newRole) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date(),
      });
      return { error: null };
    } catch (error) {
      console.error('Error changing user role:', error);
      return { error: error.message };
    }
  },

  // Activar/desactivar usuario (solo admin)
  async toggleUserStatus(userId, isActive) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isActive: isActive,
        updatedAt: new Date(),
      });
      return { error: null };
    } catch (error) {
      console.error('Error toggling user status:', error);
      return { error: error.message };
    }
  },

  // Eliminar usuario (solo admin)
  async deleteUser(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      return { error: null };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { error: error.message };
    }
  },
};
