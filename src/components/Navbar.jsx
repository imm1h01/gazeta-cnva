import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo_alb.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="Gazeta CNVA logo" className="nav-logo" />
        <Link to="/" className="nav-title">Gazeta CNVA</Link>
      </div>

      <button
        className={`hamburger ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>Acasă</Link>
        <Link to="/echipa" onClick={closeMenu}>Echipă</Link>
        <Link to="/publicatii" onClick={closeMenu}>Texte</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
      </div>
    </nav>
  );
}
