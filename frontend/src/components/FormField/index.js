import React from 'react';
import './styles.scss';

function FormField({
  type = 'input',
  size,
  narrow,
  className = '',
  name,
  value,
  placeholder,
  onChange,
  error,
  ...otherProps
}) {
  return (
    <div className={`field ${narrow ? 'is-narrow' : ''}`}>
      <div className="control">
        {type === 'textarea' && (
          <textarea
            className={`textarea ${size ? `is-${size}` : ''} ${className}`}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            {...otherProps}
          />
        )}

        {type !== 'textarea' && (
          <input
            className={`input ${size ? `is-${size}` : ''} ${className}`}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            {...otherProps}
          />
        )}
      </div>

      {error && <p className="help is-danger">{error.message}</p>}
    </div>
  );
}

export default FormField;
