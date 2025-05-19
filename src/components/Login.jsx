// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importa los iconos
import appFirebase from '../credenciales.js';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(appFirebase);
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirige a Home después de iniciar sesión
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h2>Iniciar sesión</h2>
        {error && <p className="error">{error}</p>}
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
          <div className="password-wrapper">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Botón que muestra el icono de ojo */}
            <a
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="toggle-password"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </a>
          </div>

          <div className="links">
            <Link to="/forgot-password" className="textcenter">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>

        {/* Botón para iniciar sesión con cuenta de Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="google-button"
        >
          <img
            src="/googlelogo.png"
            alt="Logo de Google"
            className="google-logo"
          />
          Inicia sesión con Google
        </button>

        <div className="links">
          <Link to="/register">¿Aún no tienes cuenta? Regístrate</Link>
        </div>
      </div>

      <div className="right-panel">
        <div className="logo">
          <img src="/logo.png" alt="Logo de Capactiapp" />
        </div>
      </div>
    </div>
  );
}

export default Login;
