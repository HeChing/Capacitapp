// ✅ ACTUALIZAR: src/components/auth/Login.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import './Login.css';

function Login() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { currentUser, login, loginWithGoogle } = useAuth();

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm(
      { email: '', password: '' },
      {
        email: validators.email,
        password: validators.password,
      }
    );

  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setLoading(true);
    const { error } = await login(values.email, values.password);

    if (error) {
      setAuthError(error);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setGoogleLoading(true);

    const { error } = await loginWithGoogle();

    if (error) {
      setAuthError(error);
    }

    setGoogleLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="left-panel">
        <h1 className="auth-title">Iniciar Sesión</h1>

        {authError && <div className="error-message">{authError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="email"
              className="auth-input"
              placeholder="Email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              disabled={loading || googleLoading}
              required
            />
            {touched.email && errors.email && (
              <div className="error-message" style={{ marginTop: '10px' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div className="input-group">
            <div className="password-wrapper">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="auth-input"
                placeholder="Contraseña"
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                disabled={loading || googleLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setPasswordVisible(!passwordVisible)}
                disabled={loading || googleLoading}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {touched.password && errors.password && (
              <div className="error-message" style={{ marginTop: '10px' }}>
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>o</span>
        </div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <>
              <span
                className="loading-spinner"
                style={{ borderTopColor: '#333' }}
              ></span>
              Conectando...
            </>
          ) : (
            <>
              <FaGoogle style={{ color: '#db4437' }} />
              Continuar con Google
            </>
          )}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>

        <div className="auth-links" style={{ marginTop: '15px' }}>
          <Link to="/register">¿No tienes cuenta? Regístrate</Link>
        </div>
      </div>

      <div className="right-panel">
        <div className="logo">
          <img src="/logo.png" alt="Capacitapp" />
        </div>
      </div>
    </div>
  );
}

export default Login;
