import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Music, Lightbulb, Star, ArrowLeft } from 'lucide-react';

function RestablecerContraseña() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/usuarios/restablecer/${token}`);
        if (!response.ok) throw new Error('Token inválido o expirado');
        setTokenValido(true);
        setMensaje('Token válido. Puedes establecer una nueva contraseña.');
        setMensajeTipo('success');
      } catch (error) {
        setTokenValido(false);
        setMensaje(error.message);
        setMensajeTipo('error');
      }
    };

    verificarToken();
  }, [token]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!nuevaContraseña.trim()) {
      newErrors.nuevaContraseña = 'La contraseña es requerida';
    } else if (nuevaContraseña.length < 6) {
      newErrors.nuevaContraseña = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!confirmarContraseña.trim()) {
      newErrors.confirmarContraseña = 'Debes confirmar la contraseña';
    } else if (nuevaContraseña !== confirmarContraseña) {
      newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMensaje('');

    try {
      const response = await fetch(`http://localhost:4000/api/usuarios/restablecer/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaContraseña }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al restablecer la contraseña.');
      }

      setMensaje('Contraseña restablecida con éxito.');
      setMensajeTipo('success');

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMensaje(error.message);
      setMensajeTipo('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setNuevaContraseña(e.target.value);
    if (errors.nuevaContraseña) setErrors(prev => ({ ...prev, nuevaContraseña: '' }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmarContraseña(e.target.value);
    if (errors.confirmarContraseña) setErrors(prev => ({ ...prev, confirmarContraseña: '' }));
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
          {tokenValido === false ? (
            <>
              {/* Token Inválido */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Token Inválido
                  </span>
                </h1>
                <p className="text-gray-400">{mensaje}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                <div className="text-center space-y-4">
                  <p className="text-gray-300">El enlace de restablecimiento ha expirado o es inválido.</p>
                  <Link
                    to="/password-reset"
                    className="inline-block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    Solicitar nuevo enlace
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 w-full pt-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver al inicio de sesión</span>
                  </Link>
                </div>
              </div>
            </>
          ) : mensajeTipo === 'success' && mensaje.includes('éxito') ? (
            <>
              {/* Pantalla de éxito */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    ¡Contraseña Actualizada!
                  </span>
                </h1>
                <p className="text-gray-400">Tu contraseña ha sido restablecida exitosamente</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                <div className="text-center space-y-4">
                  <p className="text-gray-300">Serás redirigido al inicio de sesión en unos momentos...</p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                  <Lock className="h-8 w-8 text-purple-400" />
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Nueva Contraseña
                  </span>
                </h1>
                <p className="text-gray-400">Ingresa tu nueva contraseña</p>
              </div>

              {/* Formulario */}
              <div className="bg-gradient-to-br from-purple-900/30 to-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
                <form onSubmit={manejarSubmit} className="space-y-6">
                  {/* Mensaje de validación token */}
                  {mensaje && mensajeTipo === 'success' && !mensaje.includes('éxito') && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-400">{mensaje}</p>
                    </div>
                  )}

                  {mensaje && mensajeTipo === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{mensaje}</p>
                    </div>
                  )}

                  {/* Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Nueva Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={nuevaContraseña}
                        onChange={handlePasswordChange}
                        className={`w-full pl-10 pr-12 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                          errors.nuevaContraseña ? 'border-red-500' : 'border-purple-500/30 hover:border-purple-500/50'
                        }`}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.nuevaContraseña && <p className="mt-1 text-sm text-red-400">{errors.nuevaContraseña}</p>}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Confirmar Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmarContraseña}
                        onChange={handleConfirmPasswordChange}
                        className={`w-full pl-10 pr-12 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                          errors.confirmarContraseña ? 'border-red-500' : 'border-purple-500/30 hover:border-purple-500/50'
                        }`}
                        placeholder="Confirma tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmarContraseña && <p className="mt-1 text-sm text-red-400">{errors.confirmarContraseña}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !tokenValido}
                    className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2 ${
                      isLoading || !tokenValido ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Restablecer Contraseña</span>
                      </>
                    )}
                  </button>

                  <div className="mt-6 text-center border-t border-purple-500/20 pt-6">
                    <Link
                      to="/login"
                      className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver al inicio de sesión</span>
                    </Link>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestablecerContraseña;