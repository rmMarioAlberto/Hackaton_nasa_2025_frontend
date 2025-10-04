import React from 'react';
import { motion, Variants } from 'framer-motion';
import './css/WelcomePage.css';

// Importa tu nueva imagen de fondo
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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    const sentenceVariants: Variants = {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          // CAMBIO 1: Retrasamos el inicio de la animación del texto
          delay: 1.5, 
          staggerChildren: 0.08,
        },
      },
    };

    const wordVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 100,
        },
      },
    };

    const heroTitle = "Descubre los Misterios de los Exoplanetas";
    const heroSubtitle = "Explora mundos lejanos, más allá de nuestro sistema solar, en el corazón de la exploración espacial de la NASA.";


    return (
        <div className="welcome-page-container">
            <section className="hero-section">
                {/* CAMBIO 2: Envolvemos la imagen en un motion.div para animarla */}
                <motion.div 
                    className="hero-background-image" 
                    style={{ backgroundImage: `url(${heroBackgroundImage})` }}
                    initial={{ opacity: 0, scale: 1.1 }} // Empieza invisible y un poco más grande
                    animate={{ opacity: 1, scale: 1 }}   // Aparece y hace un suave zoom out
                    transition={{ duration: 2, ease: "easeOut" }} // Duración de la animación de la imagen
                />
                
                <motion.div
                    className="hero-content"
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1
                        variants={sentenceVariants}
                    >
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
                        // CAMBIO 3: Ajustamos el retraso del subtítulo para que coincida con la nueva secuencia
                        transition={{ staggerChildren: 0.04, delayChildren: 2.5 }}
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
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgb(0,123,255)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        // CAMBIO 4: Aumentamos el retraso del botón para que aparezca al final de todo
                        transition={{ duration: 0.5, delay: 4.5 }}
                    >
                        ¡Comienza tu viaje cósmico!
                    </motion.button>
                </motion.div>
            </section>

            {/* --- El resto del archivo no necesita cambios --- */}

            <motion.section
                className="info-section"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div className="info-card" variants={itemVariants}>
                    <div className="card-image-container">
                        <img src={exoplanetImages.card1} alt="Exoplaneta Kepler-186f" />
                    </div>
                    <h3>¿Qué es un Exoplaneta?</h3>
                    <p>
                        Un exoplaneta es un planeta que orbita una estrella diferente a nuestro Sol. La NASA ha descubierto miles, cada uno con sus propias características únicas y posibilidades de albergar vida.
                    </p>
                </motion.div>
                <motion.div className="info-card" variants={itemVariants}>
                    <div className="card-image-container">
                        <img src={exoplanetImages.card2} alt="Exoplaneta TRAPPIST-1e" />
                    </div>
                    <h3>La Búsqueda Continúa</h3>
                    <p>
                        Desde telescopios espaciales como Kepler y TESS hasta futuras misiones como el James Webb, la humanidad está en una búsqueda incesante para comprender nuestro lugar en el universo.
                    </p>
                </motion.div>
                <motion.div className="info-card" variants={itemVariants}>
                     <div className="card-image-container">
                        <img src={exoplanetImages.card3} alt="Ilustración espacial" />
                    </div>
                    <h3>Nuestro Impacto</h3>
                    <p>
                        Participa en el Hackathon NASA Space Apps Challenge 2025. Tu creatividad puede ser la clave para los próximos grandes descubrimientos en la exploración exoplanetaria.
                    </p>
                </motion.div>
            </motion.section>

            <section className="cta-section">
                 <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                 >
                    ¿Listo para Explorar?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Únete a nuestra comunidad de exploradores y científicos.
                </motion.p>
                <motion.button
                    className="cta-button"
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgb(246,114,128)" }}
                    whileTap={{ scale: 0.95 }}
                >
                    Ver Proyectos del Hackathon
                </motion.button>
            </section>
        </div>
    );
};

export default WelcomePage;