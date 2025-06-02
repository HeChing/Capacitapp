// ✅ ACTUALIZAR: src/components/auth/Register.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validators';
import { FaEye, FaEyeSlash, FaGoogle, FaCheck } from 'react-icons/fa';
import './Login.css'; // Usar el mismo CSS

function Register() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { currentUser, register, loginWithGoogle } = useAuth();

  const { values, errors, touched, handleChange, handleBlur, validate, reset } =
    useForm(
      {
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
      },
      {
        email: validators.email,
        password: validators.password,
        confirmPassword: validators.confirmPassword,
        displayName: (value) => validators.required(value, 'Nombre'),
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
    setSuccess(false);

    if (!acceptTerms) {
      setAuthError('Debes aceptar los términos y condiciones');
      return;
    }

    if (!validate()) return;

    setLoading(true);
    const { error } = await register(
      values.email,
      values.password,
      values.displayName
    );

    if (error) {
      setAuthError(error);
    } else {
      setSuccess(true);
      reset();
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }

    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setAuthError('');
    setGoogleLoading(true);

    const { error } = await loginWithGoogle();

    if (error) {
      setAuthError(error);
    }

    setGoogleLoading(false);
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="left-panel">
          <div
            className="success-message"
            style={{ padding: '40px', fontSize: '18px' }}
          >
            <h2 style={{ color: 'white', marginBottom: '20px' }}>
              ¡Registro exitoso! ✅
            </h2>
            <p>Tu cuenta ha sido creada correctamente.</p>
            <p>Redirigiendo a la aplicación...</p>
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

  return (
    <div className="auth-container">
      <div className="left-panel">
        <h1 className="auth-title">Registrarse</h1>

        {authError && <div className="error-message">{authError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              className="auth-input"
              placeholder="Nombre completo"
              value={values.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              onBlur={() => handleBlur('displayName')}
              disabled={loading || googleLoading}
              required
            />
            {touched.displayName && errors.displayName && (
              <div className="error-message" style={{ marginTop: '10px' }}>
                {errors.displayName}
              </div>
            )}
          </div>

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

          <div className="input-group">
            <div className="password-wrapper">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                className="auth-input"
                placeholder="Confirma la contraseña"
                value={values.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
                onBlur={() => handleBlur('confirmPassword')}
                disabled={loading || googleLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                disabled={loading || googleLoading}
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="error-message" style={{ marginTop: '10px' }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Checkbox de términos - igual a la imagen */}
          <div
            className="checkbox-container"
            onClick={() => setAcceptTerms(!acceptTerms)}
          >
            <div className={`custom-checkbox ${acceptTerms ? 'checked' : ''}`}>
              {acceptTerms && <FaCheck className="checkmark" />}
            </div>
            <span className="checkbox-label">
              Acepto los términos y condiciones
            </span>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>o</span>
        </div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleRegister}
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
              Registrarse con Google
            </>
          )}
        </button>

        <div className="auth-links">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
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

export default Register;
