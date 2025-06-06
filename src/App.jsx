// ✅ ACTUALIZAR: src/App.jsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, ROLES } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/Home';
import Inicio from './pages/Inicio';
import MisCursos from './pages/MisCursos';
import Logros from './pages/Logros';
import Ayuda from './pages/Ayuda';
import ProtectedRoute from './components/ProtectedRoute';
// import RoleProtectedRoute from './components/RoleProtectedRoute';

// Comentar temporalmente las importaciones de páginas que no existen
// import AdminDashboard from './pages/admin/AdminDashboard';
// import UserManagement from './pages/admin/UserManagement';
// import CourseManagement from './pages/admin/CourseManagement';
// import Reports from './pages/admin/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <Inicio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cursos"
            element={
              <ProtectedRoute>
                <MisCursos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logros"
            element={
              <ProtectedRoute>
                <Logros />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ayuda"
            element={
              <ProtectedRoute>
                <Ayuda />
              </ProtectedRoute>
            }
          />

          {/* Comentar temporalmente las rutas administrativas
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute 
                allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}
                redirectTo="/inicio"
              >
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
          */}

          {/* Redirigir rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
