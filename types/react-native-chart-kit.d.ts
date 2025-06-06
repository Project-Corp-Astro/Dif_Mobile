declare module 'react-native-chart-kit' {
  import React from 'react';
  import { ViewProps } from 'react-native';
  
  export interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    decimalPlaces?: number;
    color?: (opacity: number) => string;
    labelColor?: (opacity: number) => string;
    style?: object;
    propsForDots?: object;
    propsForBackgroundLines?: object;
    propsForLabels?: object;
    propsForVerticalLabels?: object;
    propsForHorizontalLabels?: object;
  }

  export interface LineChartData {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
      withDots?: boolean;
      withScrollableDot?: boolean;
    }[];
    legend?: string[];
  }

  export interface LineChartProps extends ViewProps {
    data: LineChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    bezier?: boolean;
    style?: object;
    withDots?: boolean;
    withShadow?: boolean;
    withInnerLines?: boolean;
    withOuterLines?: boolean;
    withVerticalLines?: boolean;
    withHorizontalLines?: boolean;
    fromZero?: boolean;
    yAxisLabel?: string;
    yAxisSuffix?: string;
    yAxisInterval?: number;
    xAxisLabel?: string;
    hidePointsAtIndex?: number[];
    onDataPointClick?: (data: { value: number; dataset: { data: number[] }; getColor: (opacity: number) => string; index: number }) => void;
    formatYLabel?: (yValue: string) => string;
    formatXLabel?: (xValue: string) => string;
    getDotColor?: (dataPoint: number, index: number) => string;
    renderDotContent?: (params: { x: number; y: number; index: number; indexData: number }) => React.ReactNode;
  }

  export class LineChart extends React.Component<LineChartProps> {}

  export interface BarChartData {
    labels: string[];
    datasets: {
      data: number[];
      colors?: string[];
      color?: string;
    }[];
  }

  export interface BarChartProps extends ViewProps {
    data: BarChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    style?: object;
    withHorizontalLabels?: boolean;
    withVerticalLabels?: boolean;
    verticalLabelRotation?: number;
    horizontalLabelRotation?: number;
    showBarTops?: boolean;
    showValuesOnTopOfBars?: boolean;
    withInnerLines?: boolean;
    segments?: number;
    fromZero?: boolean;
    flatColor?: boolean;
  }

  export class BarChart extends React.Component<BarChartProps> {}

  export interface PieChartData {
    name?: string;
    population?: number;
    color?: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }

  export interface PieChartProps extends ViewProps {
    data: PieChartData[];
    width: number;
    height: number;
    chartConfig?: ChartConfig;
    accessor?: string;
    backgroundColor?: string;
    paddingLeft?: string;
    center?: [number, number];
    absolute?: boolean;
    hasLegend?: boolean;
    avoidFalseZero?: boolean;
  }

  export class PieChart extends React.Component<PieChartProps> {}
}
