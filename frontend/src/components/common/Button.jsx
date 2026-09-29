import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'dark' | 'danger' | 'outline-danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  block = false,
  loading = false,
  loadingText,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    block ? 'btn-block' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span style={{
            display: 'inline-block',
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
