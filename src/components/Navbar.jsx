import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo_alb.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
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
        <Link to="/despre-noi" onClick={closeMenu}>Despre noi</Link>
        <Link to="/texte" onClick={closeMenu}>Texte</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
      </div>
    </nav>
  );
}