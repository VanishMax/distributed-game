import { useRef, useEffect } from 'react';

const useBeforeunload = (handler: (e: Event) => void) => {
  const eventListenerRef = useRef<(e: Event) => void>();

  useEffect(() => {
    eventListenerRef.current = (event: Event) => {
      console.log('here', handler);
      const returnValue = handler?.(event);
      if (typeof returnValue === 'string') {
        return (event.returnValue = returnValue);
      }

      if (event.defaultPrevented) {
        return (event.returnValue = '' as unknown as boolean);
      }
      return;
    };
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: Event) => eventListenerRef.current?.(event);
    window.addEventListener('beforeunload', eventListener);
    return () => {
      window.removeEventListener('beforeunload', eventListener);
    };
  }, []);
};

export default useBeforeunload;
