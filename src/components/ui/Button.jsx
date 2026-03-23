import './Button.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) {
  const classes = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
