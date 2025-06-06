// ✅ REEMPLAZAR: src/components/Home.jsx

import DashboardLayout from './layout/DashboardLayout';

function Home() {
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
            ¡Bienvenido al Dashboard!
          </h2>
          <p>
            Esta es tu página principal. Aquí podrás agregar el contenido que
            necesites.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Home;
