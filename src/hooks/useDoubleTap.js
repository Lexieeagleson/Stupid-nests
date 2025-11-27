/**
 * Custom Hook: useDoubleTap
 * Handles double-tap gesture for adding books to bookshelf
 */

import { useCallback, useRef } from 'react';

export default function useDoubleTap(callback, delay = 300) {
  const lastTap = useRef(0);
  const timeout = useRef(null);

  const handleTap = useCallback((e) => {
    const now = Date.now();
    const timeSince = now - lastTap.current;
    
    if (timeSince < delay && timeSince > 0) {
      // Double tap detected
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      callback(e);
    } else {
      // Wait to see if this is a double tap
      timeout.current = setTimeout(() => {
        timeout.current = null;
      }, delay);
    }
    
    lastTap.current = now;
  }, [callback, delay]);

  return handleTap;
}
