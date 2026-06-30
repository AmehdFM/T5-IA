import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [type, setType] = useState('password');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type })
      });

      const data = await response.json();
      setMessage(data.message || "Solicitud enviada");
    } catch (err) {
      console.error(err);
      setMessage("Error de conexión");
    }
  };

  return (
    <div className="login-body">
      <div className="bg-container">
        <img src="/img/hotel_bg.png" alt="Hotel Background" className="bg-image" />
      </div>

      <div className="login-box">
        <div className="db-brand" style={{ textAlign: 'center', marginBottom: '20px' }}>
          HP<span className="brand-accent"> 🐧 Ayuda</span>
        </div>
        
        {message ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#4CAF50', fontWeight: 'bold', marginBottom: '20px' }}>{message}</p>
            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px' }}>
              Volver al inicio
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} id="forgot-form">
            <div className="input-group">
              <label>Correo Pinguino</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="input-group">
              <label>¿Qué olvidaste?</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="password">Mi Contraseña</option>
                <option value="user">Mi Nombre de Usuario</option>
              </select>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Enviar Ayuda 🛟
            </button>
          </form>
        )}

        <div className="login-footer" style={{ marginTop: '20px' }}>
          <p><Link to="/login">← Volver al Login</Link></p>
        </div>
      </div>
    </div>
  );
}
