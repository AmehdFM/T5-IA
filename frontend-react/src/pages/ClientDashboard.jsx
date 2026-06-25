import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('penguin_user');
    const token = localStorage.getItem('penguin_token');
    
    if (!userData || !token) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));

    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('penguin_token');
    localStorage.removeItem('penguin_user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <>
      <nav className="navbar">
        <div className="db-brand">
          HP<span className="brand-accent"> 🐧</span>
        </div>
        <div className="nav-links">
          <span>Hola, {user.name}</span>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 15px', marginLeft: '15px' }}>
            Salir
          </button>
        </div>
      </nav>

      <div className="db-container">
        <div className="db-header">
          <h1 style={{ fontFamily: 'Fredoka', color: '#002266' }}>Tus Habitaciones Disponibles</h1>
          <p>Explora y reserva tu estadía en el Hotel Penguin.</p>
        </div>

        <div className="rooms-grid">
          {rooms.map(room => (
            <div className="room-card" key={room.id}>
              <img src={room.image} alt={room.name} className="room-img" />
              <div className="room-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{room.name}</h3>
                  <span className="room-price">${room.price}/noche</span>
                </div>
                <p style={{ margin: '10px 0', color: '#555' }}>{room.description}</p>
                <Link to={`/room-detail?id=${room.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
