import { useState, useEffect } from 'react';

export type BreakpointType = 'compact' | 'medium' | 'expanded';

export interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: BreakpointType;
  isCompact: boolean;   // < 600px (Standard Phone Portrait)
  isMedium: boolean;    // 600px - 840px (Flip Phone Unfolded / Small Foldable / Compact Tablet)
  isExpanded: boolean;  // >= 840px (Tablet Landscape / Desktop)
  isPortrait: boolean;
  isLandscape: boolean;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    const breakpoint: BreakpointType = width < 600 ? 'compact' : width < 840 ? 'medium' : 'expanded';

    return {
      width,
      height,
      breakpoint,
      isCompact: breakpoint === 'compact',
      isMedium: breakpoint === 'medium',
      isExpanded: breakpoint === 'expanded',
      isPortrait: height > width,
      isLandscape: width >= height,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoint: BreakpointType = width < 600 ? 'compact' : width < 840 ? 'medium' : 'expanded';

      setState({
        width,
        height,
        breakpoint,
        isCompact: breakpoint === 'compact',
        isMedium: breakpoint === 'medium',
        isExpanded: breakpoint === 'expanded',
        isPortrait: height > width,
        isLandscape: width >= height,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
}
