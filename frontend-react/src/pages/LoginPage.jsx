import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as faceapi from 'face-api.js';

export default function LoginPage({ modelsLoaded }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useFaceID, setUseFaceID] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const startVideo = () => {
    setIsScanning(true);
    setScanMessage('Cargando cámara...');
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error(err);
        setScanMessage('Error al acceder a la cámara.');
        setIsScanning(false);
      });
  };

  const stopVideo = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleVideoPlay = async () => {
    if (!modelsLoaded) {
      setScanMessage('Los modelos de IA aún se están cargando...');
      return;
    }
    setScanMessage('Buscando tu rostro...');
    
    // Interval to detect face
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;
      
      const detections = await faceapi.detectSingleFace(
        videoRef.current, 
        new faceapi.SsdMobilenetv1Options()
      ).withFaceLandmarks().withFaceDescriptor();

      if (detections) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setScanMessage('¡Rostro detectado! Ingresando... 🐧');
        stopVideo();
        
        // Enviar descriptor al backend para login facial
        const descriptor = Array.from(detections.descriptor);
        loginWithFace(descriptor);
      }
    }, 500);
  };

  const toggleFaceID = () => {
    if (!useFaceID) {
      setUseFaceID(true);
      startVideo();
    } else {
      setUseFaceID(false);
      stopVideo();
    }
  };

  useEffect(() => {
    return () => stopVideo();
  }, []);

  const loginWithFace = async (descriptor) => {
    try {
      const response = await fetch('/api/auth/login-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceDescriptor: descriptor })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('penguin_token', data.token);
        localStorage.setItem('penguin_user', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      } else {
        alert(data.error || "Rostro no reconocido.");
        setUseFaceID(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
      setUseFaceID(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('penguin_token', data.token);
        localStorage.setItem('penguin_user', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      } else {
        alert(data.error || "Credenciales inválidas");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  return (
    <div className="login-body" style={{ overflowY: 'auto' }}>
      <div className="bg-container">
        <img src="/img/hotel_bg.png" alt="Hotel Background" className="bg-image" />
      </div>

      <div className="login-box" style={{ marginTop: '20px', marginBottom: '20px' }}>
        <div className="db-brand" style={{ textAlign: 'center', marginBottom: '20px' }}>
          HP<span className="brand-accent"> 🐧</span>
        </div>
        
        {!useFaceID ? (
          <form onSubmit={handleSubmit} id="login-form">
            <div className="input-group">
              <label htmlFor="email">Correo Pinguino</label>
              <input 
                type="email" 
                id="email" 
                placeholder="pinguino@hotel.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Contraseña Secreta</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '10px' }}>
              Entrar al Hotel 🚪
            </button>
            <button type="button" onClick={toggleFaceID} className="btn-action-sm" style={{ background: '#002266', color: 'white', width: '100%' }}>
              📷 Ingresar con Face ID
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Fredoka', color: '#002266' }}>Reconocimiento Facial</h3>
            <p style={{ fontSize: '14px', marginBottom: '15px' }}>{scanMessage}</p>
            {isScanning && (
              <div style={{ position: 'relative', width: '250px', height: '200px', margin: '0 auto 15px auto', overflow: 'hidden', borderRadius: '10px', border: '4px solid var(--cp-yellow)' }}>
                <video ref={videoRef} autoPlay muted onPlay={handleVideoPlay} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <button type="button" onClick={toggleFaceID} className="btn-secondary" style={{ width: '100%' }}>
              Volver a Contraseña
            </button>
          </div>
        )}

        <div className="login-footer">
          <p>¿Olvidaste tu llave? <Link to="/forgot">Recuperar acceso</Link></p>
          <p>¿Eres un pingüino nuevo? <Link to="/register">Crear cuenta</Link></p>
          <p style={{marginTop: '10px'}}><Link to="/">← Volver al Inicio</Link></p>
        </div>
      </div>
    </div>
  );
}
