// src/components/landing/ParallaxLanding.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Rocket, Star, Globe, Search, Satellite, Zap, ArrowRight, Play, Pause, ArrowDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './css/ParallaxLanding.css';

// Datos de exoplanetas (sin cambios)
const exoplanets = [
    {
        id: 1,
        name: "KEPLER-186F",
        type: "SUPER-TIERRA",
        distance: "500 AÑOS LUZ",
        size: "1.1 RADIOS TERRESTRES",
        temperature: "-85°C",
        habitable: true,
        description: "El primer planeta del tamaño de la Tierra descubierto en la zona habitable de una estrella. Un mundo de posibilidades infinitas.",
        color: "#00F0FF",
        glow: "0 0 30px rgba(0, 240, 255, 0.7)",
        image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400"
    },
    {
        id: 2,
        name: "TRAPPIST-1E",
        type: "PLANETA ROCOSO",
        distance: "40 AÑOS LUZ",
        size: "0.92 RADIOS TERRESTRES",
        temperature: "-53°C",
        habitable: true,
        description: "Parte de un sistema de 7 planetas que orbitan una estrella enana ultrafría. Un sistema solar en miniatura.",
        color: "#FF00F5",
        glow: "0 0 30px rgba(255, 0, 245, 0.7)",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400"
    },
    {
        id: 3,
        name: "HD 209458 B",
        type: "JÚPITER CALIENTE",
        distance: "150 AÑOS LUZ",
        size: "1.38 RADIOS DE JÚPITER",
        temperature: "1130°C",
        habitable: false,
        description: "El primer exoplaneta descubierto por tránsito y con atmósfera detectada. Un gigante gaseoso incandescente.",
        color: "#FFD600",
        glow: "0 0 30px rgba(255, 214, 0, 0.7)",
        image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400"
    },
    {
        id: 4,
        name: "PROXIMA B",
        type: "PLANETA TERRESTRE",
        distance: "4.24 AÑOS LUZ",
        size: "1.17 RADIOS TERRESTRES",
        temperature: "-39°C",
        habitable: true,
        description: "El exoplaneta más cercano a la Tierra, orbitando nuestra estrella vecina más cercana. Próximo destino interestelar.",
        color: "#9D00FF",
        glow: "0 0 30px rgba(157, 0, 255, 0.7)",
        image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400"
    }
];

const ParallaxLanding: React.FC = () => {
    const navigate = useNavigate();
    const [currentPlanet, setCurrentPlanet] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, 150]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (!autoRotate) return;

        const interval = setInterval(() => {
            setCurrentPlanet((prev) => (prev + 1) % exoplanets.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [autoRotate, exoplanets.length]);

    const handleExploreClick = () => {
        navigate('/login');
    };
    const handleScrollToContent = () => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const nextPlanet = () => {
        setCurrentPlanet((prev) => (prev + 1) % exoplanets.length);
    };

    const prevPlanet = () => {
        setCurrentPlanet((prev) => (prev - 1 + exoplanets.length) % exoplanets.length);
    };

    const selectPlanet = (index: number) => {
        setCurrentPlanet(index);
    };

    const currentExoplanet = exoplanets[currentPlanet];

    return (
        <div className="gtavi-landing immediate-content" ref={containerRef}>
            <div className="animated-bg">
                <div className="stars-field" />
                <div className="nebula-purple" />
                <div className="nebula-cyan" />
                <div className="galaxy-core" />
            </div>
            <motion.div
                className="parallax-layer layer-1"
                style={{
                    y: useTransform(() => y1.get() + mousePosition.y * 0.3),
                    x: mousePosition.x * 0.3
                }}
            />
            <motion.div
                className="parallax-layer layer-2"
                style={{
                    y: useTransform(() => y2.get() + mousePosition.y * 0.2),
                    x: mousePosition.x * 0.2
                }}
            />
            <motion.div
                className="parallax-layer layer-3"
                style={{
                    y: useTransform(() => y3.get() + mousePosition.y * 0.1),
                    x: mousePosition.x * 0.1
                }}
            />
            <section className="hero-section immediate-hero">
                <div className="hero-vignette" />
                <div className="hero-scanlines" />

                <div className="hero-content">
                    <div className="title-decoration">
                        <div className="decoration-line" />
                        <Sparkles className="decoration-icon" />
                        <div className="decoration-line" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="title-container"
                    >
                        <h1 className="hero-title">
                            <span className="title-line title-subtle">EXPLORA EL</span>
                            <span className="title-line title-main">
                                <span className="title-gradient">COSMOS</span>
                                <span className="title-glitch">COSMOS</span>
                            </span>
                            <span className="title-line title-accent">INFINITO</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="hero-subtitle"
                    >
                        DESCUBRE MUNDOS MÁS ALLÁ DE TU IMAGINACIÓN
                        <br />
                        DONDE CADA PLANETA ESCONDE SECRETOS CÓSMICOS
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="hero-buttons"
                    >
                        <motion.button
                            className="cta-button primary"
                            onClick={handleExploreClick}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 40px rgba(0, 240, 255, 0.6)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="button-text">EXPLORAR PLANETAS</span>
                            <div className="button-glow" />
                            <ArrowRight className="button-icon" />
                        </motion.button>

                        <motion.button
                            className="cta-button secondary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Search className="button-icon" />
                            <span className="button-text">VER CATÁLOGO</span>
                        </motion.button>
                    </motion.div>
                    <motion.div
                        className="scroll-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        onClick={handleScrollToContent}
                        style={{ cursor: 'pointer' }}
                    >
                        <motion.div
                            className="scroll-arrow"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <ArrowDown size={18} />
                        </motion.div>
                        <span className="scroll-text">DESPLÁZATE PARA DESCUBRIR</span>
                    </motion.div>
                </div>
            </section>
            <div className="main-content immediate-main" ref={mainContentRef}>
                <section className="planets-section immediate-planets">
                    <div className="section-vignette" />

                    <div className="container">
                        <motion.div
                            className="section-header"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="section-decoration">
                                <div className="section-line" />
                                <h2>GALERÍA DE EXOPLANETAS</h2>
                                <div className="section-line" />
                            </div>
                            <p>DESCUBRE MUNDOS INCREÍBLES MÁS ALLÁ DE NUESTRO SISTEMA SOLAR</p>
                        </motion.div>

                        <div className="planets-grid immediate-grid">
                            {exoplanets.map((planet, index) => (
                                <motion.div
                                    key={planet.id}
                                    className={`planet-card ${index === currentPlanet ? 'active' : ''}`}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                    whileHover={{
                                        y: -8,
                                        boxShadow: planet.glow,
                                        borderColor: planet.color
                                    }}
                                    onClick={() => selectPlanet(index)}
                                >
                                    <div className="card-glow" style={{ backgroundColor: planet.color }} />
                                    <div className="card-reflection" />

                                    <div
                                        className="planet-image"
                                        style={{
                                            backgroundImage: `url(${planet.image})`,
                                        }}
                                    >
                                        {planet.habitable && (
                                            <div className="habitable-badge" style={{ backgroundColor: planet.color }}>
                                                🌍 ZONA HABITABLE
                                            </div>
                                        )}
                                        <div className="planet-overlay" style={{ backgroundColor: planet.color }} />
                                    </div>

                                    <div className="planet-info">
                                        <h3>{planet.name}</h3>
                                        <span className="planet-type" style={{ color: planet.color }}>
                                            {planet.type}
                                        </span>
                                        <p>{planet.description}</p>

                                        <div className="planet-stats">
                                            <div className="stat">
                                                <Satellite size={14} />
                                                <div>
                                                    <strong>DISTANCIA</strong>
                                                    <span>{planet.distance}</span>
                                                </div>
                                            </div>
                                            <div className="stat">
                                                <Globe size={14} />
                                                <div>
                                                    <strong>TAMAÑO</strong>
                                                    <span>{planet.size}</span>
                                                </div>
                                            </div>
                                            <div className="stat">
                                                <Zap size={14} />
                                                <div>
                                                    <strong>TEMPERATURA</strong>
                                                    <span>{planet.temperature}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            className="planet-viewer immediate-viewer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            <div className="viewer-controls">
                                <motion.button
                                    onClick={prevPlanet}
                                    className="nav-button"
                                    whileHover={{ scale: 1.05, x: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ← ANTERIOR
                                </motion.button>

                                <motion.button
                                    onClick={() => setAutoRotate(!autoRotate)}
                                    className={`auto-rotate-button ${autoRotate ? 'active' : ''}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {autoRotate ? <Pause size={14} /> : <Play size={14} />}
                                    ROTACIÓN {autoRotate ? 'ON' : 'OFF'}
                                </motion.button>

                                <motion.button
                                    onClick={nextPlanet}
                                    className="nav-button"
                                    whileHover={{ scale: 1.05, x: 3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    SIGUIENTE →
                                </motion.button>
                            </div>

                            <div className="main-planet-display">
                                <motion.div
                                    key={currentPlanet}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="planet-visual"
                                    style={{
                                        boxShadow: currentExoplanet.glow,
                                        borderColor: currentExoplanet.color
                                    }}
                                >
                                    <div
                                        className="planet-image-large"
                                        style={{ backgroundImage: `url(${currentExoplanet.image})` }}
                                    />
                                    <div className="planet-orbital-ring" style={{ borderColor: currentExoplanet.color }} />
                                    <div className="planet-glow" style={{
                                        background: `radial-gradient(circle, ${currentExoplanet.color}40, transparent 70%)`
                                    }} />
                                </motion.div>

                                <motion.div
                                    className="planet-details"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <h2>{currentExoplanet.name}</h2>
                                    <div className="planet-tags">
                                        <span className="planet-type-tag" style={{
                                            backgroundColor: currentExoplanet.color,
                                            boxShadow: currentExoplanet.glow
                                        }}>
                                            {currentExoplanet.type}
                                        </span>
                                        {currentExoplanet.habitable && (
                                            <span className="habitable-tag">
                                                🌍 ZONA HABITABLE
                                            </span>
                                        )}
                                    </div>
                                    <p className="planet-description">{currentExoplanet.description}</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="final-cta-section immediate-cta">
                    <div className="cta-vignette" />
                    <div className="cta-particles" />

                    <motion.div
                        className="cta-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <motion.div
                            className="cta-icon-container"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Rocket className="cta-icon" />
                        </motion.div>

                        <h2>¿LISTO PARA EL DESPEGUE?</h2>
                        <p>ACCEDE A DATOS CIENTÍFICOS EXCLUSIVOS Y ÚNETE A LA PRÓXIMA GENERACIÓN DE EXPLORADORES ESPACIALES</p>

                        <motion.button
                            className="cta-button primary large"
                            onClick={handleExploreClick}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 0 40px rgba(0, 240, 255, 0.7)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="button-text">INICIAR EXPLORACIÓN</span>
                            <div className="button-glow" />
                            <Rocket className="button-icon" />
                        </motion.button>
                    </motion.div>
                </section>
            </div>

            <div className="floating-particles">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -80, 0],
                            opacity: [0, 0.8, 0],
                            scale: [0, 0.8, 0],
                        }}
                        transition={{
                            duration: 2.5 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 4,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ParallaxLanding;