// src/components/common/Header.jsx - CON DEBUGGING
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
  FaBars,
} from 'react-icons/fa';
import './Header.css';

function Header({ onToggleSidebar }) {
  console.log('Header renderizando'); // DEBUGGING

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Para obtener el rol de forma simple por ahora
  const userRole = 'employee'; // Hardcodeado temporalmente

  console.log('CurrentUser en Header:', currentUser); // DEBUGGING

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/dashboard/inicio': 'Inicio',
      '/dashboard/mis-cursos': 'Mis Cursos',
      '/dashboard/logros': 'Logros',
    };
    return titles[location.pathname] || 'Dashboard';
  };

  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments.join(' / ');
  };

  const getRoleDisplayName = () => {
    const roleNames = {
      super_admin: 'Super Administrador',
      admin: 'Administrador',
      instructor: 'Instructor',
      manager: 'Manager',
      employee: 'Empleado',
    };
    return roleNames[userRole] || 'Usuario';
  };

  return (
    <header className="dashboard-header">
      <div style={{ padding: '10px', color: 'white' }}>HEADER AQUÍ</div>

      <button
        className="sidebar-toggle"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      <div className="header-title">
        <h1>{getPageTitle()}</h1>
        <p className="breadcrumb">{getBreadcrumb()}</p>
      </div>

      <div className="header-actions">
        <button className="notification-btn" title="Notificaciones">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

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
                  currentUser?.email?.split('@')[0] ||
                  'Usuario'}
              </span>
              <span className="user-role">{getRoleDisplayName()}</span>
            </div>
            <FaChevronDown
              className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`}
            />
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
