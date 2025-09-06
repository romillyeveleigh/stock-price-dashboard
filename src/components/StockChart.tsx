/**
 * StockChart component with Highcharts integration
 * Displays line chart with price data and volume bars
 */

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo, useRef, useEffect } from 'react';

import { ChartEmptyState, NoDataAvailable } from '@/components/EmptyStates';
import { ChartError } from '@/components/ErrorStates';
import { ChartLoadingSkeleton } from '@/components/LoadingStates';
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
  }, [stockPricesData, state.priceType, height, hasDelayedData]);

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
    stockPricesData.length === 0 ||
    stockPricesData.every(data => !data || data.data.length === 0)
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
        ref={chartRef}
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
}
