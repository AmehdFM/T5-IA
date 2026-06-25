import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function RoomDetail() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('penguin_user');
    const token = localStorage.getItem('penguin_token');
    
    if (!userData || !token) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));

    const roomId = searchParams.get('id');
    if (!roomId) {
      navigate('/client-dashboard');
      return;
    }

    fetch(`/api/rooms/${roomId}`)
      .then(res => {
        if (!res.ok) throw new Error('Room not found');
        return res.json();
      })
      .then(data => setRoom(data))
      .catch(err => {
        console.error(err);
        navigate('/client-dashboard');
      });
  }, [navigate, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem('penguin_token');
    localStorage.removeItem('penguin_user');
    navigate('/');
  };

  const handleReservation = () => {
    alert("¡Reserva confirmada! Hemos cargado el monto a tu tarjeta guardada. 🐧");
    navigate('/client-dashboard');
  };

  if (!user || !room) return null;

  return (
    <>
      <nav className="navbar">
        <div className="db-brand">
          HP<span className="brand-accent"> 🐧</span>
        </div>
        <div className="nav-links">
          <Link to="/client-dashboard" style={{ marginRight: '15px', color: '#002266', textDecoration: 'none', fontWeight: '600' }}>← Volver</Link>
          <span>Hola, {user.name}</span>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 15px', marginLeft: '15px' }}>
            Salir
          </button>
        </div>
      </nav>

      <div className="db-container">
        <div className="db-header">
          <h1 style={{ fontFamily: 'Fredoka', color: '#002266' }}>{room.name}</h1>
        </div>

        <div className="room-card" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          <img src={room.image} alt={room.name} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
          
          <div className="room-content" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span className="room-price" style={{ fontSize: '1.5rem' }}>${room.price}/noche</span>
              <span style={{ background: room.available ? '#d4edda' : '#f8d7da', color: room.available ? '#155724' : '#721c24', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>
                {room.available ? 'Disponible' : 'Ocupado'}
              </span>
            </div>
            
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444', marginBottom: '30px' }}>
              {room.description}
            </p>
            
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '10px' }}>Características:</h3>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {room.features && room.features.map((feature, idx) => (
                  <li key={idx} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>✨ {feature}</li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={handleReservation} 
              className="btn-primary" 
              style={{ width: '100%', padding: '15px', fontSize: '1.2rem' }}
              disabled={!room.available}
            >
              {room.available ? 'Confirmar Reserva 🧊' : 'No Disponible'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
