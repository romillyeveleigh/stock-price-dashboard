/**
 * Responsive design hook for handling different screen sizes
 */

import { useEffect, useState } from 'react';

import { APP_CONFIG } from '@/lib';
import type { Breakpoint, ResponsiveConfig } from '@/types';

/**
 * Hook for responsive design breakpoints
 */
export function useResponsive(): ResponsiveConfig {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < APP_CONFIG.MOBILE_BREAKPOINT) {
        setBreakpoint('mobile'); // < 640px
      } else if (width < APP_CONFIG.TABLET_BREAKPOINT) {
        setBreakpoint('tablet'); // 640px - 767px
      } else if (width < APP_CONFIG.DESKTOP_BREAKPOINT) {
        setBreakpoint('desktop'); // 768px - 1023px
      } else {
        setBreakpoint('desktop'); // >= 1024px (large desktop)
      }
    };

    // Set initial breakpoint
    updateBreakpoint();

    // Listen for window resize
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  };
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const updateMatches = () => setMatches(mediaQuery.matches);

    // Set initial value
    updateMatches();

    // Listen for changes
    mediaQuery.addEventListener('change', updateMatches);

    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

/**
 * Predefined media query hooks
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${APP_CONFIG.MOBILE_BREAKPOINT - 1}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${APP_CONFIG.MOBILE_BREAKPOINT}px) and (max-width: ${APP_CONFIG.TABLET_BREAKPOINT - 1}px)`
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${APP_CONFIG.TABLET_BREAKPOINT}px)`);
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery(`(min-width: ${APP_CONFIG.DESKTOP_BREAKPOINT}px)`);
}

/**
 * Hook for detecting dark mode preference
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}
