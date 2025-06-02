// ✅ CREAR: src/pages/Logros.jsx

import DashboardLayout from '../components/layout/DashboardLayout';

function Logros() {
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
          <h2 style={{ marginBottom: '10px', color: '#333' }}>Logros</h2>
          <p>Aquí verás todos tus logros y badges. Contenido por agregar.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Logros;
