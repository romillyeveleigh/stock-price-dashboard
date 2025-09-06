/**
 * StockChart component with Highcharts integration
 * Displays line chart with price data and volume bars
 */

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo, useRef, useEffect } from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { useMultipleStockPrices } from '@/hooks';
import { APP_CONFIG } from '@/lib';
import type { StockPriceData } from '@/types';

interface StockChartProps {
  className?: string;
  height?: number;
}

export function StockChart({
  className = '',
  height = APP_CONFIG.DEFAULT_CHART_HEIGHT,
}: StockChartProps) {
  const { state } = useAppContext();
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Get stock symbols for API calls
  const stockSymbols = state.selectedStocks.map(stock => stock.symbol);

  // Fetch stock price data for all selected stocks
  const {
    data: stockPricesData = [],
    isLoading,
    isError,
    errors,
  } = useMultipleStockPrices(
    stockSymbols,
    state.dateRange,
    stockSymbols.length > 0
  );

  // Check if any data is delayed
  const hasDelayedData = useMemo(() => {
    return stockPricesData.some(stockData => stockData?.metadata?.isDelayed);
  }, [stockPricesData]);

  // Transform data for Highcharts
  const chartOptions = useMemo((): Highcharts.Options => {
    const series: Highcharts.SeriesOptionsType[] = [];

    // Create price series for each stock
    stockPricesData.forEach((stockData: StockPriceData, index: number) => {
      if (!stockData || !stockData.data || stockData.data.length === 0) return;

      const priceData = stockData.data.map(point => [
        new Date(point.date).getTime(),
        point[state.priceType], // Use selected price type (open, high, low, close)
      ]);

      const volumeData = stockData.data.map(point => [
        new Date(point.date).getTime(),
        point.volume,
      ]);

      // Add price series
      series.push({
        type: 'line',
        name: stockData.symbol,
        data: priceData,
        color: APP_CONFIG.CHART_COLORS[index % APP_CONFIG.CHART_COLORS.length],
        yAxis: 0,
        showInLegend: true,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 5,
            },
          },
        },
      } as Highcharts.SeriesLineOptions);

      // Add volume series
      series.push({
        type: 'column',
        name: `${stockData.symbol} Volume`,
        data: volumeData,
        color: APP_CONFIG.CHART_COLORS[index % APP_CONFIG.CHART_COLORS.length],
        yAxis: 1,
        showInLegend: false,
        opacity: 0.3,
      } as Highcharts.SeriesColumnOptions);
    });

    return {
      chart: {
        type: 'line',
        height,
        backgroundColor: '#fafafa',
        zooming: {
          type: 'x',
        },
        style: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        },
      },
      title: {
        text: 'Stock Price Analysis',
        style: {
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
        },
      },
      subtitle: hasDelayedData
        ? {
            text: '⚠️ Some data may be delayed (market hours or recent data)',
            style: {
              fontSize: '12px',
              color: '#f59e0b',
              fontWeight: '500',
            },
          }
        : undefined,
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date',
          style: {
            color: '#6b7280',
            fontSize: '12px',
          },
        },
        labels: {
          style: {
            color: '#6b7280',
            fontSize: '11px',
          },
        },
        gridLineColor: '#e5e7eb',
        crosshair: true,
      },
      yAxis: [
        {
          // Price axis
          title: {
            text: `Price (${state.priceType.toUpperCase()}) - USD`,
            style: {
              color: '#6b7280',
              fontSize: '12px',
            },
          },
          height: '75%',
          lineWidth: 1,
          gridLineColor: '#e5e7eb',
          labels: {
            style: {
              color: '#6b7280',
              fontSize: '11px',
            },
            formatter: function () {
              return '$' + Highcharts.numberFormat(this.value as number, 2);
            },
          },
          crosshair: true,
        },
        {
          // Volume axis
          title: {
            text: 'Volume (M)',
            style: {
              color: '#6b7280',
              fontSize: '12px',
            },
          },
          top: '80%',
          height: '20%',
          offset: 0,
          lineWidth: 1,
          gridLineColor: '#e5e7eb',
          labels: {
            style: {
              color: '#6b7280',
              fontSize: '11px',
            },
            formatter: function () {
              return (
                Highcharts.numberFormat((this.value as number) / 1000000, 1) +
                'M'
              );
            },
          },
        },
      ],
      tooltip: {
        shared: true,
        formatter: function () {
          let tooltip = `<b>${Highcharts.dateFormat('%Y-%m-%d', this.x as number)}</b><br/>`;

          this.points?.forEach(point => {
            if (point.series.name.includes('Volume')) {
              tooltip += `<span style="color:${point.color}">${point.series.name}</span>: ${Highcharts.numberFormat((point.y as number) / 1000000, 1)}M<br/>`;
            } else {
              tooltip += `<span style="color:${point.color}">${point.series.name}</span>: $${(point.y as number).toFixed(2)}<br/>`;
            }
          });

          return tooltip;
        },
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'top',
        layout: 'horizontal',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 4,
        shadow: false,
        itemStyle: {
          color: '#374151',
          fontSize: '12px',
          fontWeight: '500',
        },
        itemHoverStyle: {
          color: '#1f2937',
        },
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 5,
              },
            },
          },
        },
        column: {
          pointPadding: 0.1,
          borderWidth: 0,
          groupPadding: 0.05,
        },
      },
      series,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 768,
            },
            chartOptions: {
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
              },
            },
          },
        ],
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
            ],
          },
        },
      },
      credits: {
        enabled: false,
      },
    };
  }, [stockPricesData, state.priceType, height]);

  // Handle chart cleanup
  useEffect(() => {
    return () => {
      if (chartRef.current?.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className='flex flex-col items-center gap-4'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
          <p className='text-sm text-muted-foreground'>Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className='flex flex-col items-center gap-4 text-center'>
          <div className='rounded-full bg-destructive/10 p-3'>
            <svg
              className='h-6 w-6 text-destructive'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <div>
            <h3 className='font-medium text-foreground'>
              Failed to load chart data
            </h3>
            <p className='text-sm text-muted-foreground'>
              {errors.length > 0
                ? errors[0]?.message
                : 'Please try again later'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (stockSymbols.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className='flex flex-col items-center gap-4 text-center'>
          <div className='rounded-full bg-muted p-3'>
            <svg
              className='h-6 w-6 text-muted-foreground'
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
          <div>
            <h3 className='font-medium text-foreground'>No stocks selected</h3>
            <p className='text-sm text-muted-foreground'>
              Select up to 3 stocks to view their price charts
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (
    stockPricesData.length === 0 ||
    stockPricesData.every(data => !data || data.data.length === 0)
  ) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className='flex flex-col items-center gap-4 text-center'>
          <div className='rounded-full bg-muted p-3'>
            <svg
              className='h-6 w-6 text-muted-foreground'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
              />
            </svg>
          </div>
          <div>
            <h3 className='font-medium text-foreground'>No data available</h3>
            <p className='text-sm text-muted-foreground'>
              No price data found for the selected date range
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
}
