import React from 'react';

export const Input = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
      {!error && helpText && <span className="form-help">{helpText}</span>}
    </div>
  );
};

export default Input;
