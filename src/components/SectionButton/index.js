import React from 'react';
import './styles.scss';

function SectionButton({
  parentColor,
  size,
  state,
  fullWidth,
  className = '',
  children,
  // Passed to button element
  ...otherProps
}) {
  return (
    <button
      className={
        'button' +
        ([
          'primary',
          'info',
          'success',
          'warning',
          'danger',
          'black',
          'dark',
        ].includes(parentColor)
          ? ` is-${parentColor}`
          : '') +
        (['white', 'light'].includes(parentColor) || !parentColor
          ? ' is-primary'
          : '') +
        (size ? ` is-${size}` : '') +
        (state ? ` is-${state}` : '') +
        (fullWidth ? ' is-fullwidth' : '') +
        ` ${className} `
      }
      {...otherProps}
    >
      {children}
    </button>
  );
}

export default SectionButton;
