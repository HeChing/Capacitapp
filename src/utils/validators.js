export const validators = {
  email: (value) => {
    if (!value) return 'Email es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Email inválido';
    return '';
  },

  password: (value) => {
    if (!value) return 'Contraseña es requerida';
    if (value.length < 6) return 'Mínimo 6 caracteres';
    return '';
  },

  confirmPassword: (value, allValues) => {
    if (!value) return 'Confirma tu contraseña';
    if (value !== allValues.password) return 'Las contraseñas no coinciden';
    return '';
  },

  required: (value, fieldName = 'Campo') => {
    if (!value || value.trim() === '') return `${fieldName} es requerido`;
    return '';
  },
};
