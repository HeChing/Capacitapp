// ✅ ACTUALIZAR: src/components/layout/Sidebar.jsx

import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaTh,
  FaBook,
  FaTrophy,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaUsersCog,
  FaChartBar,
  FaGraduationCap,
  FaCog,
} from 'react-icons/fa';
import { usePermissions } from '../../hooks/usePermissions';
import './Sidebar.css';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { isAdmin, isInstructor, canViewReports, ROLES } = usePermissions();

  // Menú básico para todos los usuarios
  const baseMenuItems = [
    {
      id: 'inicio',
      name: 'Inicio',
      icon: <FaHome />,
      path: '/inicio',
      active: location.pathname === '/inicio',
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <FaTh />,
      path: '/',
      active: location.pathname === '/' || location.pathname === '/dashboard',
    },
    {
      id: 'cursos',
      name: 'Mis cursos',
      icon: <FaBook />,
      path: '/cursos',
      active: location.pathname === '/cursos',
    },
    {
      id: 'logros',
      name: 'Logros',
      icon: <FaTrophy />,
      path: '/logros',
      active: location.pathname === '/logros',
    },
  ];

  // Menú administrativo (solo para admins y super admins)
  const adminMenuItems = [];

  if (isAdmin()) {
    adminMenuItems.push({
      id: 'admin-dashboard',
      name: 'Admin Dashboard',
      icon: <FaCog />,
      path: '/admin',
      active: location.pathname === '/admin',
    });

    adminMenuItems.push({
      id: 'users',
      name: 'Usuarios',
      icon: <FaUsersCog />,
      path: '/admin/usuarios',
      active: location.pathname === '/admin/usuarios',
    });
  }

  // Gestión de cursos (para admins e instructores)
  if (isAdmin() || isInstructor()) {
    adminMenuItems.push({
      id: 'course-management',
      name: 'Gestionar Cursos',
      icon: <FaGraduationCap />,
      path: '/admin/cursos',
      active: location.pathname === '/admin/cursos',
    });
  }

  // Reportes (para quienes tengan permisos)
  if (canViewReports()) {
    adminMenuItems.push({
      id: 'reports',
      name: 'Reportes',
      icon: <FaChartBar />,
      path: '/reportes',
      active: location.pathname === '/reportes',
    });
  }

  // Ayuda siempre al final
  const helpMenuItem = {
    id: 'ayuda',
    name: 'Ayuda',
    icon: <FaQuestionCircle />,
    path: '/ayuda',
    active: location.pathname === '/ayuda',
  };

  // Combinar todos los items del menú
  const allMenuItems = [...baseMenuItems];

  // Agregar sección administrativa si hay items
  if (adminMenuItems.length > 0) {
    allMenuItems.push(...adminMenuItems);
  }

  // Agregar ayuda al final
  allMenuItems.push(helpMenuItem);

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Toggle Button - Solo cuando el sidebar está abierto */}
      {isOpen && (
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Collapse sidebar"
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo-container">
          <img
            src={isOpen ? '/logo.png' : '/logoc.png'}
            alt="Capacitapp"
            className="logo-image"
          />
        </div>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {/* Items básicos */}
          {baseMenuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${item.active ? 'active' : ''}`}
                title={!isOpen ? item.name : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-text">{item.name}</span>}
              </Link>
            </li>
          ))}

          {/* Separador si hay items administrativos */}
          {adminMenuItems.length > 0 && (
            <li className="nav-separator">
              {isOpen && <span className="separator-text">Administración</span>}
            </li>
          )}

          {/* Items administrativos */}
          {adminMenuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${item.active ? 'active' : ''}`}
                title={!isOpen ? item.name : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-text">{item.name}</span>}
              </Link>
            </li>
          ))}

          {/* Separador antes de ayuda */}
          <li className="nav-separator"></li>

          {/* Ayuda */}
          <li className="nav-item">
            <Link
              to={helpMenuItem.path}
              className={`nav-link ${helpMenuItem.active ? 'active' : ''}`}
              title={!isOpen ? helpMenuItem.name : undefined}
            >
              <span className="nav-icon">{helpMenuItem.icon}</span>
              {isOpen && <span className="nav-text">{helpMenuItem.name}</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Botón para expandir cuando está colapsado */}
      {!isOpen && (
        <button
          className="sidebar-expand-btn"
          onClick={onToggle}
          aria-label="Expand sidebar"
        >
          <FaChevronRight />
        </button>
      )}
    </aside>
  );
}

export default Sidebar;
