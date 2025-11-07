import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Acasa from "./pages/Acasa.js";
import Echipa from "./pages/Echipa.js";
import Publicatii from "./pages/Publicatii.js";
import Contact from "./pages/Contact.js";
import Admin from "./pages/Admin.js";
import Dashboard from "./pages/Dashboard.js";
import NewArticlePage from "./pages/NewArticlePage.js";
import Articol from "./pages/Articol.js";
import logo from "./assets/logo_alb.svg";
import omulet from "./assets/omulet.svg";
import { Toaster } from "./components/toaster.jsx";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-32 px-4 text-white bg-black min-h-[60vh]">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-8 text-gray-400">Pagina pe care o cauți nu există.</p>
      <Link
        to="/"
        className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
      >
        Înapoi la Acasă
      </Link>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const hideBars =
    location.pathname === "/admin" ||
    location.pathname === "/admin/dashboard" ||
    location.pathname.startsWith("/admin/") ||
    location.pathname.startsWith("/admin/dashboard/");

  const footerNavLinks = [
    { name: "Acasă", path: "/" },
    { name: "Echipă", path: "/echipa" },
    { name: "Texte", path: "/publicatii" },
    { name: "Revistă", path: null },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="App flex flex-col min-h-screen">
      {!hideBars && <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Acasa />} />
          <Route path="/echipa" element={<Echipa />} />
          <Route path="/publicatii" element={<Publicatii />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/new-article" element={<NewArticlePage />} />
          <Route path="/admin/edit-article/:articleId" element={<NewArticlePage />} />
          <Route path="/articol/:id" element={<Articol />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!hideBars && (
        <footer className="bg-black text-white p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img src={omulet} alt="Gen Revista Logo" className="h-16 md:h-20" />
              </Link>
            </div>
            <div className="flex flex-col space-y-2 text-sm text-left">
              {footerNavLinks.map((link) => (
                <div key={link.name}>
                  {link.path ? (
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition duration-200"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <span className="text-gray-400 cursor-default opacity-75">{link.name}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-left md:text-right text-xs space-y-1">
              <p className="text-gray-500">
                Copyright ©2025 Gazeta CNVA.{" "}
                <span className="font-semibold text-gray-300">All Rights Reserved.</span>
              </p>
              <p className="text-gray-500">
                Made by <span className="font-semibold text-gray-300">Mihai Condrici</span>
              </p>
            </div>
          </div>
        </footer>
      )}

      <Toaster />
    </div>
  );
}

function App() {
  useEffect(() => {
    document.title = "Gazeta CNVA";
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = logo;
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;
