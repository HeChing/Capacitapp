// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import appFirebase from './credenciales.js';

import Login from './components/login.jsx';
import Register from './components/Register.jsx';
import Home from './components/Home.jsx';

import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const auth = getAuth(appFirebase);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
      } else {
        setUsuario(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <Router>
      <Routes>
        {/* Si no hay usuario, mostramos Login en "/" */}
        <Route
          path="/"
          element={usuario ? <Home correoUsuario={usuario.email} /> : <Login />}
        />
        {/* Ruta adicional para login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
