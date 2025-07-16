// ✅ CREAR: src/pages/Home.jsx
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido a Capacitapp</h1>
          <p>Tu plataforma de capacitación empresarial</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn-primary">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn-secondary">
              Registrarse
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/logo.png" alt="Capacitapp" />
        </div>
      </div>
    </div>
  );
};

export default Home;
