// src/view/chatbot/ChatbotView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './css/ChatbotView.css';

// Definimos un tipo para la estructura de cada mensaje
interface Message {
    text: string;
    sender: 'bot' | 'user';
}

const ChatbotView: React.FC = () => {
    const navigate = useNavigate();
    const [isChatActive, setIsChatActive] = useState(false);

    // --- LÓGICA DEL CHATBOT ---
    const [messages, setMessages] = useState<Message[]>([
        { text: '¡Hola! Soy tu asistente especializado. ¿Qué te gustaría saber sobre los exoplanetas?', sender: 'bot' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- CORRECCIONES DE SCROLL ---
    // 1. Se asegura de que la vista siempre cargue desde arriba.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    // 2. Hace scroll suave hacia arriba cuando el chat se activa.
    useEffect(() => {
        if (isChatActive) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [isChatActive]);

    // 3. Hace scroll hacia el último mensaje dentro de la ventana del chat.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: Message = { text: userInput, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        if (!isChatActive) {
            setIsChatActive(true);
        }

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: currentInput }),
            });

            if (!response.ok) {
                throw new Error('La respuesta del servidor no fue exitosa');
            }

            const data = await response.json();
            const botMessage: Message = { text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Error al obtener respuesta del chatbot:", error);
            const errorMessage: Message = { text: 'Lo siento, no pude procesar tu solicitud. Intenta de nuevo.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const exitItemVariants: Variants = {
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
        hidden: { y: 50, opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const handleBackClick = () => {
        navigate('/');
    };
    
    const BackButton = () => (
        <motion.button 
            className="back-button-pro"
            onClick={handleBackClick}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Volver al inicio"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </motion.button>
    );

    return (
        <div className="chatbot-view-container">
            <motion.div
                className="chatbot-header"
                variants={exitItemVariants}
                animate={isChatActive ? "hidden" : "visible"}
            >
                <h1>Chatbot de Exoplanetas</h1>
                <p>Explora el universo mediante conversación</p>
            </motion.div>

            <div className={`chatbot-content ${isChatActive ? 'active' : ''}`}>
                <motion.div 
                    className="card-wrapper"
                    variants={exitItemVariants}
                    animate={isChatActive ? "hidden" : "visible"}
                >
                    <AnimatePresence>
                        {!isChatActive && <BackButton />}
                    </AnimatePresence>
                    <div className="chatbot-info">
                        <div className="chatbot-description">
                            <h2>Descubre los Secretos del Cosmos</h2>
                            <p>
                                Nuestro chatbot te permite explorar mundos distantes, aprender sobre sus características y descubrir los últimos hallazgos de la NASA.
                            </p>
                            <ul>
                                <li>Información actualizada</li>
                                <li>Datos científicos verificados</li>
                                <li>Exploración interactiva</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="card-wrapper"
                    initial={false}
                    animate={{ width: isChatActive ? '100%' : 'auto' }}
                    transition={{duration: 0.8, ease: 'easeInOut'}}
                >
                    <motion.div 
                        className="chatbot-interface" 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="chat-window">
                            <div className="chat-header">
                                <AnimatePresence>
                                    {isChatActive && <BackButton />}
                                </AnimatePresence>
                                <div className="chat-bot-avatar"><span>🤖</span></div>
                                <div className="chat-bot-info">
                                    <h3>Asistente de Exoplanetas</h3>
                                    <span className="status">En línea</span>
                                </div>
                            </div>
                            <div className="chat-messages">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="message bot-message typing-indicator">
                                        <span></span><span></span><span></span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="chat-input-container">
                                <input 
                                    type="text" 
                                    placeholder="Escribe tu pregunta..." 
                                    className="chat-input"
                                    value={userInput}
                                    onChange={handleUserInputChange}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    disabled={isLoading}
                                />
                                <button className="send-button" onClick={handleSendMessage} disabled={isLoading}>
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                className="chatbot-features"
                variants={exitItemVariants}
                animate={isChatActive ? "hidden" : "visible"}
            >
                <h2>Características Destacadas</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🌌</div>
                        <h3>Exploración Espacial</h3>
                        <p>Accede a datos de misiones espaciales y telescopios</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Análisis Científico</h3>
                        <p>Información detallada sobre características planetarias</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Actualizaciones NASA</h3>
                        <p>Últimos descubrimientos y noticias espaciales</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ChatbotView;