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
  FaSignOutAlt,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
} from 'react-icons/fa';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

// ✅ ACTUALIZAR: src/components/layout/Sidebar.jsx
// ... (mantén todas las importaciones como están)

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, isInstructor, canViewReports, canManageCourses } =
    usePermissions();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Función para obtener los items del menú según el rol
  const getMenuItems = () => {
    // Menú para administradores
    if (isAdmin()) {
      return [
        {
          id: 'admin-dashboard',
          name: 'Panel Admin',
          icon: <FaCog />,
          path: '/dashboard/admin',
          active: location.pathname === '/dashboard/admin',
        },
        {
          id: 'users',
          name: 'Gestión Usuarios',
          icon: <FaUsersCog />,
          path: '/dashboard/admin/users',
          active: location.pathname === '/dashboard/admin/users',
        },
        {
          id: 'course-management',
          name: 'Gestión Cursos',
          icon: <FaGraduationCap />,
          path: '/dashboard/admin/courses',
          active: location.pathname === '/dashboard/admin/courses',
        },
        {
          id: 'reports',
          name: 'Reportes',
          icon: <FaChartBar />,
          path: '/dashboard/admin/reports',
          active: location.pathname === '/dashboard/admin/reports',
        },
        {
          id: 'all-users',
          name: 'Todos los Usuarios',
          icon: <FaUsers />,
          path: '/dashboard/admin/all-users',
          active: location.pathname === '/dashboard/admin/all-users',
        },
        {
          id: 'system-logs',
          name: 'Logs del Sistema',
          icon: <FaFileAlt />,
          path: '/dashboard/admin/logs',
          active: location.pathname === '/dashboard/admin/logs',
        },
      ];
    }

    // Menú para instructores
    if (isInstructor()) {
      const instructorItems = [
        {
          id: 'instructor-dashboard',
          name: 'Mi Panel',
          icon: <FaTh />,
          path: '/dashboard/instructor',
          active: location.pathname === '/dashboard/instructor',
        },
        {
          id: 'instructor-courses', // ✅ CAMBIAR ID
          name: 'Mis Cursos', // ✅ CAMBIAR NOMBRE
          icon: <FaBook />, // ✅ CAMBIAR ICONO
          path: '/dashboard/instructor/courses', // ✅ NUEVA RUTA
          active:
            location.pathname === '/dashboard/instructor/courses' ||
            location.pathname.startsWith('/dashboard/instructor/courses/'),
        },
        {
          id: 'instructor-classes',
          name: 'Mis Clases',
          icon: <FaGraduationCap />,
          path: '/dashboard/instructor/classes',
          active: location.pathname === '/dashboard/instructor/classes',
        },
        {
          id: 'create-course',
          name: 'Crear Curso',
          icon: <FaBook />,
          path: '/dashboard/instructor/create-course',
          active: location.pathname === '/dashboard/instructor/create-course',
        },
        {
          id: 'student-progress',
          name: 'Progreso Estudiantes',
          icon: <FaClipboardList />,
          path: '/dashboard/instructor/student-progress',
          active:
            location.pathname === '/dashboard/instructor/student-progress',
        },
      ];

      // Si el instructor también puede gestionar cursos, agregar esta opción
      if (canManageCourses()) {
        instructorItems.push({
          id: 'course-management',
          name: 'Gestión Cursos',
          icon: <FaGraduationCap />,
          path: '/dashboard/admin/courses',
          active: location.pathname === '/dashboard/admin/courses',
        });
      }

      // Si puede ver reportes
      if (canViewReports()) {
        instructorItems.push({
          id: 'reports',
          name: 'Mis Reportes',
          icon: <FaChartBar />,
          path: '/dashboard/instructor/reports',
          active: location.pathname === '/dashboard/instructor/reports',
        });
      }

      return instructorItems;
    }

    // Menú para estudiantes (usuarios regulares)
    return [
      {
        id: 'inicio',
        name: 'Inicio',
        icon: <FaHome />,
        path: '/dashboard/inicio',
        active: location.pathname === '/dashboard/inicio',
      },
      {
        id: 'dashboard',
        name: 'Mi Dashboard',
        icon: <FaTh />,
        path: '/dashboard',
        active: location.pathname === '/dashboard',
      },
      {
        id: 'cursos',
        name: 'Mis Cursos',
        icon: <FaBook />,
        path: '/dashboard/mis-cursos',
        active: location.pathname === '/dashboard/mis-cursos',
      },
      {
        id: 'logros',
        name: 'Mis Logros',
        icon: <FaTrophy />,
        path: '/dashboard/logros',
        active: location.pathname === '/dashboard/logros',
      },
      {
        id: 'progress',
        name: 'Mi Progreso',
        icon: <FaClipboardList />,
        path: '/dashboard/progress',
        active: location.pathname === '/dashboard/progress',
      },
    ];
  };

  // ... (resto del código permanece igual)

  // Elementos del pie - personalizados por rol
  const getFooterMenuItems = () => {
    const commonFooterItems = [
      {
        id: 'ayuda',
        name: 'Ayuda',
        icon: <FaQuestionCircle />,
        path: '/dashboard/help',
        active: location.pathname === '/dashboard/help',
      },
    ];

    // Configuración diferente según el rol
    if (isAdmin()) {
      return [
        {
          id: 'settings',
          name: 'Configuración Sistema',
          icon: <FaCog />,
          path: '/dashboard/admin/settings',
          active: location.pathname === '/dashboard/admin/settings',
        },
        ...commonFooterItems,
      ];
    } else if (isInstructor()) {
      return [
        {
          id: 'settings',
          name: 'Mi Configuración',
          icon: <FaCog />,
          path: '/dashboard/instructor/settings',
          active: location.pathname === '/dashboard/instructor/settings',
        },
        ...commonFooterItems,
      ];
    } else {
      return [
        {
          id: 'settings',
          name: 'Mi Perfil',
          icon: <FaCog />,
          path: '/dashboard/settings',
          active: location.pathname === '/dashboard/settings',
        },
        ...commonFooterItems,
      ];
    }
  };

  const menuItems = getMenuItems();
  const footerMenuItems = getFooterMenuItems();

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
            src="/logo.png"
            alt="Capacitapp"
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div
            style={{
              display: 'none',
              color: '#5271ff',
              fontWeight: 'bold',
              fontSize: isOpen ? '20px' : '16px',
            }}
          >
            {isOpen ? 'Capacitapp' : 'C'}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {/* Items del menú principal */}
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

          {/* Separador antes del footer */}
          <li className="nav-separator"></li>

          {/* Items del footer */}
          {footerMenuItems.map((item) => (
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

          {/* Cerrar sesión */}
          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="nav-link logout-btn"
              title={!isOpen ? 'Cerrar Sesión' : undefined}
              style={{
                background: 'none',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <span className="nav-icon">
                <FaSignOutAlt />
              </span>
              {isOpen && <span className="nav-text">Cerrar Sesión</span>}
            </button>
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
