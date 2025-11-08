import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, runTransaction } from "firebase/database";
import eye from "../assets/eye.svg";

export default function Articol() {
  const { id } = useParams();
  const [articol, setArticol] = useState(null);
  const [ultimeleArticole, setUltimeleArticole] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const articoleRef = ref(db, "articole");
    const unsubscribe = onValue(articoleRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const articoleArray = Object.entries(data).map(([idArticol, articolData]) => ({
          id: idArticol,
          ...articolData,
        }));

        const articolePublicate = articoleArray
          .filter((articol) => articol.status === "published")
          .sort((a, b) => new Date(b.data) - new Date(a.data));

        const articolCurent = articolePublicate.find((art) => art.id === id);
        setArticol(articolCurent);

        const ultimele = articolePublicate
          .filter((art) => art.id !== id)
          .slice(0, 3);
        setUltimeleArticole(ultimele);
      }
      setLoading(false);
    });
    const articolViewsRef = ref(db, `articole/${id}/views`);
    runTransaction(articolViewsRef, (currentViews) => {
      return (currentViews || 0) + 1;
    });

    return () => unsubscribe();
  }, [id]);

  const getCategorie = (tags) => {
    if (!tags || !Array.isArray(tags)) return "ARTICOLE";
    return tags.slice(0, 2).join(" · ").toUpperCase() || "ARTICOLE";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!articol) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Articolul nu a fost găsit</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[Poppins] min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={articol.imagine}
                alt={articol.titlu}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="bg-black text-white text-xs font-semibold px-3 py-1 rounded">
                    {getCategorie(articol.tags)}
                  </span>
                  <span className="text-gray-500 text-sm">{articol.data}</span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <img src={eye} alt="vizualizări" className="w-4 h-4" />
                    {articol.views ?? 0} vizualizări
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  {articol.titlu}
                </h1>
                <p className="text-gray-600 mb-6 text-lg">
                  De{" "}
                  <span className="font-semibold text-gray-800">
                    {articol.autor}
                  </span>
                </p>
                <div
                  className="prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: articol.continut }}
                />
              </div>
            </article>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-3">
                Ultimele articole
              </h2>
              <div className="space-y-6">
                {ultimeleArticole.map((articol) => (
                  <Link
                    key={articol.id}
                    to={`/articol/${articol.id}`}
                    className="block group hover:no-underline"
                  >
                    <div className="flex flex-col space-y-3">
                      <img
                        src={articol.imagine}
                        alt={articol.titlu}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-tight mb-1">
                          {articol.titlu}
                        </h3>
                        <p className="text-xs text-gray-500">{articol.data}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}