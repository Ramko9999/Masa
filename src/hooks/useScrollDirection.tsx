import { useRef, useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTabBarVisibility } from '@/context/tab-bar-visibility';

// Configuration options for scroll detection
type ScrollDirectionOptions = {
  // Minimum change in offset to consider as actual scrolling
  threshold?: number;
  // Whether the hook should be active
  enabled?: boolean;
};

/**
 * A simple hook that detects scroll activity to control tab bar visibility:
 * - Hides tab bar when scrolling
 * - Shows tab bar immediately when scrolling stops
 */
export const useScrollDirection = (options?: ScrollDirectionOptions) => {
  const { showTabBar, hideTabBar } = useTabBarVisibility();
  const threshold = options?.threshold ?? 1;
  const enabled = options?.enabled ?? true;
  
  // Track the last Y position to determine if scrolling
  const lastOffsetY = useRef(0);
  // Track if we're currently scrolling
  const isScrolling = useRef(false);

  // Handle scroll start event
  const handleScrollBegin = useCallback(() => {
    isScrolling.current = true;
    hideTabBar();
  }, [hideTabBar]);

  // Handle scroll end event - immediately show tab bar
  const handleScrollEnd = useCallback(() => {
    isScrolling.current = false;
    showTabBar();
  }, [showTabBar]);

  // Handle scroll event to detect any movement
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!enabled) return;
      
      const { contentOffset } = event.nativeEvent;
      const currentOffsetY = contentOffset.y;
      
      // Calculate absolute difference in position
      const scrollDifference = Math.abs(currentOffsetY - lastOffsetY.current);
      
      // If scrolling beyond threshold, hide bar
      if (scrollDifference > threshold) {
        hideTabBar();
      }
      
      // Update last offset for next comparison
      lastOffsetY.current = currentOffsetY;
    },
    [hideTabBar, threshold, enabled]
  );

  return {
    handleScroll,
    handleScrollBegin,
    handleScrollEnd
  };
}; 