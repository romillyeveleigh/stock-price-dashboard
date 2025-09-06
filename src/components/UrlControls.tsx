/**
 * URL Controls component for testing and demonstrating URL synchronization
 */

import { Copy, ExternalLink, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUrlSync } from '@/hooks';

export function UrlControls() {
  const { getShareableUrl, hasUrlParams, clearUrlParams, copyShareableUrl } =
    useUrlSync();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyUrl = async () => {
    const success = await copyShareableUrl();
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleOpenInNewTab = () => {
    const url = getShareableUrl();
    window.open(url, '_blank');
  };

  const currentUrl = getShareableUrl();
  const hasParams = hasUrlParams();

  return (
    <Card className='w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='text-xl'>URL State Synchronization</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Current URL Display */}
        <div>
          <div className='text-sm font-medium text-muted-foreground'>
            Current Shareable URL:
          </div>
          <div className='mt-1 rounded border bg-muted/30 p-2 text-sm font-mono break-all'>
            {currentUrl}
          </div>
        </div>

        {/* URL Actions */}
        <div className='flex flex-wrap gap-2'>
          <Button
            onClick={handleCopyUrl}
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <Copy className='h-4 w-4' />
            {copySuccess ? 'Copied!' : 'Copy URL'}
          </Button>

          <Button
            onClick={handleOpenInNewTab}
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <ExternalLink className='h-4 w-4' />
            Open in New Tab
          </Button>

          {hasParams && (
            <Button
              onClick={clearUrlParams}
              variant='outline'
              size='sm'
              className='flex items-center gap-2'
            >
              <RotateCcw className='h-4 w-4' />
              Clear URL Params
            </Button>
          )}
        </div>

        {/* URL Status */}
        <div className='text-sm text-muted-foreground'>
          {hasParams ? (
            <span className='text-green-600'>
              ✓ URL contains state parameters
            </span>
          ) : (
            <span className='text-amber-600'>
              ⚠ URL has no state parameters
            </span>
          )}
        </div>

        {/* Instructions */}
        <div className='rounded border-l-4 border-blue-500 bg-blue-50 p-3 text-sm'>
          <p className='font-medium text-blue-900'>
            How to test URL synchronization:
          </p>
          <ul className='mt-1 list-disc list-inside text-blue-800 space-y-1'>
            <li>Select stocks, change dates, or switch price types</li>
            <li>Copy the URL and open it in a new tab</li>
            <li>Use browser back/forward buttons to test navigation</li>
            <li>
              Share the URL with others to preserve your chart configuration
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
