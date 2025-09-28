/**
 * StockChart component with Highcharts Stock integration
 * Displays line chart with price data, volume bars, and range selector
 */

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { useMemo, useRef, useEffect, useLayoutEffect } from 'react';

import { ChartEmptyState, NoDataAvailable } from '@/components/EmptyStates';
import { ChartError } from '@/components/ErrorStates';
import { ChartLoadingSkeleton } from '@/components/LoadingStates';
import { useAppContext } from '@/contexts/AppContext';
import { useMultipleStockPrices, useResponsive, useSmaPeriod } from '@/hooks';
import { APP_CONFIG } from '@/lib';
import { calculateSimpleMovingAverage } from '@/lib/utils';
import type { StockPriceData } from '@/types';

interface StockChartProps {
  className?: string;
  height?: number;
}

export function StockChart({ className = '', height }: StockChartProps) {
  const { state } = useAppContext();
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { isMobile, isTablet } = useResponsive();
  const { smaPeriod } = useSmaPeriod();
  // Get stock symbols for API calls
  const stockSymbols = state.selectedStocks.map(stock => stock.symbol);

  // Fetch stock price data for all selected stocks
  const {
    data = [],
    isLoading,
    isError,
    errors,
  } = useMultipleStockPrices(
    stockSymbols,
    state.dateRange,
    stockSymbols.length > 0
  );

  useLayoutEffect(() => {
    chartRef.current?.chart?.redraw();
  }, [state.dateRange]);

  // Transform data for Highcharts Stock
  const chartOptions = useMemo((): Highcharts.Options => {
    const series: Highcharts.SeriesOptionsType[] = [];

    // Create price series for each stock
    data.forEach((stockData: StockPriceData, index: number) => {
      if (!stockData || !stockData.data || stockData.data.length === 0) return;

      const priceData = stockData.data.map(point => [
        new Date(point.date).getTime(),
        point[state.priceType], // Use selected price type (open, high, low, close)
      ]);

      const baseColor =
        APP_CONFIG.CHART_COLORS[index % APP_CONFIG.CHART_COLORS.length];

      const smaColor =
        APP_CONFIG.CHART_COLORS[index + (1 % APP_CONFIG.CHART_COLORS.length)];

      // Convert hex color to RGB for gradient
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      };

      const rgb = hexToRgb(baseColor);
      if (!rgb) return;

      // Create zones with gradient fills
      const zones = [
        {
          color: baseColor,
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`],
              [1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`],
            ],
          },
        },
      ] as Highcharts.SeriesZonesOptionsObject[];

      // Add area series with gradient fill
      series.push({
        color: baseColor,
        type: 'area',
        name: stockData.symbol,
        data: priceData,
        zones: zones,
        yAxis: 0,
        showInLegend: true,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 4,
            },
          },
        },
        lineWidth: 1,
        fillOpacity: 0.1,
      } as Highcharts.SeriesAreaOptions);

      series.push({
        color: smaColor,
        name: stockData.symbol + ` ${smaPeriod}D SMA`,
        data: calculateSimpleMovingAverage(
          stockData.data,
          smaPeriod,
          state.priceType
        ),
        yAxis: 0,
        showInLegend: Boolean(smaPeriod),
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 4,
            },
          },
        },
        lineWidth: 0.5,
      } as Highcharts.SeriesAreaOptions);
    });

    return {
      chart: {
        type: 'line',
        height:
          height || isMobile
            ? APP_CONFIG.DEFAULT_CHART_HEIGHT.mobile
            : isTablet
              ? APP_CONFIG.DEFAULT_CHART_HEIGHT.tablet
              : APP_CONFIG.DEFAULT_CHART_HEIGHT.desktop,
        backgroundColor: '#fafafa',
        marginTop: 16,
        style: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        zooming: {
          type: 'x',
        },
        panning: {
          type: 'x',
        },
      },
      title: {
        text: '',
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date',
          style: {
            color: '#6b7280',
            fontSize: '10px',
          },
        },
        labels: {
          style: {
            color: '#6b7280',
            fontSize: '9px',
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
              fontSize: '10px',
            },
            margin: 16,
          },
          opposite: true,
          gridLineColor: '#e5e7eb',
          labels: {
            style: {
              color: '#6b7280',
              fontSize: '9px', // Reduced from 11px
            },
            formatter: function () {
              return '$' + Highcharts.numberFormat(this.value as number, 0);
            },
          },
          crosshair: true,
        },
      ],
      tooltip: {
        shared: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#cccccc',
        borderRadius: 3,
        shadow: true,
        style: { fontSize: '11px' },
        formatter: function () {
          const date = new Date(this.x as number);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          const day = date.getDate();
          const monthName = date.toLocaleDateString('en-US', {
            month: 'short',
          });
          const year = date.getFullYear();
          const formattedDate = `${dayName} ${day} ${monthName} ${year}`;

          let tooltip = `<b>${formattedDate}</b><br/>`;

          this.points?.forEach(point => {
            if (point.series.name.includes('Volume')) {
              tooltip += `<span style="color:${point.color}" >${point.series.name}</span>: ${Highcharts.numberFormat((point.y as number) / 1000000, 1)}M<br/>`;
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
        verticalAlign: 'bottom',
        layout: 'horizontal',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 4,
        shadow: false,
        itemStyle: {
          color: '#374151',
          fontSize: '10px',
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
              maxWidth: 639, // Mobile breakpoint (< 640px)
            },
            chartOptions: {
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
              },
              rangeSelector: {
                buttonTheme: {
                  style: {
                    fontSize: '8px',
                  },
                },
              },
            },
          },
          {
            condition: {
              maxWidth: 767, // Tablet breakpoint (640px - 767px)
            },
            chartOptions: {
              legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
              },
            },
          },
          {
            condition: {
              maxWidth: 1023, // Desktop breakpoint (768px - 1023px)
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
      credits: {
        enabled: false,
      },
    };
  }, [data, state.priceType, height, isMobile, isTablet, smaPeriod]);

  // Handle chart cleanup
  useEffect(() => {
    const currentChart = chartRef.current;
    return () => {
      if (currentChart?.chart) {
        currentChart.chart.destroy();
      }
    };
  }, []);

  // Loading state
  if (isLoading) {
    return <ChartLoadingSkeleton className={className} height={height} />;
  }

  // Error state
  if (isError) {
    const errorMessage =
      errors.length > 0 ? errors[0]?.message : 'Failed to load chart data';
    return (
      <ChartError
        className={className}
        height={height}
        error={errorMessage}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Empty state - no stocks selected
  if (stockSymbols.length === 0) {
    return (
      <ChartEmptyState
        className={className}
        height={height}
        message='Select up to 3 stocks to view their price charts'
        actionLabel='Select Stocks'
        onAction={() => {
          // Focus on search input
          const searchInput = document.querySelector(
            'input[aria-label="Search stocks"]'
          ) as HTMLInputElement;
          searchInput?.focus();
        }}
      />
    );
  }

  // No data state - stocks selected but no data available
  if (
    data.length === 0 ||
    data.every(data => !data || data.data.length === 0)
  ) {
    return (
      <NoDataAvailable
        className={className}
        dateRange={state.dateRange}
        stocks={stockSymbols}
        onAction={() => {
          // Focus on date range picker
          const dateInput = document.querySelector(
            'input[type="date"]'
          ) as HTMLInputElement;
          dateInput?.focus();
        }}
        actionLabel='Adjust Date Range'
      />
    );
  }

  return (
    <div className={className}>
      <HighchartsReact
        key={`chart-${state.dateRange.from.toISOString()}-${state.dateRange.to.toISOString()}`}
        ref={chartRef}
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
}
