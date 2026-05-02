import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ 
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  type = 'text',
  ...props 
}, ref) => {
  const baseClasses = `
    w-full px-4 py-3 rounded-lg border transition-all duration-200
    bg-slate-800/50 border-slate-600 text-white placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${Icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-12' : ''}
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${className}
  `;

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={baseClasses}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;