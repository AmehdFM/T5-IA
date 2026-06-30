import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('disponibles'); // 'disponibles' or 'reservas'
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

    fetch('/api/rooms/my-reservations', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setReservations(data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('penguin_token');
    localStorage.removeItem('penguin_user');
    navigate('/');
  };

  const calculateTotal = (r) => {
    if (!r.startDate || !r.endDate || !r.price) return 0;
    const s = new Date(r.startDate);
    const e = new Date(r.endDate);
    const diffDays = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24));
    return diffDays * r.price;
  };

  if (!user) return null;

  const availableRooms = rooms.filter(room => room.status === 'disponible');

  return (
    <>
      <nav className="navbar">
        <div className="db-brand">
          HP<span className="brand-accent"> 🐧</span>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setActiveTab('disponibles')}
            style={{ 
              padding: '8px 20px', 
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              borderRadius: '20px', 
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'disponibles' ? 'var(--cp-yellow)' : 'transparent',
              color: activeTab === 'disponibles' ? '#002266' : 'white',
              boxShadow: activeTab === 'disponibles' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Habitaciones
          </button>
          
          <button 
            onClick={() => setActiveTab('reservas')}
            style={{ 
              padding: '8px 20px', 
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              borderRadius: '20px', 
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'reservas' ? 'var(--cp-yellow)' : 'transparent',
              color: activeTab === 'reservas' ? '#002266' : 'white',
              boxShadow: activeTab === 'reservas' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Mis Reservas ({reservations.length})
          </button>
        </div>

        <div className="nav-links">
          <span>Hola, {user.name}</span>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 15px', marginLeft: '15px' }}>
            Salir
          </button>
        </div>
      </nav>

      <div className="db-container">
        {/* Contenido de las pestañas */}
        {activeTab === 'disponibles' && (
          <div>
            {availableRooms.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem', padding: '40px' }}>
                <p>No hay habitaciones disponibles en este momento. ¡Vuelve más tarde! 🧊</p>
              </div>
            ) : (
              <div className="rooms-grid">
                {availableRooms.map(room => (
                  <div className="room-card" key={room.id}>
                    <img src={room.image} alt={room.name} className="room-img" />
                    <div className="room-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>{room.name}</h3>
                        <span className="room-price">L. {room.price}/noche</span>
                      </div>
                      <p style={{ margin: '10px 0', color: '#555' }}>{room.description}</p>
                      <Link to={`/room-detail?id=${room.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reservas' && (
          <div>
            {reservations.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem', padding: '40px' }}>
                <p>Aún no tienes reservaciones. ¡Explora las habitaciones disponibles! 🐧</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
                {reservations.map(res => {
                  const r = rooms.find(room => room.id === res.roomId) || {};
                  const total = calculateTotal(res);
                  return (
                    <div className="room-card" key={res.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '15px', border: '3px solid var(--cp-green)', borderRadius: '15px' }}>
                      <img src={r.image || '/img/hotel_bg.png'} alt={r.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }} />
                      <div style={{ flex: 1, marginLeft: '20px', color: '#333' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#002266', fontSize: '1.4rem' }}>{r.name || res.roomName || 'Habitación Reservada'}</h3>
                        <div style={{ fontSize: '1rem', color: '#555', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                          <div><strong>Llegada:</strong> {res.startDate}</div>
                          <div><strong>Salida:</strong> {res.endDate}</div>
                        </div>
                        {total > 0 && (
                          <div style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold', color: '#009922' }}>
                            Total pagado: L. {total}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}
