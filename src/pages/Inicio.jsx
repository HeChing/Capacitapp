// ✅ CREAR: src/pages/Inicio.jsx

import DashboardLayout from '../components/layout/DashboardLayout';

function Inicio() {
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
          <h2 style={{ marginBottom: '10px', color: '#333' }}>
            Página de Inicio
          </h2>
          <p>Esta es la página de inicio. Contenido por agregar.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Inicio;
