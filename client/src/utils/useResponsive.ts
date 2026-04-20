import { useEffect, useState } from 'react';

type Breakpoints = {
  isMobile: boolean;
  isTablet: boolean;
};

const getWidth = () =>
  typeof window === 'undefined' ? 1280 : window.innerWidth;

/**
 * Tracks small-screen breakpoints so page components can swap layouts safely.
 */
export default function useResponsive(): Breakpoints {
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    isMobile: width < 768,
    isTablet: width < 1024,
  };
}
