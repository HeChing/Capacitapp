// ✅ ACTUALIZAR: src/components/layout/DashboardLayout.jsx

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Contenido principal */}
      <div
        className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Área de contenido */}
        <main className="content-area">{children}</main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
