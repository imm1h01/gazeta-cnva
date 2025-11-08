import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";

export default function Publicatii() {
  const [articole, setArticole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
          .filter(articol => articol.status === "published")
          .sort((a, b) => new Date(b.data) - new Date(a.data));

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

  const filteredArticole = articole.filter(articol =>
    articol.titlu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    articol.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (articol.tags && articol.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    )) ||
    (articol.rezumat && articol.rezumat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

        {filteredArticole.length === 0 ? (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {filteredArticole.map((articol) => (
              <Link 
                key={articol.id} 
                to={`/articol/${articol.id}`}
                className="block group hover:no-underline"
              >
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-2px] lg:group-hover:translate-y-[-4px] h-full flex flex-col">
                  <img
                    src={articol.imagine}
                    alt={articol.titlu}
                    className="w-full h-40 lg:h-48 object-cover"
                  />
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
        )}

        {filteredArticole.length > 0 && (
          <div className="text-center mt-8 lg:mt-12">
            <p className="text-gray-600 text-sm lg:text-base">
              Afișate {filteredArticole.length} din {articole.length} articole
              {searchTerm && ` pentru "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}