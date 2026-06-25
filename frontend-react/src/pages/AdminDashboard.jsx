import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('penguin_user');
    const token = localStorage.getItem('penguin_token');
    
    if (!userData || !token) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/client-dashboard');
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('penguin_token');
    localStorage.removeItem('penguin_user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <>
      <nav className="navbar" style={{ background: '#001133' }}>
        <div className="db-brand">
          HP<span className="brand-accent" style={{ color: 'var(--cp-yellow)' }}> 🐧 [ADMIN]</span>
        </div>
        <div className="nav-links">
          <span style={{ color: '#fff' }}>Admin: {user.name}</span>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 15px', marginLeft: '15px' }}>
            Salir
          </button>
        </div>
      </nav>

      <div className="db-container">
        <div className="db-header">
          <h1 style={{ fontFamily: 'Fredoka', color: '#002266' }}>Panel de Administración</h1>
          <p>Gestiona los usuarios y reservas del Hotel Penguin.</p>
        </div>

        <div className="rooms-grid">
          <div className="room-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Reservas</h2>
            <p>12 Activas</p>
          </div>
          <div className="room-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Usuarios</h2>
            <p>45 Registrados</p>
          </div>
          <div className="room-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Ingresos</h2>
            <p>$1,450 USD</p>
          </div>
        </div>
      </div>
    </>
  );
}
