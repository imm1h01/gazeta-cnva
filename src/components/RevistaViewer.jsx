import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { Document, Page, pdfjs } from 'react-pdf';
import { Navigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs?v=${new Date().getTime()}`;

const PdfPageDisplay = ({ pageNum, spreadLength, isLeft, onError, userZoom, isMobile }) => {
    const getBaseWidth = () => {
        if (isMobile) {
            return spreadLength === 1 ? 300 : 280;
        }
        return spreadLength === 1 ? 700 : 400;
    };

    const baseWidth = getBaseWidth();
    const { id } = useParams();

    if (id && id.endsWith('.pdf')) {
        return <Navigate to="/404" replace />;
    }

    return (
        <div className="relative rounded-xl shadow-2xl overflow-hidden">
            <div className={`w-full h-full flex items-center justify-center relative transform transition-all duration-500`}>
                <Page
                    pageNumber={pageNum}
                    width={baseWidth * userZoom}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                        <div className="flex items-center justify-center h-full w-full p-4 min-h-[300px] md:min-h-[400px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
                        </div>
                    }
                />
            </div>
            {!isMobile && (
                <div className={`absolute top-2 bottom-2 w-4 bg-gradient-to-r from-gray-400/20 to-transparent ${
                    isLeft ? '-right-4' : '-left-4'
                } rounded-lg ${isLeft ? 'rotate-180' : ''}`}></div>
            )}

            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {pageNum}
            </div>
        </div>
    );
};

export default function RevistaViewer() {
    const { id } = useParams();
    const [revistaData, setRevistaData] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingPdf, setLoadingPdf] = useState(true);
    const [error, setError] = useState(null);
    const [currentSpread, setCurrentSpread] = useState(0);
    const [numPages, setNumPages] = useState(null);
    const [userZoom, setUserZoom] = useState(1.0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);

    const pdfPathUrl = revistaData ? `/revista/${revistaData.pdfUrl}` : null;

    const zoomIn = useCallback(() => {
        setUserZoom(prev => Math.min(prev + 0.2, 3.0));
    }, []);

    const zoomOut = useCallback(() => {
        setUserZoom(prev => Math.max(prev - 0.2, 0.5));
    }, []);

    const generateSpreads = useCallback((total) => {
        if (!total) return [];

        if (isMobile) {
            const spreads = [];
            for (let i = 1; i <= total; i++) {
                spreads.push([i]);
            }
            return spreads;
        } else {
            const spreads = [];
            spreads.push([1]);
            for (let i = 2; i <= total; i += 2) {
                if (i + 1 <= total) {
                    spreads.push([i, i + 1]);
                } else {
                    spreads.push([i]);
                }
            }
            return spreads;
        }
    }, [isMobile]);

    const spreads = useMemo(() => generateSpreads(numPages), [numPages, generateSpreads]);

    useEffect(() => {
        const fetchRevista = async () => {
            if (!id) {
                setError("ID-ul revistei este invalid");
                setLoadingData(false);
                return;
            }

            try {
                const revistaRef = ref(db, `reviste/${id}`);
                const snapshot = await get(revistaRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setRevistaData(data);

                    if (!data.pdfUrl) {
                        setError("PDF-ul revistei nu este disponibil");
                        setLoadingPdf(false);
                    }
                } else {
                    setError(`Revista cu ID-ul "${id}" nu a fost găsită în baza de date.`);
                }
            } catch (error) {
                setError("Eroare la citirea datelor din Firebase.");
            } finally {
                setLoadingData(false);
            }
        };

        fetchRevista();
    }, [id]);

    useEffect(() => {
        if (revistaData && revistaData.pdfUrl && !pdfData && !error) {
            const fetchPdf = async () => {
                setLoadingPdf(true);
                try {
                    const response = await fetch(pdfPathUrl);

                    if (!response.ok) {
                        throw new Error(`Eroare HTTP: ${response.status}. Verificați calea: ${pdfPathUrl}`);
                    }

                    const arrayBuffer = await response.arrayBuffer();
                    setPdfData(arrayBuffer);

                } catch (err) {
                    console.error("Fetch PDF Error:", err);
                    setError(err.message || "Eroare necunoscută la preluarea PDF-ului.");
                }
            };
            fetchPdf();
        }
    }, [revistaData, pdfPathUrl, pdfData, error]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoadingPdf(false);
    };

    const handlePdfError = (err) => {
        setError(`Eroare la randare: ${err.message}. Dacă eroarea de versiune persistă, worker-ul este blocat în cache. Revedeți instrucțiunile de instalare a versiunii 5.4.296.`);
        setLoadingPdf(false);
    }

    const nextSpread = useCallback(() => {
        setCurrentSpread(prev => Math.min(prev + 1, spreads.length - 1));
    }, [spreads.length]);

    const prevSpread = useCallback(() => {
        setCurrentSpread(prev => Math.max(prev - 1, 0));
    }, []);

    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowLeft') prevSpread();
        if (e.key === 'ArrowRight') nextSpread();
    }, [nextSpread, prevSpread]);

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSpread();
        }
        if (isRightSwipe) {
            prevSpread();
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 md:pt-32 px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">Se încarcă datele...</p>
                </div>
            </div>
        );
    }

    if (error || !revistaData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 md:pt-32 px-4">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 mb-4">EROARE</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link to="/revista" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Înapoi la Reviste</Link>
                </div>
            </div>
        );
    }

    if (!pdfData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20 md:pt-32 px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">Se preiau datele PDF-ului...</p>
                </div>
            </div>
        );
    }

    const currentPageNumbers = spreads[currentSpread] || [];
    const totalSpreads = spreads.length;

    return (
        <div className="font-[Poppins] min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20 md:pt-32 pb-8"
             onContextMenu={handleContextMenu}
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                <div className="bg-black/50 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6 mb-6 md:mb-8 border border-gray-800">
                    <div className="flex flex-col gap-4">
                        <div className="flex-1 text-center">
                            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-2 line-clamp-2">
                                {revistaData.titlu}
                            </h1>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center justify-center gap-3 order-2 sm:order-1">
                                <button
                                    onClick={prevSpread}
                                    disabled={currentSpread === 0}
                                    className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded disabled:opacity-50 text-sm md:text-base"
                                >
                                    Înapoi
                                </button>
                                <span className="text-white text-sm md:text-base min-w-[60px] text-center">
                                    {currentSpread + 1} / {totalSpreads || '?'}
                                </span>
                                <button
                                    onClick={nextSpread}
                                    disabled={currentSpread === totalSpreads - 1}
                                    className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded disabled:opacity-50 text-sm md:text-base"
                                >
                                    Înainte
                                </button>
                            </div>
                            {!isMobile && (
                                <div className="flex items-center justify-center gap-3 order-1 sm:order-2">
                                    <button
                                        onClick={zoomOut}
                                        disabled={userZoom <= 0.5}
                                        className="p-1 md:p-2 bg-gray-700 text-white rounded disabled:opacity-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
                                        </svg>
                                    </button>
                                    <span className="text-white text-sm md:text-base min-w-[45px] text-center">
                                        {Math.round(userZoom * 100)}%
                                    </span>
                                    <button
                                        onClick={zoomIn}
                                        disabled={userZoom >= 3.0}
                                        className="p-1 md:p-2 bg-gray-700 text-white rounded disabled:opacity-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="relative flex justify-center items-center min-h-[50vh] md:min-h-[70vh]">
                    <div className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-700/50 shadow-2xl w-full max-w-full">
                        <Document
                            file={pdfData}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={handlePdfError}
                            loading={
                                <div className="text-white text-center p-6 md:p-10">
                                    <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                                    Se încarcă PDF-ul...
                                </div>
                            }
                        >
                            {numPages && (
                                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 md:gap-4 lg:gap-8 items-center justify-center flex-wrap`}>
                                    {currentPageNumbers.map((pageNum, index) => (
                                        <div key={pageNum} className="relative">
                                            <PdfPageDisplay
                                                pageNum={pageNum}
                                                spreadLength={currentPageNumbers.length}
                                                isLeft={index === 0}
                                                onError={handlePdfError}
                                                userZoom={userZoom}
                                                isMobile={isMobile}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Document>
                    </div>
                </div>
                <div className="text-center mt-8 md:mt-12 px-4">
                    <Link to="/revista" className="text-white underline text-sm md:text-base">
                        Înapoi la toate revistele
                    </Link>
                </div>
            </div>
        </div>
    );
}