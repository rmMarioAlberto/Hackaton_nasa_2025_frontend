// src/views/auth/login/Login.tsx

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Rocket, Star, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

interface LoginForm {
    email: string;
    password: string;
}

interface ValidationRules {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customMessage?: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<LoginForm>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof LoginForm, boolean>>>({});
    const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Reglas de validación
    const validationRules: Record<keyof LoginForm, ValidationRules> = {
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            customMessage: 'Ingresa un correo electrónico válido'
        },
        password: {
            required: true,
            minLength: 6,
            maxLength: 50,
            customMessage: 'La contraseña debe tener entre 6 y 50 caracteres'
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent): void => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Función para volver al WelcomePage
    const handleBack = (): void => {
        navigate('/');
    };

    // Validación individual de campo
    const validateField = (name: keyof LoginForm, value: string): string => {
        const rules = validationRules[name];
        let error = '';

        if (rules.required && !value.trim()) {
            error = 'Este campo es requerido';
        } else if (rules.pattern && !rules.pattern.test(value)) {
            error = rules.customMessage || 'Formato inválido';
        } else if (rules.minLength && value.length < rules.minLength) {
            error = `Mínimo ${rules.minLength} caracteres`;
        } else if (rules.maxLength && value.length > rules.maxLength) {
            error = `Máximo ${rules.maxLength} caracteres`;
        }

        return error;
    };

    // Validación en tiempo real cuando el campo pierde el foco
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name as keyof LoginForm, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validación en tiempo real solo si el campo ya fue tocado
        if (touched[name as keyof LoginForm]) {
            const error = validateField(name as keyof LoginForm, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginForm> = {};
        let isValid = true;

        // Marcar todos los campos como tocados
        const allTouched = {
            email: true,
            password: true
        };
        setTouched(allTouched);

        // Validar cada campo
        (Object.keys(formData) as Array<keyof LoginForm>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll al primer error
            const firstErrorField = document.querySelector('.input-error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            return;
        }

        setIsLoading(true);

        try {
            // Aquí va tu lógica de autenticación
            console.log('Iniciando sesión con:', formData);

            // Simulación de llamada API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simular diferentes respuestas para testing
            const mockResponses = [
                { success: true, message: 'Login exitoso' },
                { success: false, message: 'Credenciales incorrectas' },
                { success: false, message: 'Cuenta no verificada' }
            ];

            const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

            if (!response.success) {
                throw new Error(response.message);
            }

            // Redirigir después del login exitoso
            console.log('Login exitoso, redirigiendo...');
            // navigate('/dashboard');

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';

            // Mostrar error general
            setErrors({
                email: errorMessage,
                password: errorMessage.includes('credenciales') ? 'Verifica tu contraseña' : ''
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Helper para determinar el estado del campo
    const getFieldStatus = (fieldName: keyof LoginForm) => {
        if (!touched[fieldName]) return 'pristine';
        if (errors[fieldName]) return 'error';
        if (formData[fieldName]) return 'success';
        return 'pristine';
    };

    return (
        <div className="welcome-page-container">
            <div className="hero-section">
                {/* Background Image */}
                <div
                    className="hero-background-image"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920)',
                    }}
                />

                {/* Decorative Stars */}
                <div className="stars-container">
                    {[...Array(50)].map((_, i) => (
                        <Star
                            key={i}
                            className="floating-star"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                width: `${Math.random() * 3 + 2}px`,
                                height: `${Math.random() * 3 + 2}px`
                            }}
                        />
                    ))}
                </div>

                {/* Parallax Orbs */}
                <div
                    className="login-orb orb-1"
                    style={{
                        transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`
                    }}
                />
                <div
                    className="login-orb orb-2"
                    style={{
                        transform: `translate(${-mousePos.x * 0.015}px, ${-mousePos.y * 0.015}px)`
                    }}
                />

                {/* Login Content */}
                <div className="hero-content">
                    <div className="login-container">
                        <div className="login-header">
                            <Rocket className="login-icon" />
                            <h1>Bienvenido de Vuelta</h1>
                            <p className="subtitle">Continúa tu exploración del universo</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form" noValidate>
                            {/* Email Input */}
                            <div className="input-group">
                                <label htmlFor="email">Correo Electrónico</label>
                                <div className="input-wrapper">
                                    <Mail className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="tu@email.com"
                                        className={
                                            `${
                                                getFieldStatus('email') === 'error' ? 'input-error' :
                                                getFieldStatus('email') === 'success' ? 'input-success' : ''
                                            }`
                                        }
                                        disabled={isLoading}
                                        autoComplete="email"
                                    />
                                    {getFieldStatus('email') === 'success' && (
                                        <CheckCircle className="input-icon status-icon success" size={16} />
                                    )}
                                    {getFieldStatus('email') === 'error' && (
                                        <AlertCircle className="input-icon status-icon error" size={16} />
                                    )}
                                </div>
                                {errors.email && (
                                    <span className="error-message">
                                        <AlertCircle size={14} />
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="input-group">
                                <label htmlFor="password">Contraseña</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="••••••••"
                                        className={
                                            `${
                                                getFieldStatus('password') === 'error' ? 'input-error' :
                                                getFieldStatus('password') === 'success' ? 'input-success' : ''
                                            }`
                                        }
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                    {getFieldStatus('password') === 'success' && (
                                        <CheckCircle className="input-icon status-icon success" size={16} />
                                    )}
                                    {getFieldStatus('password') === 'error' && (
                                        <AlertCircle className="input-icon status-icon error" size={16} />
                                    )}
                                </div>
                                {errors.password && (
                                    <span className="error-message">
                                        <AlertCircle size={14} />
                                        {errors.password}
                                    </span>
                                )}
                                {!errors.password && formData.password && (
                                    <span className="password-strength">
                                        {formData.password.length >= 8 ? '🔒 Contraseña segura' : '⚠️ Contraseña débil'}
                                    </span>
                                )}
                            </div>

                            {/* Botones de acción */}
                            <div className="login-buttons">
                                <button
                                    type="button"
                                    className="back-button"
                                    onClick={handleBack}
                                    disabled={isLoading}
                                >
                                    <ArrowLeft size={18} />
                                    Volver
                                </button>

                                <button
                                    type="submit"
                                    className={`explore-button login-submit ${
                                        isLoading ? 'loading' : ''
                                    } ${
                                        Object.keys(errors).length > 0 ? 'has-errors' : ''
                                    }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="loading-spinner">
                                            <Rocket className="spinning-icon" />
                                            Iniciando sesión...
                                        </span>
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <h2>Explora el Universo de Exoplanetas</h2>
                <p>
                    Descubre miles de mundos más allá de nuestro sistema solar.
                    Accede a datos científicos, visualizaciones 3D y más.
                </p>
            </div>
        </div>
    );
};

export default Login;