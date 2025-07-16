// ✅ VERIFICAR: src/utils/validators.js
export const validators = {
  email: (value) => {
    if (!value) return 'Email es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Email inválido';
    return null;
  },

  password: (value) => {
    if (!value) return 'Contraseña es requerida';
    if (value.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  },

  required: (value) => {
    if (!value || value.trim() === '') return 'Este campo es requerido';
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) return `Debe tener al menos ${min} caracteres`;
    return null;
  },
};
