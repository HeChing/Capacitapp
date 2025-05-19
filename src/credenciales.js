// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA3ZApPQ5sj5EyOQtwe8bM-LlWE42WRf8k',
  authDomain: 'capacitapp-b60e4.firebaseapp.com',
  projectId: 'capacitapp-b60e4',
  storageBucket: 'capacitapp-b60e4.firebasestorage.app',
  messagingSenderId: '776247183722',
  appId: '1:776247183722:web:18133b1f5a1cf8fbb07d13',
  measurementId: 'G-1WXT71RTP1',
};
//cambiar estas credenciales por la seguridad de la app recuerda que estas credenciales son de prueba y no se deben usar en produccion

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
