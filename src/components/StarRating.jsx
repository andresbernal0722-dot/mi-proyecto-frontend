import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  onSubmit, 
  isLoading = false, 
  initialRating = 0, 
  initialComment = '',
  pqrsId 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [submitted, setSubmitted] = useState(initialRating > 0);

  // Actualizar submitted cuando cambien los props iniciales
  useEffect(() => {
    if (initialRating > 0) {
      setRating(initialRating);
      setComment(initialComment);
      setSubmitted(true);
    }
  }, [initialRating, initialComment]);

  const handleSubmit = async () => {
    if (rating < 1) {
      alert('Por favor selecciona una calificación');
      return;
    }

    try {
      if (onSubmit) {
        const success = await onSubmit({
          calificacion: rating,
          comentarioCalificacion: comment
        });

        if (success) {
          setSubmitted(true);
          console.log('✅ Calificación guardada exitosamente');
        }
      }
    } catch (error) {
      console.error('❌ Error en handleSubmit:', error);
    }
  };

  if (submitted && initialRating > 0) {
    return (
      <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 mt-3">
        <div className="flex items-center mb-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-500'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-green-300">Calificación registrada</span>
        </div>
        {comment && (
          <p className="text-sm text-gray-300 italic">"{comment}"</p>
        )}
      </div>
    );
  }

  if (submitted && initialRating > 0) {
    return (
      <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 mt-3">
        <div className="flex items-center mb-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-500'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-green-300">Calificación registrada</span>
        </div>
        {comment && (
          <p className="text-sm text-gray-300 italic">"{comment}"</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-4 mt-3">
      <p className="text-sm font-semibold text-purple-200 mb-3">
        ¿Qué tan satisfecho estás con esta respuesta?
      </p>

      {/* Estrellas */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            onMouseEnter={() => setHoveredRating(i + 1)}
            onMouseLeave={() => setHoveredRating(0)}
            disabled={isLoading}
            className="transition-transform hover:scale-110 disabled:opacity-50"
          >
            <Star
              className={`h-8 w-8 transition-all ${
                i < (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Texto de las estrellas */}
      {rating > 0 && (
        <p className="text-xs text-gray-400 mb-3">
          {rating === 1 && 'Muy insatisfecho'}
          {rating === 2 && 'Insatisfecho'}
          {rating === 3 && 'Neutral'}
          {rating === 4 && 'Satisfecho'}
          {rating === 5 && 'Muy satisfecho'}
        </p>
      )}

      {/* Textarea para comentario */}
      {rating > 0 && (
        <div className="mb-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia (opcional)"
            maxLength={250}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none disabled:opacity-50"
            rows="3"
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/250</p>
        </div>
      )}

      {/* Botón de envío */}
      {rating > 0 && (
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-75 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            'Enviar Calificación'
          )}
        </button>
      )}
    </div>
  );
};

export default StarRating;
