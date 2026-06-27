import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  useEffect(() => {
    // Auto-scroll del carrusel de habitaciones (similar al original)
    const galleryGrid = document.querySelector('.gallery-grid');
    let interval;
    if (galleryGrid) {
      interval = setInterval(() => {
        const scrollAmount = galleryGrid.clientWidth * 0.8;
        if (galleryGrid.scrollLeft + galleryGrid.clientWidth >= galleryGrid.scrollWidth - 10) {
          galleryGrid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          galleryGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 3500);
    }
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hotel-page">
      <div className="game-container">
        
        {/* Top Header Bar */}
        <header className="top-header">
          <div className="brand-container">
            <div className="hotel-logo">
              <div className="logo-circle">
                <img src="/img/penguin_mascot.png" alt="Mascota Pingüino" className="logo-penguin-img" />
              </div>
              <div className="logo-text">
                <span className="logo-title">HOTEL PENGUIN</span>
                <span className="logo-subtitle">PARADISE</span>
                <div className="stars">⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>

          <nav className="game-nav">
            <ul>
              <li><a href="#" className="nav-btn active"><span className="btn-icon">🏠</span> INICIO</a></li>
              <li><a href="#habitaciones" className="nav-btn"><span className="btn-icon">🛎️</span> HABITACIONES</a></li>
              <li><Link to="/login" className="nav-btn"><span className="btn-icon">📅</span> RESERVAS</Link></li>
            </ul>
          </nav>

          <div className="auth-buttons">
            <Link to="/login" className="header-btn btn-login">
              <span className="user-icon">👤</span> INICIAR SESIÓN
            </Link>
            <Link to="/register" className="header-btn btn-register">
              <span className="register-icon">👤➕</span> REGISTRARSE
            </Link>
          </div>
        </header>

        {/* Main Hero Area */}
        <main className="hero-area">
          <div className="welcome-panel">
            <h1 className="welcome-title">¡BIENVENIDO A TU AVENTURA EN EL MEJOR HOTEL!</h1>
            <p className="welcome-desc">
              Disfruta de unas vacaciones increíbles llenas de diversión y comodidad en el hotel más helado de la isla.
            </p>
            <div className="welcome-actions">
              <Link to="/login" className="hero-action-btn btn-reserve-now">
                <span className="icon">🔔</span> RESERVAR AHORA
              </Link>
              <button className="hero-action-btn btn-promotions">
                <span className="icon">🎁</span> VER PROMOCIONES
              </button>
            </div>
          </div>

          <div className="pool-scene">
            <div className="penguin-green-decor">
              <div className="penguin-bubble">¡Sube el volumen a la diversión! 🎧</div>
              <span className="penguin-emoji">🐧💚</span>
            </div>
            <div className="pool-water">
              <div className="penguin-pool-1">🕶️🐧🍹</div>
              <div className="penguin-pool-2">🐧💜🧣</div>
            </div>
          </div>

          <div className="hotel-building-decor">
            <Link to="/login" className="welcome-bubble-box" style={{ textDecoration: 'none', color: '#002266' }}>
              <div className="p-avatar">🐧💜</div>
              <div className="p-text">
                <strong>¡Hola, Pingüino!</strong>
                <span>Inicia sesión para ver tus reservas y puntos.</span>
              </div>
            </Link>
          </div>
        </main>

        {/* Sección de Habitaciones Reales */}
        <section className="rooms-gallery" id="habitaciones">
          <div className="gallery-header">
            <h2>HABITACIONES DEL RESORT</h2>
            <p>Vive la experiencia real del confort polar en nuestras suites de lujo combinadas con la magia del juego</p>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="/img/habitacion_hotel_1.png" alt="Suite Iglú Deluxe" className="room-real-img" />
              <div className="room-overlay">
                <h3>Suite Iglú Deluxe</h3>
                <p>Una hermosa suite de hielo con vistas espectaculares a las auroras boreales.</p>
                <div className="room-footer-row">
                  <span className="room-tag">L. 350 / Noche</span>
                  <Link to="/login" className="room-reserve-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Reservar Cuarto 🛎️</Link>
                </div>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/img/habitacion_hotel_2.png" alt="Cabaña Ventisca" className="room-real-img" />
              <div className="room-overlay">
                <h3>Cabaña Ventisca</h3>
                <p>Cabaña rústica con balcón privado y fogata de gas.</p>
                <div className="room-footer-row">
                  <span className="room-tag">L. 250 / Noche</span>
                  <Link to="/login" className="room-reserve-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Reservar Cuarto 🛎️</Link>
                </div>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/img/habitacion_hotel_3.png" alt="Domo Glaciar Premium" className="room-real-img" />
              <div className="room-overlay">
                <h3>Domo Glaciar Premium</h3>
                <p>Domo geodésico de cristal reforzado ubicado en la cima del glaciar más alto.</p>
                <div className="room-footer-row">
                  <span className="room-tag">L. 500 / Noche</span>
                  <Link to="/login" className="room-reserve-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Reservar Cuarto 🛎️</Link>
                </div>
              </div>
            </div>
            <div className="gallery-item">
              <img src="/img/habitacion_hotel_4.png" alt="Refugio Ventisquero" className="room-real-img" />
              <div className="room-overlay">
                <h3>Refugio Ventisquero</h3>
                <p>Un refugio acogedor perfecto para aventureros de la isla.</p>
                <div className="room-footer-row">
                  <span className="room-tag">L. 180 / Noche</span>
                  <Link to="/login" className="room-reserve-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Reservar Cuarto 🛎️</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
