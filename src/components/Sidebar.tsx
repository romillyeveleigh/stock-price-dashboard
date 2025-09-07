/**
 * Sidebar component for desktop layout
 * Contains additional settings and controls
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`
        relative flex h-full flex-col border-r bg-card transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-80'}
        ${className}
      `}
    >
      {/* Collapse Toggle Button */}
      <Button
        variant='ghost'
        size='sm'
        onClick={toggleCollapsed}
        className='absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-background p-0 shadow-md'
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className='h-4 w-4' />
        ) : (
          <ChevronLeft className='h-4 w-4' />
        )}
      </Button>

      {/* Sidebar Content */}
      <div
        className={`flex-1 overflow-hidden ${isCollapsed ? 'hidden' : 'block'}`}
      >
        <div className='flex h-full flex-col gap-6 p-6'>
          {/* Header */}
          <div>
            <h2 className='text-lg font-semibold text-foreground'>
              Additional Settings
            </h2>
            <p className='text-sm text-muted-foreground'>
              Additional configuration options
            </p>
          </div>

          {/* Placeholder for future settings */}
          <div className='flex-1 flex items-center justify-center text-muted-foreground'>
            <p className='text-sm'>No additional settings available</p>
          </div>
        </div>
      </div>

      {/* Collapsed State Icon */}
      {isCollapsed && (
        <div className='flex flex-col items-center gap-4 p-4'>
          <div className='rounded-lg bg-primary/10 p-2'>
            <svg
              className='h-6 w-6 text-primary'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
