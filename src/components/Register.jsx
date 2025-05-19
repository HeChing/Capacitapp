// src/components/Register.jsx
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import appFirebase from '../credenciales.js';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const auth = getAuth(appFirebase);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMensaje('¡Usuario registrado con éxito!');
      // Aquí podrías redirigir al login o limpiar el formulario
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="left-panel">
        <h2>Registrarse</h2>
        {error && <p className="error">{error}</p>}
        {mensaje && <p className="mensaje">{mensaje}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Registrarse</button>

          {/* Texto para usuarios que ya tienen una cuenta */}
          <div className="links">
            Ya tienes una cuenta?<a href="/Login"> iniciar sesión</a>
          </div>
        </form>
      </div>
      <div className="right-panel">
        <div className="logo">
          <img src="/logo.png" alt="Logo de Capactiapp" />
        </div>
      </div>
    </div>
  );
}

export default Register;
