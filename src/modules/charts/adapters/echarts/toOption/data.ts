import { DataRow, Field } from '@/app/types';

// 保存最近一次构建过程的元信息（如忽略记录数）
let lastMeta: { ignored: number } = { ignored: 0 };
export const setLastMeta = (meta: { ignored?: number }) => {
  lastMeta.ignored = Math.max(0, meta.ignored ?? 0);
};
export const getLastMeta = () => ({ ...lastMeta });

export const ensureFieldsExist = (fields: Field[], keys: Array<string | undefined>) => {
  const missing = keys
    .filter((k): k is string => !!k && typeof k === 'string')
    .filter(k => !fields.some(f => f.key === k || f.name === k));
  if (missing.length > 0) {
    throw new Error(`映射字段不存在: ${missing.join(', ')}`);
  }
};

export const getAxisType = (fieldType?: string): 'category' | 'time' | 'value' => {
  switch (fieldType) {
    case 'date':
      return 'time';
    case 'number':
      return 'value';
    default:
      return 'category';
  }
};

// 通用：按 x、series 分组聚合（sum）用于 line/bar/area
export const buildXYSeries = (
  rows: DataRow[],
  xField: string,
  yField: string,
  seriesField?: string
) => {
  let invalidCount = 0;
  
  if (seriesField) {
    const seriesMap = new Map<string, Map<string, number>>();
    const xValues = new Set<string>();
    rows.forEach(row => {
      const xv = String(row[xField] ?? '');
      const yNum = Number(row[yField]);
      if (!Number.isFinite(yNum)) {
        invalidCount++;
        return; // 丢弃无效数据
      }
      const sv = String(row[seriesField] ?? '默认');
      xValues.add(xv);
      if (!seriesMap.has(sv)) seriesMap.set(sv, new Map());
      seriesMap.get(sv)!.set(xv, (seriesMap.get(sv)!.get(xv) || 0) + yNum);
    });
    const xAxis = Array.from(xValues).sort();
    const series = Array.from(seriesMap.entries()).map(([name, data]) => ({
      name,
      data: xAxis.map(x => data.get(x) || 0),
    }));
    return { xAxis, series, invalidCount };
  }
  const agg = new Map<string, number>();
  rows.forEach(row => {
    const xv = String(row[xField] ?? '');
    const yNum = Number(row[yField]);
    if (!Number.isFinite(yNum)) {
      invalidCount++;
      return; // 丢弃无效数据
    }
    agg.set(xv, (agg.get(xv) || 0) + yNum);
  });
  const xAxis = Array.from(agg.keys()).sort();
  const series = [{ name: yField, data: xAxis.map(x => agg.get(x) || 0) }];
  return { xAxis, series, invalidCount };
};

// 饼图：聚合分类求和，类别过多时 Top N + 其他
export const buildPie = (
  rows: DataRow[],
  categoryField: string,
  valueField: string,
  topN: number = 12
) => {
  let invalidCount = 0;
  const agg = new Map<string, number>();
  rows.forEach(r => {
    const cat = String(r[categoryField] ?? '其他');
    const vNum = Number(r[valueField]);
    if (!Number.isFinite(vNum)) { invalidCount++; return; } // 丢弃无效
    agg.set(cat, (agg.get(cat) || 0) + vNum);
  });
  const entries = Array.from(agg.entries()).sort((a, b) => b[1] - a[1]);
  if (entries.length <= topN) return { data: entries.map(([name, value]) => ({ name, value })), invalidCount };
  const head = entries.slice(0, topN - 1).map(([name, value]) => ({ name, value }));
  const otherValue = entries.slice(topN - 1).reduce((sum, [, v]) => sum + v, 0);
  return { data: [...head, { name: '其他', value: otherValue }], invalidCount };
};

// 散点：按 series 分成多组 [[x,y]]
export const buildScatter = (
  rows: DataRow[],
  xField: string,
  yField: string,
  seriesField?: string
) => {
  let invalidCount = 0;
  if (seriesField) {
    const map = new Map<string, Array<[number, number]>>();
    rows.forEach(r => {
      const x = Number(r[xField]);
      const y = Number(r[yField]);
      if (!(Number.isFinite(x) && Number.isFinite(y))) { invalidCount++; return; }
      const s = String(r[seriesField] ?? '默认');
      if (!map.has(s)) map.set(s, []);
      map.get(s)!.push([x, y]);
    });
    return { groups: Array.from(map.entries()).map(([name, data]) => ({ name, data })), invalidCount };
  }
  const data: Array<[number, number]> = [];
  rows.forEach(r => {
    const x = Number(r[xField]);
    const y = Number(r[yField]);
    if (!(Number.isFinite(x) && Number.isFinite(y))) { invalidCount++; return; }
    data.push([x, y]);
  });
  return { groups: [{ name: '数据', data }], invalidCount };
};

// 雷达：按维度聚合求和，输出 indicators 与系列向量
export const buildRadar = (
  rows: DataRow[],
  dimensionField: string,
  valueField: string,
  seriesField?: string
) => {
  let invalidCount = 0;
  const dimensions = new Set<string>();
  const seriesMap = new Map<string, Map<string, number>>();
  const single = new Map<string, number>();

  rows.forEach(r => {
    const d = String(r[dimensionField] ?? '');
    const vNum = Number(r[valueField]);
    if (!Number.isFinite(vNum)) { invalidCount++; return; } // 丢弃无效
    dimensions.add(d);
    if (seriesField) {
      const s = String(r[seriesField] ?? '默认');
      if (!seriesMap.has(s)) seriesMap.set(s, new Map());
      seriesMap.get(s)!.set(d, (seriesMap.get(s)!.get(d) || 0) + vNum);
    } else {
      single.set(d, (single.get(d) || 0) + vNum);
    }
  });

  const indicator = Array.from(dimensions).map(name => ({ name, max: 100 }));
  if (seriesField) {
    const series = Array.from(seriesMap.entries()).map(([name, map]) => ({
      name,
      value: indicator.map(i => map.get(i.name) || 0),
    }));
    return { indicator, series, invalidCount };
  }
  return {
    indicator,
    series: [{ name: '数据', value: indicator.map(i => single.get(i.name) || 0) }],
    invalidCount,
  };
};
