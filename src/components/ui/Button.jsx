// ✅ CREAR: src/components/ui/Button.jsx

function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  icon,
  ...props
}) {
  const baseStyles = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    opacity: loading || disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
  };

  const variants = {
    primary: {
      backgroundColor: '#007bff',
      color: 'white',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#007bff',
      border: '2px solid #007bff',
    },
    google: {
      backgroundColor: 'white',
      color: '#333',
      border: '2px solid #ddd',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      style={{ ...baseStyles, ...variants[variant] }}
      {...props}
    >
      {loading && <span>⏳</span>}
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
