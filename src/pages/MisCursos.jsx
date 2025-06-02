// ✅ CREAR: src/pages/MisCursos.jsx

import DashboardLayout from '../components/layout/DashboardLayout';

function MisCursos() {
  return (
    <DashboardLayout>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          color: '#6c757d',
        }}
      >
        <div>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>Mis Cursos</h2>
          <p>Aquí verás todos tus cursos. Contenido por agregar.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MisCursos;
