// ✅ ACTUALIZAR: src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Páginas comunes
import Home from './pages/Home';
import Inicio from './pages/Inicio';
import MisCursos from './pages/MisCursos';
import Logros from './pages/Logros';
import Dashboard from './pages/Dashboard';

// Páginas de Cursos (para todos los usuarios autenticados)
import CoursesCatalog from './pages/CoursesCatalog';
import CourseDetails from './pages/CourseDetails';
import CourseViewer from './pages/CourseViewer';

// Páginas Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import CourseEditor from './pages/admin/CourseEditor';
import EnrollmentManagement from './pages/admin/EnrollmentManagement';
import Reports from './pages/admin/Reports';
import AdminCreateCourse from './pages/admin/CreateCourse';

// Páginas Instructor
import InstructorHome from './pages/instructor/InstructorHome';
import InstructorClasses from './pages/instructor/InstructorClasses';
import CreateCourse from './pages/instructor/CreateCourse';

// Páginas Manager
import ManagerHome from './pages/manager/ManagerHome';

// Páginas Employee
import EmployeeHome from './pages/employee/EmployeeHome';

// ✅ AGREGAR en tu archivo de rutas (App.jsx o Routes.jsx)
import InstructorCourseManagement from './pages/instructor/CourseManagement';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />

          {/* Rutas protegidas con layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard principal - redirige según rol */}
            <Route index element={<Dashboard />} />
            {/* ============================================ */}
            {/* RUTAS COMUNES PARA TODOS LOS USUARIOS AUTENTICADOS */}
            {/* ============================================ */}
            <Route path="inicio" element={<Inicio />} />
            <Route path="mis-cursos" element={<MisCursos />} />
            <Route path="logros" element={<Logros />} />
            {/* Catálogo y cursos - accesible para empleados y superiores */}
            <Route
              path="cursos"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    'employee',
                    'manager',
                    'instructor',
                    'admin',
                    'super_admin',
                  ]}
                >
                  <CoursesCatalog />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="course-details/:courseId"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    'employee',
                    'manager',
                    'instructor',
                    'admin',
                    'super_admin',
                  ]}
                >
                  <CourseDetails />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="course/:courseId"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    'employee',
                    'manager',
                    'instructor',
                    'admin',
                    'super_admin',
                  ]}
                >
                  <CourseViewer />
                </RoleProtectedRoute>
              }
            />
            {/* ============================================ */}
            {/* RUTAS ESPECÍFICAS POR ROL */}
            {/* ============================================ */}
            {/* SUPER ADMIN & ADMIN */}
            <Route
              path="admin"
              element={
                <RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <UserManagement />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="admin/courses"
              element={
                <RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <CourseManagement />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="admin/courses/edit/:courseId"
              element={
                <RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <CourseEditor />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="admin/courses/create"
              element={
                <RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <CourseEditor />
                </RoleProtectedRoute>
              }
            />
            // Y actualizar la ruta existente:
            <Route
              path="admin/courses/create-course"
              element={
                <RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <AdminCreateCourse />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="admin/enrollments"
              element={
                <RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <EnrollmentManagement />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="admin/courses/create-course"
              element={
                <RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <CreateCourse />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="admin/reports"
              element={
                <RoleProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <Reports />
                </RoleProtectedRoute>
              }
            />
            {/* INSTRUCTOR */}
            <Route
              path="instructor"
              element={
                <RoleProtectedRoute
                  allowedRoles={['instructor', 'admin', 'super_admin']}
                >
                  <InstructorHome />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="instructor/classes"
              element={
                <RoleProtectedRoute
                  allowedRoles={['instructor', 'admin', 'super_admin']}
                >
                  <InstructorClasses />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="instructor/create-course"
              element={
                <RoleProtectedRoute
                  allowedRoles={['instructor', 'admin', 'super_admin']}
                >
                  <CreateCourse />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="instructor/courses/edit/:courseId"
              element={
                <RoleProtectedRoute
                  allowedRoles={['instructor', 'admin', 'super_admin']}
                >
                  <CourseEditor />
                </RoleProtectedRoute>
              }
            />
            // Dentro de las rutas protegidas para instructores
            <Route
              path="/dashboard/instructor/courses"
              element={
                <ProtectedRoute
                  allowedRoles={['instructor', 'admin', 'super_admin']}
                >
                  <InstructorCourseManagement />
                </ProtectedRoute>
              }
            />
            {/* MANAGER */}
            <Route
              path="manager"
              element={
                <RoleProtectedRoute
                  allowedRoles={['manager', 'admin', 'super_admin']}
                >
                  <ManagerHome />
                </RoleProtectedRoute>
              }
            />
            {/* EMPLOYEE */}
            <Route
              path="employee"
              element={
                <RoleProtectedRoute
                  allowedRoles={[
                    'employee',
                    'manager',
                    'instructor',
                    'admin',
                    'super_admin',
                  ]}
                >
                  <EmployeeHome />
                </RoleProtectedRoute>
              }
            />
          </Route>

          {/* Ruta de error */}
          <Route
            path="/unauthorized"
            element={
              <div className="unauthorized">
                <h1>Acceso Denegado</h1>
                <p>No tienes permisos para acceder a esta página.</p>
              </div>
            }
          />

          {/* Ruta catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
