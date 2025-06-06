// ✅ REEMPLAZAR: src/components/layout/Header.jsx

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
} from 'react-icons/fa';
import './Header.css';

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Función para obtener el título de la página actual
  const getPageTitle = () => {
    const titles = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/inicio': 'Inicio',
      '/cursos': 'Mis cursos',
      '/logros': 'Logros',
      '/ayuda': 'Ayuda',
    };
    return titles[location.pathname] || 'Dashboard';
  };

  // Función para obtener el breadcrumb
  const getBreadcrumb = () => {
    const breadcrumbs = {
      '/': 'Inicio / Dashboard',
      '/dashboard': 'Inicio / Dashboard',
      '/inicio': 'Inicio',
      '/cursos': 'Inicio / Mis cursos',
      '/logros': 'Inicio / Logros',
      '/ayuda': 'Inicio / Ayuda',
    };
    return breadcrumbs[location.pathname] || 'Inicio / Dashboard';
  };

  return (
    <header className="dashboard-header">
      {/* 🚫 BOTÓN ELIMINADO - Ya no está aquí */}

      {/* Título y breadcrumb dinámicos */}
      <div className="header-title">
        <h1>{getPageTitle()}</h1>
        <p className="breadcrumb">{getBreadcrumb()}</p>
      </div>

      {/* Acciones del header */}
      <div className="header-actions">
        {/* Notificaciones */}
        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

        {/* Usuario */}
        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Usuario" />
              ) : (
                <FaUser />
              )}
            </div>
            <div className="user-info">
              <span className="user-name">
                {currentUser?.displayName ||
                  currentUser?.email ||
                  'Hector Ching'}
              </span>
              <span className="user-role">Admin</span>
            </div>
            <FaChevronDown className="dropdown-icon" />
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">
              <button className="dropdown-item">
                <FaUser /> Mi Perfil
              </button>
              <button className="dropdown-item">
                <FaCog /> Configuración
              </button>
              <hr />
              <button className="dropdown-item logout" onClick={handleLogout}>
                <FaSignOutAlt /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
