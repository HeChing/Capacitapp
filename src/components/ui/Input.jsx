// ✅ CREAR: src/components/ui/Input.jsx

import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Input({
  type = 'text',
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="input-group" style={{ marginBottom: '15px' }}>
      {label && (
        <label
          style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
        >
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '10px',
            border: error ? '2px solid #ff4444' : '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            backgroundColor: disabled ? '#f5f5f5' : 'white',
          }}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && (
        <span
          style={{
            color: '#ff4444',
            fontSize: '14px',
            marginTop: '5px',
            display: 'block',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;
