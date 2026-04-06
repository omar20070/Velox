import { useEffect, useRef, useCallback } from 'react';

interface UseFocusManagementProps {
  focusKey: string;
  onEnter?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function useFocusManagement({
  focusKey,
  onEnter,
  onFocus,
  onBlur,
}: UseFocusManagementProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (document.activeElement === elementRef.current && e.key === 'Enter') {
        e.preventDefault();
        onEnter?.();
      }
    },
    [onEnter]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleFocus = () => onFocus?.();
    const handleBlur = () => onBlur?.();

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onFocus, onBlur, handleKeyDown]);

  return { elementRef };
}
