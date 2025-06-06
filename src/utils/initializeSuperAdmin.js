// ✅ ACTUALIZAR: src/utils/initializeSuperAdmin.js

import {
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { ROLES } from '../contexts/AuthContext';

// Esta función debe ejecutarse una sola vez para crear el primer super admin
export const initializeSuperAdmin = async (userId, email, displayName) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      uid: userId,
      email: email,
      displayName: displayName || 'Super Admin',
      role: ROLES.SUPER_ADMIN,
      department: 'IT',
      createdAt: new Date().toISOString(),
      isActive: true,
      isFirstSuperAdmin: true,
    });

    console.log('Super Admin creado exitosamente');
    return true;
  } catch (error) {
    console.error('Error creando Super Admin:', error);
    return false;
  }
};

// Función para verificar si ya existe un super admin
export const checkSuperAdminExists = async () => {
  try {
    const usersSnapshot = await getDocs(
      query(collection(db, 'users'), where('role', '==', ROLES.SUPER_ADMIN))
    );
    return !usersSnapshot.empty;
  } catch (error) {
    console.error('Error verificando Super Admin:', error);
    return false;
  }
};
