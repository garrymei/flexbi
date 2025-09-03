import { ChartConfig, DataRow, Field, Mapping } from '@/app/types';
import { ensureFieldsExist, buildPie, setLastMeta } from './data';
import { getThemeColors } from '../colors';

export const toPieOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: Mapping,
  style: Record<string, any> = {},
  chart?: ChartConfig
) => {
  const { x, value } = mapping;
  if (!x || !value) throw new Error('饼图需要x和value字段');
  ensureFieldsExist(fields, [x, value]);
  const built = buildPie(rows, x, value, 12);
  setLastMeta({ ignored: built.invalidCount });
  const data = built.data;

  const colors = Array.isArray((style as any)?.colors) && (style as any)?.colors.length
    ? (style as any)?.colors
    : getThemeColors((style as any)?.colorScheme || 'default');

  return {
    color: colors,
    title: { text: style.title || chart?.title, left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { show: style.showLegend !== false, orient: 'vertical', left: 'left', top: 'middle' },
    series: [{
      name: x,
      type: 'pie',
      radius: style.roseType ? ['20%', '70%'] : '50%',
      data,
      roseType: style.roseType ? 'radius' : undefined,
      label: {
        show: (style.showLabel ?? style.showDataLabels) || false,
        formatter: style.showPercent ? '{b}: {d}%' : '{b}: {c} ({d}%)',
      },
    }],
  };
};
