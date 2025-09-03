import { ChartConfig, DataRow, Field, Mapping } from '@/app/types';
import { ensureFieldsExist, buildXYSeries, setLastMeta } from './data';
import { getThemeColors } from '../colors';

export const toBarOption = (
  _fields: Field[],
  rows: DataRow[],
  mapping: Mapping,
  style: Record<string, any> = {},
  chart?: ChartConfig
) => {
  const { x, y, series } = mapping;
  if (!x || !y) throw new Error('柱状图需要x和y字段');
  ensureFieldsExist(_fields, [x, y, series]);
  const built = buildXYSeries(rows, x, y, series);
  setLastMeta({ ignored: built.invalidCount });
  const { xAxis, series: ser } = built;

  const colors = Array.isArray((style as any)?.colors) && (style as any)?.colors.length
    ? (style as any)?.colors
    : getThemeColors((style as any)?.colorScheme || 'default');

  const xCount = xAxis.length;
  
  return {
    color: colors,
    title: { text: style.title || chart?.title, left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { 
      type: ser.length > 8 ? 'scroll' : 'plain', 
      show: style.showLegend !== false, 
      top: 30 
    },
    grid: {
      left: style.gridMargin || 60,
      right: style.gridMargin || 60,
      top: style.showLegend !== false ? 80 : 60,
      bottom: style.gridMargin || 60,
    },
    xAxis: {
      type: 'category',
      data: xAxis,
      axisLabel: {
        interval: 'auto',
        rotate: style.xLabelRotate ?? (xCount > 100 ? 45 : 0),
      },
    },
    yAxis: { type: 'value' },
    series: ser.map((s: any) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      label: { show: (style.showLabel ?? style.showDataLabels) || false },
      stack: style.stacked ? 'total' : undefined,
      barWidth: typeof style.barWidth === 'number'
        ? (style.barWidth <= 1 ? `${Math.round(style.barWidth * 100)}%` : style.barWidth)
        : undefined,
    })),
  };
};
