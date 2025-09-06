/**
 * Settings Panel component for additional chart controls
 * Collapsible panel with export functionality and advanced settings
 */

import {
  Download,
  Palette,
  Settings,
  X,
  Grid3X3,
  Crosshair,
  BarChart3,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/contexts/AppContext';
import { useUrlSync } from '@/hooks';

interface SettingsPanelProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ChartSettings {
  showGridLines: boolean;
  showCrosshair: boolean;
  showVolume: boolean;
  showLegend: boolean;
  theme: 'light' | 'dark';
  lineWidth: number;
  animationsEnabled: boolean;
}

export function SettingsPanel({
  className = '',
  isOpen,
  onClose,
}: SettingsPanelProps) {
  const { state } = useAppContext();
  const { getShareableUrl, copyShareableUrl } = useUrlSync();
  const [copySuccess, setCopySuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Chart settings state
  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    showGridLines: true,
    showCrosshair: true,
    showVolume: true,
    showLegend: true,
    theme: 'light',
    lineWidth: 2,
    animationsEnabled: true,
  });

  const handleCopyUrl = async () => {
    const success = await copyShareableUrl();
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleExportChart = (format: 'png' | 'jpeg' | 'pdf' | 'svg') => {
    // This would integrate with Highcharts export functionality
    // For now, we'll simulate the export process
    console.warn(`Exporting chart as ${format}`);
    setExportSuccess(format.toUpperCase());
    setTimeout(() => setExportSuccess(null), 3000);

    // In a real implementation, this would trigger Highcharts export:
    // const chart = Highcharts.charts.find(chart => chart && chart.renderTo);
    // if (chart) {
    //   chart.exportChart({
    //     type: `image/${format}`,
    //     filename: `stock-chart-${new Date().toISOString().split('T')[0]}`
    //   });
    // }
  };

  const updateChartSetting = <K extends keyof ChartSettings>(
    key: K,
    value: ChartSettings[K]
  ) => {
    setChartSettings(prev => ({ ...prev, [key]: value }));
    // In a real implementation, this would update the chart configuration
    console.warn(`Chart setting updated: ${key} = ${value}`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 md:hidden'
          onClick={onClose}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          role='button'
          tabIndex={0}
          aria-label='Close settings panel'
        />
      )}

      {/* Settings Panel */}
      <div
        className={`
          fixed right-0 top-0 z-50 h-full transform border-l bg-background shadow-lg transition-transform duration-300
          w-80 md:w-80 sm:w-full sm:max-w-sm
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${className}
        `}
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b p-4'>
          <div className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            <h3 className='font-semibold'>Chart Settings</h3>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='h-8 w-8 p-0'
            aria-label='Close settings panel'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4 mobile-scroll'>
          <div className='space-y-6'>
            {/* Chart Display Options */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Eye className='h-4 w-4' />
                  Display Options
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Grid Lines Toggle */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Grid3X3 className='h-4 w-4 text-muted-foreground' />
                    <Label htmlFor='gridLines' className='text-sm font-medium'>
                      Grid Lines
                    </Label>
                  </div>
                  <Switch
                    id='gridLines'
                    checked={chartSettings.showGridLines}
                    onCheckedChange={checked =>
                      updateChartSetting('showGridLines', checked)
                    }
                  />
                </div>

                {/* Crosshair Toggle */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Crosshair className='h-4 w-4 text-muted-foreground' />
                    <Label htmlFor='crosshair' className='text-sm font-medium'>
                      Crosshair
                    </Label>
                  </div>
                  <Switch
                    id='crosshair'
                    checked={chartSettings.showCrosshair}
                    onCheckedChange={checked =>
                      updateChartSetting('showCrosshair', checked)
                    }
                  />
                </div>

                {/* Volume Display Toggle */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <BarChart3 className='h-4 w-4 text-muted-foreground' />
                    <Label htmlFor='volume' className='text-sm font-medium'>
                      Volume Bars
                    </Label>
                  </div>
                  <Switch
                    id='volume'
                    checked={chartSettings.showVolume}
                    onCheckedChange={checked =>
                      updateChartSetting('showVolume', checked)
                    }
                  />
                </div>

                {/* Legend Toggle */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <TrendingUp className='h-4 w-4 text-muted-foreground' />
                    <Label htmlFor='legend' className='text-sm font-medium'>
                      Chart Legend
                    </Label>
                  </div>
                  <Switch
                    id='legend'
                    checked={chartSettings.showLegend}
                    onCheckedChange={checked =>
                      updateChartSetting('showLegend', checked)
                    }
                  />
                </div>

                {/* Animations Toggle */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500' />
                    <Label htmlFor='animations' className='text-sm font-medium'>
                      Animations
                    </Label>
                  </div>
                  <Switch
                    id='animations'
                    checked={chartSettings.animationsEnabled}
                    onCheckedChange={checked =>
                      updateChartSetting('animationsEnabled', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Chart Appearance */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Palette className='h-4 w-4' />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Theme Selection */}
                <div className='space-y-2'>
                  <Label className='text-sm font-medium'>Chart Theme</Label>
                  <div className='grid grid-cols-2 gap-2'>
                    <Button
                      variant={
                        chartSettings.theme === 'light' ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => updateChartSetting('theme', 'light')}
                      className='text-xs'
                    >
                      Light
                    </Button>
                    <Button
                      variant={
                        chartSettings.theme === 'dark' ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => updateChartSetting('theme', 'dark')}
                      className='text-xs'
                    >
                      Dark
                    </Button>
                  </div>
                </div>

                {/* Line Width */}
                <div className='space-y-2'>
                  <Label className='text-sm font-medium'>Line Width</Label>
                  <div className='flex items-center gap-2'>
                    <input
                      type='range'
                      min='1'
                      max='5'
                      value={chartSettings.lineWidth}
                      onChange={e =>
                        updateChartSetting(
                          'lineWidth',
                          parseInt(e.target.value)
                        )
                      }
                      className='flex-1'
                    />
                    <span className='text-xs text-muted-foreground w-8'>
                      {chartSettings.lineWidth}px
                    </span>
                  </div>
                </div>

                {/* Color Picker Placeholder */}
                <div className='space-y-2'>
                  <Label className='text-sm font-medium'>Color Scheme</Label>
                  <div className='grid grid-cols-4 gap-2'>
                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map(
                      (color, index) => (
                        <button
                          key={color}
                          className='h-8 w-full rounded border-2 border-muted transition-colors hover:border-foreground'
                          style={{ backgroundColor: color }}
                          onClick={() =>
                            console.warn(`Selected color: ${color}`)
                          }
                          aria-label={`Color option ${index + 1}`}
                        />
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Section */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Download className='h-4 w-4' />
                  Export Chart
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {exportSuccess && (
                  <div className='rounded bg-green-50 p-2 text-xs text-green-700 border border-green-200'>
                    Chart exported as {exportSuccess}!
                  </div>
                )}
                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleExportChart('png')}
                    className='text-xs'
                    disabled={!!exportSuccess}
                  >
                    PNG
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleExportChart('jpeg')}
                    className='text-xs'
                    disabled={!!exportSuccess}
                  >
                    JPEG
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleExportChart('pdf')}
                    className='text-xs'
                    disabled={!!exportSuccess}
                  >
                    PDF
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleExportChart('svg')}
                    className='text-xs'
                    disabled={!!exportSuccess}
                  >
                    SVG
                  </Button>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Export current chart view with selected stocks and date range
                </p>
              </CardContent>
            </Card>

            {/* Share Section */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>Share Chart</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='rounded border bg-muted/30 p-2 text-xs font-mono break-all'>
                  {getShareableUrl()}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleCopyUrl}
                  className='w-full text-xs'
                >
                  {copySuccess ? 'Copied!' : 'Copy Shareable URL'}
                </Button>
                <p className='text-xs text-muted-foreground'>
                  Share this URL to let others view the same chart configuration
                </p>
              </CardContent>
            </Card>

            <Separator />

            {/* Chart Info */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>
                  Current Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Selected Stocks:
                    </span>
                    <span className='font-medium'>
                      {state.selectedStocks.length > 0
                        ? state.selectedStocks.map(s => s.symbol).join(', ')
                        : 'None selected'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Date Range:</span>
                    <span className='font-medium text-xs'>
                      {state.dateRange.from.toLocaleDateString()} -{' '}
                      {state.dateRange.to.toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Price Type:</span>
                    <span className='font-medium capitalize'>
                      {state.priceType}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Theme:</span>
                    <span className='font-medium capitalize'>
                      {chartSettings.theme}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
