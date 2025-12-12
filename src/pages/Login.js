import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight,
  CheckCircle, AlertTriangle, Info, ArrowLeft, X  
} from 'lucide-react';
import { 
  MdMusicNote as Music, 
  MdLightbulb as Lightbulb, 
  MdStar as Star 
} from "react-icons/md";
import { Link } from 'react-router-dom';

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Estado para notificaciones personalizadas
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  // Validaciones
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Validar teléfono: permitir caracteres + y espacios, pero contar solo dígitos y exigir máximo 10 dígitos
  const validatePhone = (phone) => {
    if (!phone) return false;
    const digits = String(phone).replace(/\D/g, '');
    return digits.length <= 10 && digits.length >= 7; // mínimo 7, máximo 10 dígitos
  };

  // Validar contraseña: mínimo 8 caracteres, al menos una mayúscula, un número y un carácter especial
  const validatePassword = (password) => {
    if (!password || password.length < 8) return false;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);
    return hasUpper && hasNumber && hasSpecial;
  };

  // Validar nombres: solo letras (incluye acentos) y espacios
  const validateName = (name) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(String(name).trim());

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
      else if (!validateName(formData.firstName)) newErrors.firstName = 'El nombre solo debe contener letras y espacios';
      if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
      else if (!validateName(formData.lastName)) newErrors.lastName = 'El apellido solo debe contener letras y espacios';
      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es requerido';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'El teléfono debe tener entre 7 y 10 dígitos (solo números)';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
      if (!acceptedTerms) {
        newErrors.terms = 'Debes aceptar los términos y condiciones';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!isLogin) {
      // Solo validar requisitos estrictos al registrar (no al iniciar sesión)
      if (!validatePassword(formData.password)) {
        newErrors.password = 'La contraseña debe tener mínimo 8 caracteres, incluir una mayúscula, un número y un carácter especial';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Manejo específico para el campo teléfono: solo dígitos, máximo 10
  const handlePhoneChange = (e) => {
    const raw = e.target.value || '';
    const digits = raw.replace(/\D/g, '').slice(0, 10); // solo dígitos y máximo 10
    setFormData(prev => ({ ...prev, phone: digits }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handlePhoneKeyDown = (e) => {
    const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (allowed.includes(e.key)) return;
    // permitir dígitos
    if (/^[0-9]$/.test(e.key)) return;
    // si es ctrl/cmd combos permitir
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
  };

  const handlePhonePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
    const digits = paste.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: digits }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  // Manejadores para nombre y apellido: solo letras y espacios
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const filtered = String(value || '').replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
    setFormData(prev => ({ ...prev, [name]: filtered }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNameKeyDown = (e) => {
    const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (allowed.includes(e.key)) return;
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s]$/.test(e.key)) return;
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
  };

  const handleNamePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
    const filtered = paste.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
    const field = e.target.name || 'firstName';
    setFormData(prev => ({ ...prev, [field]: filtered }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const response = await axios.post(
  `${process.env.REACT_APP_BACKEND_URL}/api/usuarios/login`,
  {
    email: formData.email,
    password: formData.password
  }
);

          
        localStorage.setItem('token', response.data.token);
        setNotification({ message: 'Inicio de sesión exitoso', type: 'success', visible: true });

        // Redirigir tras un pequeño delay para que se vea la notificación
        setTimeout(() => {
          window.location.href = response.data.redirectTo || '/';
        }, 1500);

      } else {
        // REGISTER
          await axios.post('http://localhost:4000/api/usuarios/register', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          });
          
        setNotification({ message: 'Registro exitoso. Inicia sesión.', type: 'success', visible: true });
        setIsLogin(true); // Cambia a modo login después de registrar
      }
    } catch (error) {
      const msg = error?.response?.data?.message || 'Ocurrió un error';
      setNotification({ message: msg, type: 'error', visible: true });
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setAcceptedTerms(false);
    setNotification({ message: '', type: '', visible: false });
  };

  // Auto ocultar notificación después de 4 segundos
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Modal de Términos y Condiciones
  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-gray-900/90 border border-purple-500/50 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
          <h2 className="text-2xl font-bold text-white">Términos y Condiciones</h2>
          <button
            onClick={() => setShowTermsModal(false)}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)] custom-scrollbar">
          <div className="space-y-4 text-gray-300">
            <p className="text-sm text-gray-400">Última actualización: Noviembre 2025</p>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">1. Aceptación de los Términos</h3>
              <p className="text-sm leading-relaxed">
                Al acceder y utilizar esta plataforma, aceptas estar sujeto a estos términos y condiciones de uso. 
                Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">2. Uso de la Plataforma</h3>
              <p className="text-sm leading-relaxed mb-2">
                Nuestra plataforma está diseñada para proporcionar servicios relacionados con música, eventos y entretenimiento. 
                Al registrarte, te comprometes a:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Proporcionar información veraz y actualizada</li>
                <li>Mantener la confidencialidad de tu cuenta</li>
                <li>No utilizar la plataforma para actividades ilegales</li>
                <li>Respetar los derechos de propiedad intelectual</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">3. Privacidad y Protección de Datos</h3>
              <p className="text-sm leading-relaxed">
                Nos comprometemos a proteger tu información personal de acuerdo con las leyes de protección de datos vigentes. 
                Los datos recopilados se utilizarán únicamente para mejorar tu experiencia en la plataforma y no serán compartidos 
                con terceros sin tu consentimiento explícito.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">4. Cuenta de Usuario</h3>
              <p className="text-sm leading-relaxed">
                Eres responsable de mantener la seguridad de tu cuenta y contraseña. Notifícanos inmediatamente si detectas 
                cualquier uso no autorizado de tu cuenta. No nos hacemos responsables de las pérdidas derivadas del uso no 
                autorizado de tu cuenta.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">5. Contenido del Usuario</h3>
              <p className="text-sm leading-relaxed">
                Al publicar contenido en nuestra plataforma, otorgas una licencia no exclusiva para usar, modificar y distribuir 
                dicho contenido. Eres el único responsable del contenido que publicas y debes asegurarte de tener los derechos 
                necesarios para compartirlo.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">6. Propiedad Intelectual</h3>
              <p className="text-sm leading-relaxed">
                Todo el contenido, diseño, logotipos y software de la plataforma están protegidos por derechos de autor y otras 
                leyes de propiedad intelectual. No está permitido copiar, modificar o distribuir nuestro contenido sin autorización 
                previa por escrito.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">7. Limitación de Responsabilidad</h3>
              <p className="text-sm leading-relaxed">
                La plataforma se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables de daños 
                directos, indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de usar nuestros servicios.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">8. Modificaciones del Servicio</h3>
              <p className="text-sm leading-relaxed">
                Nos reservamos el derecho de modificar o discontinuar, temporal o permanentemente, el servicio con o sin previo 
                aviso. No seremos responsables ante ti o terceros por cualquier modificación, suspensión o discontinuación del servicio.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">9. Terminación</h3>
              <p className="text-sm leading-relaxed">
                Podemos terminar o suspender tu acceso a la plataforma inmediatamente, sin previo aviso, por cualquier motivo, 
                incluyendo, sin limitación, si incumples estos términos y condiciones.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">10. Ley Aplicable</h3>
              <p className="text-sm leading-relaxed">
                Estos términos se regirán e interpretarán de acuerdo con las leyes de Colombia, sin considerar conflictos de 
                disposiciones legales. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva 
                de los tribunales de Bogotá, Colombia.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">11. Contacto</h3>
              <p className="text-sm leading-relaxed">
                Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos a través de los canales oficiales 
                de la plataforma.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-500/30">
          <button
            onClick={() => {
              setAcceptedTerms(true);
              setShowTermsModal(false);
              if (errors.terms) {
                setErrors(prev => ({ ...prev, terms: '' }));
              }
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Aceptar Términos y Condiciones
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 text-purple-400/30">
          <Music className="h-20 w-20" />
        </div>
        <div className="absolute top-1/4 right-20 text-purple-500/20">
          <Lightbulb className="h-16 w-16" />
        </div>
        <div className="absolute bottom-20 left-1/4 text-purple-400/20">
          <Star className="h-12 w-12" />
        </div>
        <div className="absolute bottom-1/4 right-10 text-purple-500/30">
          <Music className="h-14 w-14" />
        </div>
  
        {/* Efectos de brillo */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-800/10 rounded-full blur-3xl"></div>
      </div>

      {/* Modal de Términos */}
      {showTermsModal && <TermsModal />}
  
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Botón de regreso */}
          <Link 
            to="/" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Volver al inicio</span>
          </Link>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
              </span>
            </h1>
            <p className="text-gray-400">
              {isLogin
                ? 'Inicia sesión en tu cuenta'
                : 'Únete a nuestra plataforma'}
            </p>
          </div>
  
          {/* Aquí va la notificación */}
          {notification.message && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-center ${
                notification.type === 'success'
                  ? 'bg-green-600 text-green-100'
                  : 'bg-red-600 text-red-100'
              }`}
              role="alert"
            >
              {notification.message}
            </div>
          )}
  
          {/* Formulario */}
          <div className="bg-gradient-to-br from-purple-900/30 to-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
            <div className="space-y-6">
              {!isLogin && (
                <>
                  {/* Nombres */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Nombre
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleNameChange}
                          onKeyDown={handleNameKeyDown}
                          onPaste={handleNamePaste}
                          className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                            errors.firstName
                              ? 'border-red-500'
                              : 'border-purple-500/30 hover:border-purple-500/50'
                          }`}
                          placeholder="Tu nombre"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Apellido
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleNameChange}
                          onKeyDown={handleNameKeyDown}
                          onPaste={handleNamePaste}
                          className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                            errors.lastName
                              ? 'border-red-500'
                              : 'border-purple-500/30 hover:border-purple-500/50'
                          }`}
                          placeholder="Tu apellido"
                        />
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
  
                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Teléfono
                    </label>
                      <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onKeyDown={handlePhoneKeyDown}
                        onPaste={handlePhonePaste}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                          errors.phone
                            ? 'border-red-500'
                            : 'border-purple-500/30 hover:border-purple-500/50'
                        }`}
                        placeholder="3001234567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                    )}
                  </div>
                </>
              )}
  
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-purple-500/30 hover:border-purple-500/50'
                    }`}
                    placeholder="tu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>
  
              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.password
                        ? 'border-red-500'
                        : 'border-purple-500/30 hover:border-purple-500/50'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>
  
              {/* Confirmar contraseña */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-3 bg-black/50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                        errors.confirmPassword
                          ? 'border-red-500'
                          : 'border-purple-500/30 hover:border-purple-500/50'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-purple-400 hover:text-purple-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Checkbox de Términos y Condiciones - Solo en Registro */}
              {!isLogin && (
                <div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        if (errors.terms) {
                          setErrors(prev => ({ ...prev, terms: '' }));
                        }
                      }}
                      className="mt-1 h-4 w-4 rounded border-purple-500/50 bg-black/50 text-purple-600 focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                      Acepto los{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-purple-400 hover:text-purple-300 font-semibold underline transition-colors duration-300"
                      >
                        Términos y Condiciones
                      </button>
                      {' '}de uso de la plataforma
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="mt-2 text-sm text-red-400">{errors.terms}</p>
                  )}
                </div>
              )}
  
              {/* Botón de envío */}
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
                    <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
  
              {/* Recordar contraseña */}
              {isLogin && (
              <div className="text-center mt-2">
                <Link
                  to="/restablecer"
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-300"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}
            </div>
  
            {/* Cambiar modo */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300"
                >
                  {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                </button>
              </p>
            </div>
          </div>
  
          {/* Footer - Solo en Login */}
          {isLogin && (
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                Plataforma segura y confiable
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );  
};

export default LoginRegisterPage;