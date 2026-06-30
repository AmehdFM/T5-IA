import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function RoomDetail() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

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

  useEffect(() => {
    if (startDate && endDate && room) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setTotalPrice(diffDays * room.price);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, room]);

  const handleLogout = () => {
    localStorage.removeItem('penguin_token');
    localStorage.removeItem('penguin_user');
    navigate('/');
  };

  const handleReservation = async () => {
    if (!startDate || !endDate) {
      alert("Por favor selecciona las fechas de llegada y salida para calcular el total. 🐧");
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      alert("La fecha de salida debe ser posterior a la fecha de llegada. 🐧");
      return;
    }

    const token = localStorage.getItem('penguin_token');
    try {
      const res = await fetch(`/api/rooms/${room.id}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ startDate, endDate })
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Hubo un error al reservar. 🐧");
        return;
      }
      
      alert(`¡Reserva confirmada! Hemos cargado L. ${totalPrice} a tu tarjeta guardada. 🐧`);
      navigate('/client-dashboard');
    } catch (err) {
      console.error(err);
      alert("Error de conexión al procesar la reserva.");
    }
  };

  if (!user || !room) return null;

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

      {/* Full screen layout without cards */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', minHeight: 'calc(100vh - 70px)', background: '#fff', color: '#333' }}>
        
        {/* Columna Izquierda: Imagen */}
        <div style={{ flex: '1 1 50%', minWidth: '300px' }}>
          <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Columna Derecha: Contenido */}
        <div style={{ flex: '1 1 50%', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Link to="/client-dashboard" style={{ marginRight: '15px', color: '#0055ff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', padding: '8px 12px', background: '#e6f0ff', borderRadius: '8px' }}>
              ← Volver
            </Link>
            <h1 style={{ fontFamily: 'Fredoka', color: '#002266', margin: 0, fontSize: '2rem' }}>{room.name}</h1>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.4rem', background: 'var(--cp-yellow, #ffcc00)', color: '#002266', padding: '8px 15px', borderRadius: '8px', fontWeight: '900' }}>
              L. {room.price} / noche
            </span>
            <span style={{ background: room.status === 'disponible' ? '#d4edda' : '#f8d7da', color: room.status === 'disponible' ? '#155724' : '#721c24', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem' }}>
              {room.status === 'disponible' ? 'Disponible' : 'Ocupado'}
            </span>
          </div>

          <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#444', marginBottom: '20px' }}>
            {room.description}
          </p>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', color: '#002266' }}>Características Principales:</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {room.features && room.features.map((feature, idx) => (
                <li key={idx} style={{ padding: '5px 0', borderBottom: '1px solid #eee', fontSize: '1rem' }}>
                  ✨ {feature}
                </li>
              ))}
            </ul>
          </div>

          {room.status === 'disponible' && (
            <div style={{ background: '#f0f4f8', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '2px solid #dce4ec' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#002266' }}>Selecciona tus fechas de estadía:</h3>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 45%' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>Llegada:</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </div>
                <div style={{ flex: '1 1 45%' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>Salida:</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
                    min={startDate || new Date().toISOString().split('T')[0]} 
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '15px', borderTop: '1px dashed #ccc' }}>
                <span style={{ fontSize: '1.1rem', color: '#555' }}>Total a pagar:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#009922' }}>
                  {totalPrice > 0 ? `L. ${totalPrice}` : '---'}
                </span>
              </div>
            </div>
          )}

          <button 
            onClick={handleReservation} 
            className="btn-primary" 
            style={{ width: '100%', padding: '15px', fontSize: '1.2rem', borderRadius: '12px' }}
            disabled={room.status !== 'disponible' || totalPrice <= 0}
          >
            {room.status === 'disponible' ? 'Confirmar Reserva 🧊' : 'Habitación No Disponible'}
          </button>
        </div>
      </div>
    </>
  );
}
