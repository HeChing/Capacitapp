// ✅ CREAR: src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userRole) {
      // Redirigir según el rol del usuario
      switch (userRole) {
        case 'super_admin':
        case 'admin':
          navigate('/dashboard/admin', { replace: true });
          break;
        case 'instructor':
          navigate('/dashboard/instructor', { replace: true });
          break;
        case 'manager':
          navigate('/dashboard/manager', { replace: true });
          break;
        case 'employee':
        default:
          navigate('/dashboard/employee', { replace: true });
          break;
      }
    }
  }, [userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-redirect">
      <p>Redirigiendo...</p>
    </div>
  );
};

export default Dashboard;
