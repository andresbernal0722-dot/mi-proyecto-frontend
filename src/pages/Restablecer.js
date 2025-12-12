import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, Music, Lightbulb, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  // Validación de email
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'El email es requerido';
    else if (!validateEmail(email)) newErrors.email = 'Formato de email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiMessage('');

    try {
      const response = await axios.post('http://localhost:4000/api/usuarios/restablecer', {
        email,
      });

      // Backend envía mensaje de éxito
      setApiMessage(response.data.message || 'Correo enviado exitosamente');
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setApiMessage(error.response.data.message);
      } else {
        setApiMessage('Error al enviar el correo. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setApiMessage('');
    try {
      const response = await axios.post('http://localhost:4000/api/usuarios/restablecer', {
        email,
      });
      setApiMessage(response.data.message || 'Correo reenviado exitosamente');
    } catch (error) {
      console.error(error);
      setApiMessage('Error al reenviar el correo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
        <div className="absolute top-10 left-10 text-purple-400/30"><Music className="h-20 w-20" /></div>
        <div className="absolute top-1/4 right-20 text-purple-500/20"><Lightbulb className="h-16 w-16" /></div>
        <div className="absolute bottom-20 left-1/4 text-purple-400/20"><Star className="h-12 w-12" /></div>
        <div className="absolute bottom-1/4 right-10 text-purple-500/30"><Music className="h-14 w-14" /></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Restablecer Contraseña
                  </span>
                </h1>
                <p className="text-gray-400">
                  Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
                </p>
              </div>

              {/* Formulario */}
              <div className="bg-gradient-to-br from-purple-900/30 to-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                          errors.email ? 'border-red-500' : 'border-purple-500/30 hover:border-purple-500/50'
                        }`}
                        placeholder="tu@email.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>Enviar Enlace</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  {apiMessage && <p className="text-center mt-2 text-sm text-green-400">{apiMessage}</p>}

                  <div className="mt-6 text-center">
                    <Link to="/login" className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-300">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver al inicio de sesión</span>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Pantalla de éxito */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Correo Enviado
                  </span>
                </h1>
                <p className="text-gray-400">Hemos enviado un enlace de restablecimiento a</p>
                <p className="text-purple-300 font-semibold mt-1">{email}</p>
                {apiMessage && <p className="mt-2 text-sm text-green-400">{apiMessage}</p>}
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-purple-200 mb-3">¿Qué sigue?</h3>
                    <div className="space-y-3 text-gray-300 text-sm">
                      <p>1. Revisa tu bandeja de entrada</p>
                      <p>2. Haz clic en el enlace del correo</p>
                      <p>3. Crea tu nueva contraseña</p>
                    </div>
                  </div>

                  <div className="border-t border-purple-500/20 pt-6">
                    <p className="text-center text-gray-400 text-sm mb-4">¿No recibiste el correo?</p>
                    <div className="space-y-3">
                      <button
                        onClick={handleResendEmail}
                        disabled={isLoading}
                        className={`w-full bg-purple-800/50 hover:bg-purple-700/50 py-2 rounded-lg font-medium transition-all duration-300 border border-purple-500/30 hover:border-purple-500/50 ${
                          isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? 'Enviando...' : 'Reenviar correo'}
                      </button>

                      <Link
                        to="/login"
                        className="w-full block text-center text-purple-400 hover:text-purple-300 py-2 transition-colors duration-300"
                      >
                        Intentar con otro email
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 text-center border-t border-purple-500/20 pt-6">
                    <Link
                      to="/login"
                      className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver al inicio de sesión</span>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
