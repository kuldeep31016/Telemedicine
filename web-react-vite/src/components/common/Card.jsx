import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick = null,
}) => {
  const Component = onClick ? motion.div : 'div';
  
  return (
    <Component
      className={`
        glass rounded-2xl p-6
        ${hover ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hover && onClick ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </Component>
  );
};

export default Card;
