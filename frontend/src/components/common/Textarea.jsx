import React from 'react';

export const Textarea = ({
  label,
  id,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const textareaId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        style={{ resize: 'vertical' }}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
      {!error && helpText && <span className="form-help">{helpText}</span>}
    </div>
  );
};

export default Textarea;
