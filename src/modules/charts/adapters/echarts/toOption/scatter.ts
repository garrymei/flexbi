import { ChartConfig, DataRow, Field, Mapping } from '@/app/types';
import { ensureFieldsExist, buildScatter, setLastMeta } from './data';
import { getThemeColors } from '../colors';

export const toScatterOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: Mapping,
  style: Record<string, any> = {},
  chart?: ChartConfig
) => {
  const { x, y, series } = mapping;
  if (!x || !y) throw new Error('散点图需要x和y字段');
  ensureFieldsExist(fields, [x, y, series]);
  const built = buildScatter(rows, x, y, series);
  setLastMeta({ ignored: built.invalidCount });
  const groups = built.groups;

  const colors = Array.isArray((style as any)?.colors) && (style as any)?.colors.length
    ? (style as any)?.colors
    : getThemeColors((style as any)?.colorScheme || 'default');

  return {
    color: colors,
    title: { text: style.title || chart?.title, left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { show: style.showLegend !== false, top: 30 },
    grid: {
      left: style.gridMargin || 60,
      right: style.gridMargin || 60,
      top: style.showLegend !== false ? 80 : 60,
      bottom: style.gridMargin || 60,
    },
    xAxis: { type: 'value', name: x },
    yAxis: { type: 'value', name: y },
    series: groups.map(g => ({
      name: g.name,
      type: 'scatter',
      data: g.data,
      symbolSize: style.symbolSize ?? 8,
    })),
  };
};
