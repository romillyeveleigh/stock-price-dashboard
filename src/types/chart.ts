/**
 * Chart-specific types for Highcharts integration
 */

import type { PriceType, DateRange } from './stock';

// Chart configuration types
export interface ChartConfig {
  type: 'line' | 'candlestick' | 'area';
  height: number;
  responsive: boolean;
  animation: boolean;
  crosshair: boolean;
  zoom: boolean;
  pan: boolean;
}

// Chart theme configuration
export interface ChartTheme {
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  crosshairColor: string;
  colors: string[]; // Series colors
}

// Chart data point for Highcharts
export interface ChartDataPoint {
  x: number; // Timestamp
  y: number; // Price value
  volume?: number; // Volume data
}

// Chart series configuration
export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color: string;
  type: 'line' | 'column';
  yAxis: number; // Which y-axis to use (0 for price, 1 for volume)
  visible: boolean;
  showInLegend: boolean;
}

// Chart axis configuration
export interface ChartAxis {
  title: string;
  min?: number;
  max?: number;
  type: 'linear' | 'logarithmic' | 'datetime';
  opposite: boolean; // Right side for price, left for volume
  height?: string; // Percentage of chart height
  top?: string; // Position from top
}

// Chart tooltip configuration
export interface ChartTooltip {
  shared: boolean;
  crosshairs: boolean;
  formatter?: (points: ChartDataPoint[]) => string;
  dateFormat: string;
  valueDecimals: number;
}

// Chart legend configuration
export interface ChartLegend {
  enabled: boolean;
  align: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  layout: 'horizontal' | 'vertical';
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

// Chart zoom configuration
export interface ChartZoom {
  type: 'x' | 'y' | 'xy';
  enabled: boolean;
  resetButton: {
    position: {
      align: 'left' | 'center' | 'right';
      verticalAlign: 'top' | 'middle' | 'bottom';
    };
    theme: {
      fill: string;
      stroke: string;
      style: {
        color: string;
        fontSize: string;
      };
    };
  };
}

// Chart export configuration
export interface ChartExport {
  enabled: boolean;
  buttons: {
    contextButton: {
      menuItems: string[];
    };
  };
  filename: string;
  type: 'image/png' | 'image/jpeg' | 'application/pdf' | 'image/svg+xml';
}

// Complete chart options interface
export interface ChartOptions {
  chart: ChartConfig;
  title: {
    text: string;
    style: {
      fontSize: string;
      fontWeight: string;
      color: string;
    };
  };
  xAxis: ChartAxis;
  yAxis: ChartAxis[];
  series: ChartSeries[];
  tooltip: ChartTooltip;
  legend: ChartLegend;
  plotOptions: {
    line: {
      marker: {
        enabled: boolean;
        states: {
          hover: {
            enabled: boolean;
            radius: number;
          };
        };
      };
    };
    column: {
      pointPadding: number;
      borderWidth: number;
      groupPadding: number;
    };
  };
  responsive: {
    rules: Array<{
      condition: {
        maxWidth?: number;
        minWidth?: number;
      };
      chartOptions: Partial<ChartOptions>;
    }>;
  };
  exporting: ChartExport;
  credits: {
    enabled: boolean;
  };
}

// Chart interaction events
export interface ChartEvents {
  onLoad?: () => void;
  onRedraw?: () => void;
  onSelection?: (event: { xAxis: Array<{ min: number; max: number }> }) => void;
  onZoom?: (event: { xAxis: Array<{ min: number; max: number }> }) => void;
}

// Chart state for managing interactions
export interface ChartState {
  isLoading: boolean;
  hasData: boolean;
  selectedRange: DateRange | null;
  zoomLevel: number;
  priceType: PriceType;
  showVolume: boolean;
  showCrosshair: boolean;
}

// Chart performance metrics
export interface ChartPerformance {
  renderTime: number;
  dataPoints: number;
  seriesCount: number;
  memoryUsage?: number;
}
