import { ChartConfig, DataRow, Field } from '@/app/types';
import { toLineOption } from './line';
import { toBarOption } from './bar';
import { toAreaOption } from './area';
import { toScatterOption } from './scatter';
import { toPieOption } from './pie';
import { toRadarOption } from './radar';

export const toEChartsOption = (
  fields: Field[],
  rows: DataRow[],
  chart: ChartConfig
) => {
  const { type, mapping, style } = chart;
  switch (type) {
    case 'line':
      return toLineOption(fields, rows, mapping, style as any, chart);
    case 'bar':
      return toBarOption(fields, rows, mapping, style as any, chart);
    case 'area':
      return toAreaOption(fields, rows, mapping, style as any, chart);
    case 'scatter':
      return toScatterOption(fields, rows, mapping, style as any, chart);
    case 'pie':
      return toPieOption(fields, rows, mapping, style as any, chart);
    case 'radar':
      return toRadarOption(fields, rows, mapping, style as any, chart);
    default:
      throw new Error(`不支持的图表类型: ${type}`);
  }
};

