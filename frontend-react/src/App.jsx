import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

// Pages (to be implemented)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RoomDetail from './pages/RoomDetail';

import './styles.css';

function App() {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Cargar modelos de face-api.js en segundo plano al iniciar la app
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        console.log("Modelos de face-api.js cargados en segundo plano exitosamente.");
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error cargando modelos de face-api.js:", err);
      }
    };
    loadModels();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage modelsLoaded={modelsLoaded} />} />
        <Route path="/register" element={<RegisterPage modelsLoaded={modelsLoaded} />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        
        {/* Rutas protegidas (la lógica de protección estará dentro de cada componente) */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/room-detail" element={<RoomDetail />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
