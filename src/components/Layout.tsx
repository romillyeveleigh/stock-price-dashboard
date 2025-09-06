/**
 * Main Layout component with responsive design
 * Handles desktop sidebar, tablet condensed, and mobile bottom drawer layouts
 */

import { Menu, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { SettingsPanel } from './SettingsPanel';
import { Sidebar } from './Sidebar';
import { StockChart } from './StockChart';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileSidebar && isMobile) {
        const target = event.target as Element;
        if (
          !target.closest('.mobile-sidebar') &&
          !target.closest('.mobile-menu-button')
        ) {
          setShowMobileSidebar(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar, isMobile]);

  return (
    <div className='flex h-screen bg-background overflow-hidden'>
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar className='hidden md:flex' />}

      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/50 md:hidden'
            onClick={() => setShowMobileSidebar(false)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setShowMobileSidebar(false);
              }
            }}
            role='button'
            tabIndex={0}
            aria-label='Close mobile sidebar'
          />
          <div className='mobile-sidebar fixed left-0 top-0 z-50 h-full md:hidden'>
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <header className='flex items-center justify-between border-b bg-card px-4 py-3 md:px-6'>
          <div className='flex items-center gap-4'>
            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowMobileSidebar(true)}
                className='mobile-menu-button md:hidden'
                aria-label='Open menu'
              >
                <Menu className='h-5 w-5' />
              </Button>
            )}

            <div>
              <h1 className='text-lg font-semibold text-foreground md:text-xl'>
                Stock Price Dashboard
              </h1>
              <p className='text-sm text-muted-foreground'>
                Professional stock analysis tool
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowSettingsPanel(true)}
              className='flex items-center gap-2'
              aria-label='Open settings'
            >
              <Settings className='h-4 w-4' />
              {!isMobile && <span className='text-sm'>Settings</span>}
            </Button>
          </div>
        </header>

        {/* Chart Area */}
        <main className='flex-1 overflow-hidden p-2 md:p-4 lg:p-6'>
          <div className='h-full rounded-lg border bg-card overflow-hidden'>
            {children || <StockChart className='h-full w-full' />}
          </div>
        </main>

        {/* Mobile Bottom Controls (Mobile only) */}
        {isMobile && (
          <div className='border-t bg-card p-4 safe-area-pb'>
            <div className='flex items-center justify-center gap-4'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowMobileSidebar(true)}
                className='flex items-center gap-2 min-h-[44px]'
              >
                <Menu className='h-4 w-4' />
                Controls
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowSettingsPanel(true)}
                className='flex items-center gap-2 min-h-[44px]'
              >
                <Settings className='h-4 w-4' />
                Settings
              </Button>
            </div>
          </div>
        )}

        {/* Tablet Floating Action Button */}
        {isTablet && (
          <div className='fixed bottom-6 right-6 z-40 flex flex-col gap-2'>
            <Button
              size='lg'
              onClick={() => setShowSettingsPanel(true)}
              className='h-12 w-12 rounded-full shadow-lg'
              aria-label='Open settings'
            >
              <Settings className='h-5 w-5' />
            </Button>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettingsPanel}
        onClose={() => setShowSettingsPanel(false)}
      />
    </div>
  );
}
