import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const mobileButtonVariants = cva(
  'touch-none select-none transition-all duration-200 active:scale-95',
  {
    variants: {
      touchSize: {
        default: 'min-h-[44px] min-w-[44px]',
        large: 'min-h-[56px] min-w-[56px] text-lg',
        xl: 'min-h-[72px] min-w-[72px] text-xl',
      },
      haptic: {
        true: 'active:shadow-inner',
        false: '',
      },
    },
    defaultVariants: {
      touchSize: 'default',
      haptic: true,
    },
  }
);

export interface MobileOptimizedButtonProps
  extends ButtonProps,
    VariantProps<typeof mobileButtonVariants> {
  hapticFeedback?: boolean;
}

export const MobileOptimizedButton = React.forwardRef<
  HTMLButtonElement,
  MobileOptimizedButtonProps
>(({ className, touchSize, haptic, hapticFeedback = true, onClick, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger haptic feedback on supported devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button
      ref={ref}
      className={cn(mobileButtonVariants({ touchSize, haptic, className }))}
      onClick={handleClick}
      {...props}
    />
  );
});

MobileOptimizedButton.displayName = 'MobileOptimizedButton';