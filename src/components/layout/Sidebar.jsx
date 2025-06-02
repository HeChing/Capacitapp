// ✅ REEMPLAZAR COMPLETAMENTE: src/components/layout/Sidebar.jsx

import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaTh,
  FaBook,
  FaTrophy,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const menuItems = [
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
    {
      id: 'ayuda',
      name: 'Ayuda',
      icon: <FaQuestionCircle />,
      path: '/ayuda',
      active: location.pathname === '/ayuda',
    },
  ];

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
          {menuItems.map((item) => (
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
