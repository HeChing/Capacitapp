// ✅ CREAR: src/pages/Ayuda.jsx

import DashboardLayout from '../components/layout/DashboardLayout';

function Ayuda() {
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
            Centro de Ayuda
          </h2>
          <p>Encuentra respuestas a tus preguntas. Contenido por agregar.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Ayuda;
