import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('habitaciones');
  
  // Data States
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [finances, setFinances] = useState({ totalRevenue: 0, clients: [] });
  
  // UI States
  const [editingRoom, setEditingRoom] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem('penguin_token');
    
    // Fetch Rooms
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));

    // Fetch Users
    fetch('/api/auth/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));

    // Fetch Finances
    fetch('/api/rooms/admin/financial-stats', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setFinances(data))
      .catch(err => console.error(err));
  };

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
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('penguin_token');
    localStorage.removeItem('penguin_user');
    navigate('/');
  };

  // ROOM ACTIONS
  const toggleRoomStatus = async (roomId, currentStatus) => {
    const token = localStorage.getItem('penguin_token');
    const newStatus = currentStatus === 'disponible' ? 'ocupada' : 'disponible';
    try {
      const res = await fetch('/api/rooms/admin/toggle-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roomId, status: newStatus })
      });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al cambiar estado');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red');
    }
  };

  const handleEditRoomSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('penguin_token');
    try {
      const res = await fetch(`/api/rooms/admin/${editingRoom.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingRoom.name,
          description: editingRoom.description,
          price: editingRoom.price
        })
      });
      if (res.ok) {
        setEditingRoom(null);
        fetchData();
        alert('Habitación actualizada');
      } else {
        const data = await res.json();
        alert(data.error || 'Error al actualizar');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red');
    }
  };

  // FILTER USERS
  const filteredUsers = users.filter(u => {
    const matchesName = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesName && matchesRole;
  });

  if (!user) return null;

  return (
    <>
      <nav className="navbar" style={{ background: '#001133' }}>
        <div className="db-brand">
          HP<span className="brand-accent" style={{ color: 'var(--cp-yellow)' }}> 🐧 [ADMIN]</span>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setActiveTab('habitaciones')}
            style={{ 
              padding: '8px 20px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '20px', border: 'none', cursor: 'pointer',
              background: activeTab === 'habitaciones' ? 'var(--cp-yellow)' : 'transparent',
              color: activeTab === 'habitaciones' ? '#002266' : 'white',
              boxShadow: activeTab === 'habitaciones' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Habitaciones
          </button>
          <button 
            onClick={() => setActiveTab('usuarios')}
            style={{ 
              padding: '8px 20px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '20px', border: 'none', cursor: 'pointer',
              background: activeTab === 'usuarios' ? 'var(--cp-yellow)' : 'transparent',
              color: activeTab === 'usuarios' ? '#002266' : 'white',
              transition: 'all 0.2s'
            }}
          >
            Usuarios
          </button>
          <button 
            onClick={() => setActiveTab('finanzas')}
            style={{ 
              padding: '8px 20px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '20px', border: 'none', cursor: 'pointer',
              background: activeTab === 'finanzas' ? 'var(--cp-yellow)' : 'transparent',
              color: activeTab === 'finanzas' ? '#002266' : 'white',
              transition: 'all 0.2s'
            }}
          >
            Finanzas
          </button>
        </div>

        <div className="nav-links">
          <span style={{ color: '#fff' }}>Admin: {user.name}</span>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 15px', marginLeft: '15px' }}>
            Salir
          </button>
        </div>
      </nav>

      <div className="db-container">
        
        {/* TAB HABITACIONES */}
        {activeTab === 'habitaciones' && (
          <div>
            <div className="rooms-grid">
              {rooms.map(room => (
                <div className="room-card" key={room.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={room.image} alt={room.name} className="room-img" style={{ height: '200px' }} />
                  <div className="room-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    
                    {editingRoom && editingRoom.id === room.id ? (
                      <form onSubmit={handleEditRoomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input 
                          type="text" 
                          value={editingRoom.name} 
                          onChange={e => setEditingRoom({...editingRoom, name: e.target.value})}
                          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                          required
                        />
                        <textarea 
                          value={editingRoom.description} 
                          onChange={e => setEditingRoom({...editingRoom, description: e.target.value})}
                          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px' }}
                          required
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: 'bold' }}>L.</span>
                          <input 
                            type="number" 
                            value={editingRoom.price} 
                            onChange={e => setEditingRoom({...editingRoom, price: e.target.value})}
                            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                          <button type="submit" style={{ flex: 1, padding: '8px', background: '#00cc33', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
                          <button type="button" onClick={() => setEditingRoom(null)} style={{ flex: 1, padding: '8px', background: '#ccc', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Cancelar</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3>{room.name}</h3>
                          <span className="room-price">L. {room.price}</span>
                        </div>
                        <p style={{ margin: '10px 0', color: '#555', flex: 1 }}>{room.description}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                          <span style={{ 
                            padding: '5px 10px', borderRadius: '15px', fontSize: '0.9rem', fontWeight: 'bold',
                            background: room.status === 'disponible' ? '#d4edda' : '#f8d7da',
                            color: room.status === 'disponible' ? '#155724' : '#721c24'
                          }}>
                            {room.status.toUpperCase()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <button 
                            onClick={() => setEditingRoom(room)}
                            style={{ flex: 1, padding: '10px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Editar
                          </button>
                          <button 
                            onClick={() => toggleRoomStatus(room.id, room.status)}
                            style={{ flex: 1, padding: '10px', background: room.status === 'disponible' ? '#ff4444' : '#00cc33', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {room.status === 'disponible' ? 'Ocupar/Bloquear' : 'Liberar'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB USUARIOS */}
        {activeTab === 'usuarios' && (
          <div style={{ color: '#333', width: '100%' }}>
            <h2 style={{ color: 'white', marginBottom: '15px' }}>Gestión de Usuarios</h2>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: 'white' }}>Buscar por nombre o email:</label>
                <input 
                  type="text" 
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Ej. Pingüino..."
                  style={{ width: '100%', padding: '8px', borderRadius: '5px', border: 'none' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: 'white' }}>Filtrar por rol:</label>
                <select 
                  value={userRoleFilter} 
                  onChange={e => setUserRoleFilter(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '5px', border: 'none' }}
                >
                  <option value="all">Todos</option>
                  <option value="admin">Administradores</option>
                  <option value="client">Clientes</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#002266', color: 'white', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Nombre</th>
                    <th style={{ padding: '10px' }}>Email</th>
                    <th style={{ padding: '10px' }}>Rol</th>
                    <th style={{ padding: '10px' }}>Verificado</th>
                    <th style={{ padding: '10px' }}>Fecha Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #eee', background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 'bold' }}>{u.name}</td>
                      <td style={{ padding: '8px 10px', color: '#555' }}>{u.email}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{ padding: '2px 6px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', background: u.role === 'admin' ? '#ffeeba' : '#e2e3e5', color: u.role === 'admin' ? '#856404' : '#383d41' }}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px' }}>{u.verified ? '✅ Sí' : '❌ No'}</td>
                      <td style={{ padding: '8px 10px', color: '#777', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#777' }}>No se encontraron usuarios.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB FINANZAS */}
        {activeTab === 'finanzas' && (
          <div style={{ width: '100%', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.1)', padding: '15px 20px', borderRadius: '8px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--cp-yellow)' }}>Ingreso Total Histórico</h2>
                <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>Todas las reservas completadas</p>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--cp-green, #00cc33)' }}>
                L. {finances.totalRevenue.toLocaleString()}
              </div>
            </div>

            <h3 style={{ color: 'white', marginBottom: '10px' }}>Reporte por Clientes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', background: 'white', color: '#333', borderRadius: '8px', padding: '15px' }}>
              {finances.clients.map(client => (
                <div key={client.userId} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#002266' }}>{client.name}</h4>
                      <div style={{ color: '#666', fontSize: '0.85rem' }}>{client.email}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#009922', fontSize: '1.1rem' }}>L. {client.totalPaid.toLocaleString()}</div>
                      <div style={{ color: '#888', fontSize: '0.85rem' }}>{client.reservationsCount} reserva(s)</div>
                    </div>
                  </div>
                  
                  {client.details.length > 0 ? (
                    <div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {client.details.map((det, i) => (
                          <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#f5f7fa', borderRadius: '4px', marginBottom: '2px', fontSize: '0.85rem' }}>
                            <span><strong>{det.roomName}</strong> ({det.period})</span>
                            <span style={{ fontWeight: 'bold', color: '#555' }}>L. {det.total.toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div style={{ color: '#aaa', fontStyle: 'italic', fontSize: '0.85rem' }}>Sin reservas registradas.</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
