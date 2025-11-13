import React, { useEffect, useState } from "react";
import Omulet from "../assets/omulet.svg";
import "../fonts.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Acasa.css";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";

const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  const months = {
    'ian': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mai': 4, 'iun': 5,
    'iul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
  };
  
  const parts = dateStr.split(' ');
  if (parts.length !== 3) return new Date(0);
  
  const day = parseInt(parts[0]);
  const monthStr = parts[1].toLowerCase();
  const month = months[monthStr];
  const year = parseInt(parts[2]);
  
  if (isNaN(day) || isNaN(year) || month === undefined) {
    console.warn('Invalid date format:', dateStr);
    return new Date(0);
  }
  
  return new Date(year, month, day);
};

export default function Acasa() {
  const text = "Din clipele care trec, păstrăm poveștile care rămân.";
  const [displayedText, setDisplayedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [articole, setArticole] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const articoleRef = ref(db, 'articole');
    
    const unsubscribe = onValue(articoleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const articoleArray = Object.entries(data).map(([id, articol]) => ({
          id,
          ...articol
        }));

        const articolePublicate = articoleArray
          .filter(articol => articol.status === "published" && articol.slug)
          .sort((a, b) => parseDate(b.data) - parseDate(a.data))
          .slice(0, 5);

        setArticole(articolePublicate);
      } else {
        setArticole([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getCategorie = (tags) => {
    if (!tags || !Array.isArray(tags)) return "ARTICOLE";
    return tags.slice(0, 2).join(" · ").toUpperCase() || "ARTICOLE";
  };

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
        setTimeout(() => setShowButton(true), 200);
      }
    }, 25);
    return () => clearInterval(typing);
  }, []);

  const handleReadMore = () => {
    const section = document.getElementById("ultimele-articole");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitText = () => {
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSd9sIWldWH7J1hASYMk6mr0ad9O5dmTqALWYXOWfLDVLNwQ2g/viewform";
  };

  return (
    <div className="font-[Poppins]">
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-8 md:p-6 pt-24 md:pt-32">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center justify-center text-center order-1">
            <div className="bg-black/95 rounded-3xl px-6 py-6 md:px-8 md:py-6 shadow-lg w-auto inline-block">
              <p className="text-base md:text-xl lg:text-2xl font-semibold leading-relaxed md:leading-snug relative z-10">
                {displayedText}
              </p>
              
              {showButton && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-red-600/10 rounded-3xl"
                  style={{
                    animation: 'pulse-glow 2s ease-out forwards',
                  }}
                />
              )}
            </div>
            
            {showButton && (
              <div 
                className="flex flex-col gap-3 mt-6 w-auto"
                style={{
                  animation: 'slideUpButtons 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                  transform: 'translateY(20px)',
                  opacity: 0,
                }}
              >
                <button
                  style={{
                    padding: "0.875rem 1.75rem",
                    fontSize: "1rem",
                    backgroundColor: "#0B226C",
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    fontFamily: "BabyDoll, sans-serif",
                    transform: "translateY(0)",
                    boxShadow: "0 4px 15px rgba(11, 34, 108, 0.3)",
                    width: "auto",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0056d2";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(11, 34, 108, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#0B226C";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(11, 34, 108, 0.3)";
                  }}
                  onClick={handleReadMore}
                >
                  Citește mai mult
                </button>
                <button
                  style={{
                    padding: "0.875rem 1.75rem",
                    fontSize: "1rem",
                    backgroundColor: "#EF4434",
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    fontFamily: "BabyDoll, sans-serif",
                    transform: "translateY(0)",
                    boxShadow: "0 4px 15px rgba(239, 68, 52, 0.3)",
                    width: "auto",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ff6b5b";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(239, 68, 52, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#EF4434";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(239, 68, 52, 0.3)";
                  }}
                  onClick={handleSubmitText}
                >
                  Trimite-ne textul tău
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center order-2">
            <img
              src={Omulet}
              alt="omulet illustration"
              className="w-56 md:w-80 lg:w-[420px] max-w-full"
            />
          </div>
        </div>
      </div>
      <div
        id="ultimele-articole"
        className="bg-white text-black py-12 md:py-20 px-4 md:px-12 flex flex-col items-center scroll-mt-24"
        style={{ scrollMarginTop: '6rem' }}
      >
        <div className="w-full max-w-6xl flex flex-col items-center relative">
          <div className="w-16 h-1 bg-blue-700 mb-2 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            Ultimele texte
          </h2>
          <p className="text-gray-500 mb-8 md:mb-10 text-center text-sm md:text-base max-w-2xl">
            Cele mai recente gânduri ale tinerilor autori din Colegiul Național "Vasile Alecsandri", Galați.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : articole.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nu există articole publicate momentan.</p>
            </div>
          ) : (
            <div className="relative w-full flex items-center px-2">
              <button className="carousel-button-prev hidden md:flex">&#10094;</button>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                  nextEl: ".carousel-button-next",
                  prevEl: ".carousel-button-prev",
                }}
                pagination={{ 
                  clickable: true,
                  dynamicBullets: true 
                }}
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1.2, spaceBetween: 16 },
                  768: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                  1280: { slidesPerView: 3, spaceBetween: 30 },
                }}
                className="custom-swiper w-full"
              >
                {articole.map((articol) => (
                  <SwiperSlide key={articol.id}>
                    <Link to={`/articol/${articol.slug}`} className="block h-full">
                      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 h-full flex flex-col transition-transform duration-300 hover:scale-105">
                        {articol.imagine && (
                          <img
                            src={articol.imagine}
                            alt={articol.titlu}
                            className="w-full h-48 md:h-56 object-cover"
                          />
                        )}
                        <div className="p-4 md:p-5 flex flex-col flex-grow">
                          <span className="inline-block w-fit bg-black text-white text-xs font-semibold px-2 py-1 mb-3">
                            {getCategorie(articol.tags)}
                          </span>
                          <h3 className="text-base md:text-lg font-bold mb-2">
                            {articol.titlu}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mt-auto">
                            Text de <span className="font-medium">{articol.autor}</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button className="carousel-button-next hidden md:flex">&#10095;</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}