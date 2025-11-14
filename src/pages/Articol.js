import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, runTransaction } from "firebase/database";
import eye from "../assets/eye.svg";

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

    if (isNaN(day) || isNaN(year) || month === undefined) return new Date(0);

    return new Date(year, month, day);
};

export default function Articol() {
    const { slug } = useParams();
    const [articol, setArticol] = useState(null);
    const [ultimeleArticole, setUltimeleArticole] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) {
            setNotFound(true);
            setLoading(false);
            return;
        }

        const articoleRef = ref(db, 'articole');

        const unsubscribe = onValue(articoleRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const articoleArray = Object.entries(data).map(([id, articolData]) => ({
                    id,
                    ...articolData
                }));

                const articolCurent = articoleArray.find(art =>
                    art.slug && art.slug === slug && art.status === "published"
                );

                if (articolCurent) {
                    setArticol(articolCurent);
                    setNotFound(false);

                    const toateArticolele = articoleArray
                        .filter(art => art.slug && art.slug !== slug && art.status === "published")
                        .sort((a, b) => parseDate(b.data) - parseDate(a.data));
                    const ultimele = toateArticolele.slice(0, 3);

                    setUltimeleArticole(ultimele);
                } else {
                    setNotFound(true);
                }
            } else {
                setNotFound(true);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [slug]);

    useEffect(() => {
        if (articol && articol.id) {
            const articolViewsRef = ref(db, `articole/${articol.id}/views`);

            const incrementViews = async () => {
                try {
                    await runTransaction(articolViewsRef, (currentViews) => {
                        return (currentViews || 0) + 1;
                    });
                } catch (error) {
                    console.error("Error incrementing views:", error);
                }
            };

            incrementViews();
        }
    }, [articol?.id]);

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

    if (notFound || !articol) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Articolul nu a fost găsit</h1>
                    <p className="text-gray-600 mb-4">URL-ul articolului este invalid sau articolul a fost șters.</p>
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
                            {articol.imagine && (
                                <img
                                    src={articol.imagine}
                                    alt={articol.titlu}
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                            )}
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
                                    className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: articol.continut }}
                                />
                            </div>
                        </article>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-3">
                                Ultimele articole
                            </h2>
                            <div className="space-y-6">
                                {ultimeleArticole.map((articol) => (
                                    <Link
                                        key={articol.id}
                                        to={`/articol/${articol.slug}`}
                                        className="block group hover:no-underline"
                                    >
                                        <div className="flex flex-col space-y-3">
                                            {articol.imagine && (
                                                <img
                                                    src={articol.imagine}
                                                    alt={articol.titlu}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                            )}
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