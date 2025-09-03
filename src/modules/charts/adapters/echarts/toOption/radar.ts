import { ChartConfig, DataRow, Field, Mapping } from '@/app/types';
import { ensureFieldsExist, buildRadar, setLastMeta } from './data';
import { getThemeColors } from '../colors';

export const toRadarOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: Mapping,
  style: Record<string, any> = {},
  chart?: ChartConfig
) => {
  const { x, value, series } = mapping;
  if (!x || !value) throw new Error('雷达图需要x和value字段');
  ensureFieldsExist(fields, [x, value, series]);
  const built = buildRadar(rows, x, value, series);
  setLastMeta({ ignored: built.invalidCount });
  const { indicator, series: vectors } = built;

  const colors = Array.isArray((style as any)?.colors) && (style as any)?.colors.length
    ? (style as any)?.colors
    : getThemeColors((style as any)?.colorScheme || 'default');

  return {
    color: colors,
    title: { text: style.title || chart?.title, left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { show: style.showLegend !== false, top: 30 },
    radar: { indicator, radius: style.radius || '70%' },
    series: [{
      name: '数据',
      type: 'radar',
      data: vectors,
      areaStyle: style.showArea ? {} : undefined,
      lineStyle: style.showLine === false ? { width: 0 } : { width: 1 },
    }],
  };
};
