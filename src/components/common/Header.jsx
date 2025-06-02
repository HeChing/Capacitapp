// ✅ CREAR: src/components/common/Header.jsx

import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate('/login');
    }
  };

  return (
    <header
      style={{
        padding: '15px 30px',
        backgroundColor: '#007bff',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '24px' }}>Capacitapp</h1>

      {currentUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Hola, {currentUser.displayName || currentUser.email}</span>
          <div style={{ width: '120px' }}>
            <Button
              variant="outline"
              onClick={handleLogout}
              style={{
                backgroundColor: 'white',
                color: '#007bff',
                padding: '8px 16px',
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
