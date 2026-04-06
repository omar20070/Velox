import { useState } from 'react';
import { motion } from 'motion/react';
import { useFocusManagement } from '../hooks/useFocusManagement';

interface FocusableCardProps {
  focusKey: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  autoFocus?: boolean;
}

export function FocusableCard({
  focusKey,
  children,
  onClick,
  className = '',
  autoFocus = false,
}: FocusableCardProps) {
  const [isFocused, setIsFocused] = useState(false);

  const { elementRef } = useFocusManagement({
    focusKey,
    onEnter: onClick,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  return (
    <motion.div
      ref={elementRef}
      tabIndex={0}
      className={`cursor-pointer outline-none transition-all ${className}`}
      animate={{
        scale: isFocused ? 1.08 : 1,
        filter: isFocused ? 'brightness(1.2)' : 'brightness(1)',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
      autoFocus={autoFocus}
      style={{
        boxShadow: isFocused
          ? '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)'
          : '0 4px 6px rgba(0, 0, 0, 0.3)',
        border: isFocused ? '3px solid #3b82f6' : '3px solid transparent',
      }}
    >
      {children}
    </motion.div>
  );
}
