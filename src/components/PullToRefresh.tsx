import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { syncOfflineData } from '@/utils/offline';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  threshold?: number;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 80,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(diff, threshold * 1.5));
    }
  }, [threshold, isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        // Sync offline data
        await syncOfflineData();
        
        // Call custom refresh function if provided
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const shouldShowRefresh = isPulling || isRefreshing;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull to refresh indicator */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 ease-out ${
          shouldShowRefresh ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translateY(${Math.max(pullDistance - 40, -40)}px)`,
          height: '60px',
        }}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-lg border border-border">
          <RefreshCw
            className={`h-5 w-5 text-primary transition-transform duration-300 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${pullProgress * 180}deg)`,
            }}
          />
          <span className="text-sm font-medium text-foreground">
            {isRefreshing ? 'Syncing...' : pullProgress >= 1 ? 'Release to sync' : 'Pull to sync'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${isPulling ? pullDistance * 0.5 : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};