import React, { useEffect, useState } from "react";
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

export default function Publicatii() {
  const [articole, setArticole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const articoleRef = ref(db, 'articole');
    
    const unsubscribe = onValue(articoleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const articoleArray = Object.entries(data).map(([id, articolData]) => ({
          id,
          ...articolData
        }));

        const articolePublicate = articoleArray
          .filter(articol => articol.status === "published" && articol.slug)
          .sort((a, b) => parseDate(b.data) - parseDate(a.data));

        setArticole(articolePublicate);
      } else {
        setArticole([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getCategorie = (tags) => {
    if (!tags || !Array.isArray(tags)) return "ARTICOLE";
    return tags.slice(0, 2).join(" · ").toUpperCase() || "ARTICOLE";
  };

  const filteredArticole = articole.filter(articol =>
    articol.titlu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articol.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (articol.tags && articol.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    )) ||
    (articol.rezumat && articol.rezumat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticole.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticole = filteredArticole.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="font-[Poppins] min-h-screen bg-gray-50 pt-40 lg:pt-52 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">Texte</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Toate textele noastre. Explorează colecția completă de articole, poezii și gânduri.
          </p>
        </div>

        <div className="mb-8 lg:mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Caută după titlu, autor, tag-uri sau conținut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 lg:px-10 lg:py-4 pl-12 rounded-xl lg:rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm lg:text-base"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {currentArticole.length === 0 ? (
          <div className="text-center py-12 lg:py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 lg:w-16 lg:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Nu s-au găsit rezultate</h3>
            <p className="text-gray-600 text-sm lg:text-base">
              {searchTerm ? `Nu am găsit articole care să corespundă cu "${searchTerm}".` : "Nu există articole publicate momentan."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {currentArticole.map((articol) => (
                <Link 
                  key={articol.id} 
                  to={`/articol/${articol.slug}`}
                  className="block group hover:no-underline"
                >
                  <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-2px] lg:group-hover:translate-y-[-4px] h-full flex flex-col">
                    {articol.imagine && (
                      <img
                        src={articol.imagine}
                        alt={articol.titlu}
                        className="w-full h-40 lg:h-48 object-cover"
                      />
                    )}
                    <div className="p-4 lg:p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <span className="inline-block bg-black text-white text-xs font-semibold px-2 py-1 lg:px-3 lg:py-1 rounded">
                          {getCategorie(articol.tags)}
                        </span>
                        <span className="text-xs lg:text-sm text-gray-500">{articol.data}</span>
                      </div>
                      
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3 group-hover:text-blue-600 transition-colors">
                        {articol.titlu}
                      </h3>
                      
                      {articol.rezumat && (
                        <p className="text-gray-600 text-sm lg:text-base mb-3 lg:mb-4 line-clamp-3 flex-grow">
                          {articol.rezumat}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-auto pt-3 lg:pt-4 border-t border-gray-100">
                        <span className="text-xs lg:text-sm font-medium text-gray-700">
                          {articol.autor}
                        </span>
                        <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                          <span className="text-xs lg:text-sm font-semibold mr-2">Citește mai mult</span>
                          <svg className="w-3 h-3 lg:w-4 lg:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                {/* Previous button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  Înapoi
                </button>

                {/* Page numbers */}
                {getPageNumbers().map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                {/* Next button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  Înainte
                </button>
              </div>
            )}
          </>
        )}

        {filteredArticole.length > 0 && (
          <div className="text-center mt-8 lg:mt-12">
            <p className="text-gray-600 text-sm lg:text-base">
              Afișate {Math.min(indexOfFirstItem + 1, filteredArticole.length)}-{Math.min(indexOfLastItem, filteredArticole.length)} din {filteredArticole.length} articole
              {searchTerm && ` pentru "${searchTerm}"`}
              {totalPages > 1 && ` • Pagina ${currentPage} din ${totalPages}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}