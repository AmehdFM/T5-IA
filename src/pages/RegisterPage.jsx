import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as faceapi from 'face-api.js';

export default function RegisterPage({ modelsLoaded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [useFaceID, setUseFaceID] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Start webcam
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
        setFaceDescriptor(Array.from(detections.descriptor));
        setScanMessage('¡Rostro escaneado con éxito! 🐧');
        stopVideo();
      }
    }, 500);
  };

  const toggleFaceID = () => {
    if (!useFaceID) {
      setUseFaceID(true);
      startVideo();
    } else {
      setUseFaceID(false);
      setFaceDescriptor(null);
      stopVideo();
    }
  };

  // Stop video if component unmounts
  useEffect(() => {
    return () => stopVideo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Usaremos la API del backend
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          faceDescriptor // Se envía el array si existe, o null
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // En una app real aquí iría el modal de 333777
        // Lo simularemos o asumiremos éxito directo para este prototipo
        alert("¡Cuenta creada exitosamente!");
        localStorage.setItem('penguin_token', data.token);
        localStorage.setItem('penguin_user', JSON.stringify(data.user));
        navigate('/client-dashboard');
      } else {
        alert(data.error || "Error al registrarse");
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
          HP<span className="brand-accent"> 🐧 Registro</span>
        </div>
        
        <form onSubmit={handleSubmit} id="register-form">
          <div className="input-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <div className="input-group" style={{ textAlign: 'center', margin: '15px 0' }}>
            <button type="button" onClick={toggleFaceID} className="btn-action-sm" style={{ background: useFaceID ? '#ff4d4d' : '#4CAF50', color: 'white', width: '100%' }}>
              {useFaceID ? '📷 Cancelar Face ID' : '📷 Agregar Face ID (Opcional)'}
            </button>
          </div>

          {useFaceID && (
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>{scanMessage}</p>
              {isScanning && (
                <div style={{ position: 'relative', width: '200px', height: '150px', margin: '0 auto', overflow: 'hidden', borderRadius: '10px', border: '3px solid var(--cp-yellow)' }}>
                  <video ref={videoRef} autoPlay muted onPlay={handleVideoPlay} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          )}
          
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Crear Cuenta 🐧
          </button>
        </form>

        <div className="login-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
          <p style={{marginTop: '10px'}}><Link to="/">← Volver al Inicio</Link></p>
        </div>
      </div>
    </div>
  );
}
