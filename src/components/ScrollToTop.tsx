import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

export const ScrollToTop = () => {
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
