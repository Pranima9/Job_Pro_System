import React from 'react';

export const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [], // [{ value: '...', label: '...' }]
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
      {!error && helpText && <span className="form-help">{helpText}</span>}
    </div>
  );
};

export default Select;
