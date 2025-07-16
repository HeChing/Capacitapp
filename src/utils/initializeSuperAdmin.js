// ✅ CREAR: src/utils/initializeSuperAdmin.js
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import { ROLES } from '../contexts/AuthContext';

export const initializeSuperAdmin = async () => {
  try {
    // Crear usuario super admin
    const email = 'admin@capacitapp.com';
    const password = 'SuperAdmin123!';
    const displayName = 'Super Administrador';

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Actualizar perfil
    await updateProfile(user, {
      displayName: displayName,
    });

    // Crear documento en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: ROLES.SUPER_ADMIN,
      department: 'Administración',
      position: 'Super Administrador',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        phoneNumber: '',
        hireDate: new Date().toISOString(),
        avatar: '',
      },
    });

    console.log('Super Admin creado exitosamente');
    return { success: true, user };
  } catch (error) {
    console.error('Error creando Super Admin:', error);
    return { success: false, error: error.message };
  }
};
