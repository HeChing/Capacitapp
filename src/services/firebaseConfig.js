// src/services/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyA3ZApPQ5sj5EyOQtwe8bM-LlWE42WRf8k',
  authDomain: 'capacitapp-b60e4.firebaseapp.com',
  projectId: 'capacitapp-b60e4',
  storageBucket: 'capacitapp-b60e4.firebasestorage.app',
  messagingSenderId: '776247183722',
  appId: '1:776247183722:web:18133b1f5a1cf8fbb07d13',
  measurementId: 'G-1WXT71RTP1',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios individuales que necesitas
export const auth = getAuth(app);
export const db = getFirestore(app); // ← ASEGÚRATE QUE ESTA LÍNEA EXISTE
export const storage = getStorage(app);

export default app;
