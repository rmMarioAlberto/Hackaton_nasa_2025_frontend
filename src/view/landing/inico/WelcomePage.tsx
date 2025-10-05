import React, { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './css/WelcomePage.css';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const heroBackgroundImage = '/assets/img/TRAPPIST-1e_artist_impression_2018.png';

    const featureImages = {
        card1: '/assets/img/chatbox.jpg',
        card2: '/assets/img/lm-model.jpg',
        card3: '/assets/img/2000x1209.png',
    };

    // Preload the hero image for faster loading
    useEffect(() => {
        const img = new Image();
        img.src = heroBackgroundImage;
    }, []);

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
          delay: 0.2, // Reduced delay for faster load feel
          staggerChildren: 0.06,
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
            damping: 15,
            stiffness: 120,
        },
      },
    };

    const heroTitle = "Descubre los Misterios de los Exoplanetas";
    const heroSubtitle = "Explora mundos lejanos, más allá de nuestro sistema solar, en el corazón de la exploración espacial de la NASA.";

    const handleLmClick = () => {
        navigate('/login');
    };

    // Nueva función para manejar el clic en el chatbot
    const handleChatbotClick = () => {
        navigate('/chatbot');
    };

    return (
        <div className="welcome-page-container">
            <section className="hero-section">
                <motion.img 
                    src={heroBackgroundImage}
                    className="hero-background-image" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}   
                    transition={{ duration: 1, ease: "easeOut" }} // Reduced duration for faster animation
                    loading="eager" // Eager loading for hero image
                    alt="Fondo de exoplanetas"
                />
                
                <div className="hero-overlay" />
                
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
                        transition={{ staggerChildren: 0.04, delayChildren: 1 }} // Reduced delay
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
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(0,123,255,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.5 }} // Reduced delay
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
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div 
                    className="info-card" 
                    variants={itemVariants}
                    style={{ cursor: 'pointer' }}
                    onClick={handleChatbotClick} // Agregado el onClick aquí
                >
                    <div className="card-image-container">
                        <img src={featureImages.card1} alt="Chatbox de acceso" loading="lazy" />
                    </div>
                    <h3>Accede al Chatbox</h3>
                    <p>
                        Un chatbox interactivo que te permite acceder a herramientas de IA en tiempo real. Descubre miles de funcionalidades, cada una con características únicas y posibilidades de interacción avanzada.
                    </p>
                </motion.div>
                <motion.div 
                    className="info-card" 
                    variants={itemVariants}
                    style={{ cursor: 'pointer' }}
                    onClick={handleLmClick}
                >
                    <div className="card-image-container">
                        <img src={featureImages.card2} alt="Modelo de Lenguaje" loading="lazy" />
                    </div>
                    <h3>Modelos de Lenguaje (LM)</h3>
                    <p>
                        Desde modelos base hasta avanzados como GPT y Llama, la humanidad está en una búsqueda incesante para comprender y generar lenguaje natural con precisión y creatividad.
                    </p>
                </motion.div>
                <motion.div className="info-card" variants={itemVariants}>
                     <div className="card-image-container">
                        <img src={featureImages.card3} alt="Ilustración espacial" loading="lazy" />
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
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(246,114,128,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                >
                    Ver Proyectos del Hackathon
                </motion.button>
            </section>
        </div>
    );
};

export default WelcomePage;