import React from "react";
import { Link } from "react-router-dom";
import "./AppleProducts.css"; // Asegúrate de tener este archivo CSS en el mismo directorio
import logo from "../img/logo.png";
import imagen1 from "../img/image1.jpg";
import imagen3 from "../img/image3.png";
import imagen4 from "../img/image4.jpg";
import imagen5 from "../img/image5.jpg";
import watch from "../img/watch.png";
import image6 from "../img/image6.jpg";
import appletv from "../img/appletv.png";
import imagen7 from "../img/image7.jpg";
import applemusic from "../img/applemusic.png";
import imagen8 from "../img/image8.png";
import imagen9 from "../img/image9.jpg";
import { useState } from "react";
import { AuthModal } from "./modals";
import { useAuth } from "../context/AuthContext";
const AppleProducts = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <div>
      <nav role="navigation">
        <div className="enlaces">
          <a href="#iphone">
            <img src={logo} alt="Apple logo" />
          </a>
          <a href="#iphone">iPhone</a>
          <a href="#ipad">iPad</a>
          <a href="#watch">Watch</a>
          <a href="#airpods">AirPods</a>
          <a href="#musictv">Music / TV</a>
          <a href="#imac">iMac</a>
          <Link to="/catalogo">Tienda</Link>
          <Link to="/mis-pedidos">Mis pedidos</Link>
          <button type="button" className="nav-icon-button" aria-label="Buscar">
            <span className="fas fa-search"></span>
          </button>
          {user ? (
            <div className="nav-session">
              <Link
                to={isAdmin ? "/admin" : "/mis-pedidos"}
                className="nav-session-label"
              >
                {isAdmin ? `Admin: ${user.email}` : `Hola, ${user.name || user.email}`}
              </Link>
              <button className="nav-login-button" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button className="nav-login-button" onClick={handleLoginClick}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </nav>

      {showLogin && <AuthModal onClose={handleCloseLogin} />}

      <header id="iphone">
        <div className="grid">
          <div className="span12 text-container">
            <h2>iPhone 12 y iPhone 12 mini</h2>
            <h1>Súper. Mega. Rápido.</h1>
            <h3>Muy pronto disponible en morado.</h3>
          </div>
          <div className="span12 img-container">
            <img src={imagen1} alt="" />
          </div>
        </div>
      </header>

      <section className="service">
        <div className="grid">
          <div className="span12 contenedor">
            <img src={imagen3} alt="" />
            <div className="text-container">
              <h2>
                Disfruta cuatro servicios de Apple en uno. Y aprovecha más por
                menos.
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section id="ipad" className="ipad">
        <div className="grid">
          <div className="text-container">
            <h1>iPad Pro</h1>
            <h3>El iPad en su máxima expresión</h3>
            <Link to="/catalogo" className="enlace-info">
              Más informacion <span className="fas fa-angle-right"></span>
            </Link>
          </div>
          <div className="span9">
            <img src={imagen4} alt="" />
          </div>
        </div>
      </section>

      <section id="watch" className="watch">
        <div className="grid">
          <div className="span6">
            <img src={imagen5} alt="" />
          </div>
          <div className="span6 text-container">
            <img src={watch} alt="" />
            <h1>Te ayuda a hacer más. Por menos de lo que crees.</h1>
            <Link to="/catalogo" className="enlace-info">
              Más informacion <span className="fas fa-angle-right"></span>
            </Link>
          </div>
        </div>
      </section>

      <section id="airpods" className="airpods">
        <div className="grid">
          <div className="span6 text-container">
            <h1>Airpods</h1>
            <h3>Cada uno tiene su magia.</h3>
            <Link to="/catalogo" className="enlace-info">
              Más informacion <span className="fas fa-angle-right"></span>
            </Link>
          </div>
          <div className="span6">
            <img src={image6} alt="" />
          </div>
        </div>
      </section>

      <section id="musictv" className="musictv">
        <div className="grid">
          <div className="span6 text-container">
            <div className="text">
              <img src={appletv} alt="" className="icon" />
              <h3>Obtén 1 año gratis de Apple TV+ al comprar un iPad.</h3>
              <Link to="/catalogo" className="enlace-info">
                Más informacion <span className="fas fa-angle-right"></span>
              </Link>
            </div>
            <div className="imagen">
              <img src={imagen7} alt="" />
            </div>
          </div>
          <div className="span6 text-container ct2">
            <div className="text">
              <img src={applemusic} alt="" className="icon" />
              <h3>Más de 75 millones de canciones. 3 meses gratis.</h3>
              <Link to="/catalogo" className="enlace-info">
                Más informacion <span className="fas fa-angle-right"></span>
              </Link>
            </div>
            <div className="imagen">
              <img src={imagen8} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section id="imac" className="imac">
        <div className="grid">
          <div className="span12 text-container">
            <h1>iMac</h1>
            <h2>Dile hola.</h2>
            <h3>Consulta disponibilidad más adelante.</h3>
            <Link to="/catalogo" className="enlace-info">
              Más informacion <span className="fas fa-angle-right"></span>
            </Link>
          </div>
          <div className="span12 img-container">
            <img src={imagen9} alt="" />
          </div>
        </div>
      </section>

      <section id="donde-comprar" className="tienda-cta">
        <div className="grid">
          <div className="span12 text-container">
            <h1>Explora el catálogo completo</h1>
            <h3>Precios, ediciones y disponibilidad de cada producto.</h3>
            <Link to="/catalogo" className="enlace-info">
              Ir a la tienda <span className="fas fa-angle-right"></span>
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <p>Apple</p>
        <img src={logo} alt="" />
        <p>EPN</p>
        <Link to="/admin" className="footer-admin-link">
          Admin
        </Link>
      </footer>
    </div>
  );
};

export default AppleProducts;
