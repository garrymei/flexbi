import { ChartConfig, DataRow, Field, Mapping } from '@/app/types';
import { ensureFieldsExist, buildXYSeries, getAxisType, setLastMeta } from './data';
import { getThemeColors } from '../colors';

export const toAreaOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: Mapping,
  style: Record<string, any> = {},
  chart?: ChartConfig
) => {
  const { x, y, series } = mapping;
  if (!x || !y) throw new Error('面积图需要x和y字段');
  ensureFieldsExist(fields, [x, y, series]);
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
    legend: { type: 'scroll', show: style.showLegend !== false, top: 30 },
    grid: {
      left: style.gridMargin || 60,
      right: style.gridMargin || 60,
      top: style.showLegend !== false ? 80 : 60,
      bottom: style.gridMargin || 60,
    },
    xAxis: {
      type: getAxisType(fields.find(f => f.key === x || f.name === x)?.type),
      data: xAxis,
      axisLabel: {
        interval: 'auto',
        rotate: style.xLabelRotate ?? (xCount > 100 ? 45 : 0),
      },
    },
    yAxis: { type: 'value' },
    series: ser.map((s: any) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      areaStyle: { opacity: style.opacity ?? 0.7 },
      label: { show: style.showDataLabels || false },
      smooth: !!style.smooth,
      showSymbol: style.showSymbol !== false,
      stack: style.stacked ? 'total' : undefined,
      lineStyle: { width: style.lineWidth ?? 2 },
    })),
  };
};
