// ✅ ACTUALIZAR: src/components/Home.jsx

import { usePermissions } from '../hooks/usePermissions';
import DashboardLayout from './layout/DashboardLayout';
import AdminHome from './home/AdminHome';
import InstructorHome from './home/InstructorHome';
import EmployeeHome from './home/EmployeeHome';
import ManagerHome from './home/ManagerHome';

function Home() {
  const { isAdmin, isInstructor, isManager } = usePermissions();

  // Renderizar el dashboard según el rol
  if (isAdmin()) {
    return <AdminHome />;
  }

  if (isInstructor()) {
    return <InstructorHome />;
  }

  if (isManager()) {
    return <ManagerHome />;
  }

  // Por defecto, mostrar el dashboard de empleado
  return <EmployeeHome />;
}

export default Home;
