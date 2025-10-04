import React from 'react';
import { motion, Variants } from 'framer-motion';
import './WelcomePage.css';

// Importar imágenes con las extensiones originales
import heroBackgroundImage from '../../../assets/portadas/portada3.jpeg';
import imageCard1 from '../../../assets/portadas/page.jpeg';
import imageCard2 from '../../../assets/portadas/protada2.png';
import imageCard3 from '../../../assets/portadas/portada3.jpeg';

const exoplanetImages = {
    card1: imageCard1,
    card2: imageCard2,
    card3: imageCard3,
};

const WelcomePage: React.FC = () => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 120, damping: 15 },
        },
    };

    const sentenceVariants: Variants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delay: 1,
                staggerChildren: 0.06,
            },
        },
    };

    const wordVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 120,
            },
        },
    };

    const heroTitle = "Descubre los Misterios de los Exoplanetas";
    const heroSubtitle = "Explora mundos lejanos, más allá de nuestro sistema solar, en el corazón de la exploración espacial de la NASA.";

    return (
        <div className="welcome-page-container">
            <section className="hero-section">
                <motion.div
                    className="hero-background-image"
                    style={{ backgroundImage: `url(${heroBackgroundImage})` }}
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2.5, ease: 'easeOut' }}
                />

                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 variants={sentenceVariants}>
                        {heroTitle.split(" ").map((word, index) => (
                            <motion.span
                                key={word + "-" + index}
                                variants={wordVariants}
                                style={{ display: 'inline-block', marginRight: '0.5rem' }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>

                    <motion.p
                        className="subtitle"
                        variants={sentenceVariants}
                        transition={{ staggerChildren: 0.04, delayChildren: 2 }}
                    >
                        {heroSubtitle.split(" ").map((word, index) => (
                            <motion.span
                                key={word + "-" + index}
                                variants={wordVariants}
                                style={{ display: 'inline-block', marginRight: '0.25rem' }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.p>

                    <motion.button
                        className="explore-button"
                        whileHover={{ scale: 1.08, boxShadow: '0px 0px 15px rgba(0,123,255,0.7)' }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 3.5 }}
                    >
                        ¡Comienza tu viaje cósmico!
                    </motion.button>
                </motion.div>
            </section>

            <motion.section
                className="info-section"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div className="info-card" variants={itemVariants}>
                    <div className="card-image-container">
                        <img
                            src={exoplanetImages.card1}
                            alt="Exoplaneta Kepler-186f"
                            loading="lazy"
                        />
                    </div>
                    <h3>¿Qué es un Exoplaneta?</h3>
                    <p>
                        Un exoplaneta es un planeta que orbita una estrella diferente a nuestro Sol. La NASA ha descubierto miles, cada uno con sus propias características únicas y posibilidades de albergar vida.
                    </p>
                </motion.div>
                <motion.div className="info-card" variants={itemVariants}>
                    <div className="card-image-container">
                        <img
                            src={exoplanetImages.card2}
                            alt="Exoplaneta TRAPPIST-1e"
                            loading="lazy"
                        />
                    </div>
                    <h3>La Búsqueda Continúa</h3>
                    <p>
                        Desde telescopios espaciales como Kepler y TESS hasta futuras misiones como el James Webb, la humanidad está en una búsqueda incesante para comprender nuestro lugar en el universo.
                    </p>
                </motion.div>
                <motion.div className="info-card" variants={itemVariants}>
                    <div className="card-image-container">
                        <img
                            src={exoplanetImages.card3}
                            alt="Ilustración espacial"
                            loading="lazy"
                        />
                    </div>
                    <h3>Nuestro Impacto</h3>
                    <p>
                        Participa en el Hackathon NASA Space Apps Challenge 2025. Tu creatividad puede ser la clave para los próximos grandes descubrimientos en la exploración exoplanetaria.
                    </p>
                </motion.div>
            </motion.section>

            <section className="cta-section">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    ¿Listo para Explorar?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    Únete a nuestra comunidad de exploradores y científicos.
                </motion.p>
                <motion.button
                    className="cta-button"
                    whileHover={{ scale: 1.08, boxShadow: '0px 0px 15px rgba(246,114,128,0.7)' }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    Ver Proyectos del Hackathon
                </motion.button>
            </section>
        </div>
    );
};

export default WelcomePage;