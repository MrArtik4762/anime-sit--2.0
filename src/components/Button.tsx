import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 interactive-element';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: `rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg focus:ring-primary/50 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/25 focus:shadow-lg focus:shadow-purple-500/25 dark:hover:shadow-lg dark:hover:shadow-purple-500/25 dark:focus:shadow-lg dark:focus:shadow-purple-500/25 ${className}`,
    secondary: `rounded-xl bg-secondary hover:bg-secondary-hover text-text-secondary focus:ring-secondary/50 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/25 focus:shadow-lg focus:shadow-purple-500/25 dark:hover:shadow-lg dark:hover:shadow-purple-500/25 dark:focus:shadow-lg dark:focus:shadow-purple-500/25 ${className}`
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', ...props }, ref) => (
    <Button
      ref={ref}
      variant="primary"
      size={size}
      className={className}
      {...props}
    >
      {children}
    </Button>
  )
);

export const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', children, className = '', ...props }, ref) => (
    <Button
      ref={ref}
      variant="secondary"
      size={size}
      className={className}
      {...props}
    >
      {children}
    </Button>
  )
);

export default Button;