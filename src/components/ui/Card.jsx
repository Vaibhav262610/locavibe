import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '@/styles/theme';

const Card = ({ 
  children, 
  variant = 'default', 
  hover = true,
  className = '',
  ...props 
}) => {
  const baseClasses = `
    rounded-xl p-6 transition-all duration-300
    ${cardVariants[variant]}
    ${hover ? 'hover:scale-[1.02] hover:shadow-2xl' : ''}
    ${className}
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={baseClasses}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;