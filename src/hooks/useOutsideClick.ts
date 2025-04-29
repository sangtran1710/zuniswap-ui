import { useEffect, RefObject } from 'react';

/**
 * Hook that detects clicks outside of a specified element
 */
export const useOutsideClick = (
  ref: RefObject<HTMLElement | HTMLDivElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}; 