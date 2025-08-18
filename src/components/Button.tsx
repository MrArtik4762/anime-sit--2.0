import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  gradient?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  gradient = false,
  ...props
}) => {
  const baseClasses = 'font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: `rounded-xl text-white shadow-lg hover:shadow-xl focus:ring-primary/50 transition-all duration-300 ease-in-out ${className}`,
    secondary: `rounded-xl text-text-secondary bg-secondary hover:bg-secondary-hover focus:ring-secondary/50 transition-all duration-300 ease-in-out ${className}`
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
      whileHover={!props.disabled ? { scale: 1.05, y: -1 } : {}}
      whileTap={!props.disabled ? { scale: 0.95 } : {}}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 10
      }}
      {...props}
    >
      {/* Градиентный оверлей для primary кнопок */}
      {variant === 'primary' && gradient && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0"
          initial={false}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Волновой эффект при клике */}
      <motion.span
        className="relative z-10"
        initial={false}
        animate={props.disabled ? {} : { scale: [1, 0.95, 1] }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>
    </motion.button>
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