import { DataRow } from '@/app/types';

export interface AggregateConfig {
  by?: string[]; // 分组字段
  field: string; // 需要聚合的数值字段
  op?: 'sum';    // 先只实现 sum
}

export const aggregateRows = (rows: DataRow[], config: AggregateConfig): DataRow[] => {
  const { by = [], field } = config;
  if (!field) return rows;

  if (by.length === 0) {
    const sum = rows.reduce((acc, r) => acc + (Number(r[field]) || 0), 0);
    return [{ [field]: sum } as DataRow];
  }

  const map = new Map<string, number>();
  const keyOf = (r: DataRow) => by.map(k => String(r[k] ?? '')).join('|');

  rows.forEach(r => {
    const key = keyOf(r);
    const val = Number(r[field]) || 0;
    map.set(key, (map.get(key) || 0) + val);
  });

  // 还原为行
  return Array.from(map.entries()).map(([key, sum]) => {
    const parts = key.split('|');
    const obj: DataRow = {};
    by.forEach((k, i) => (obj[k] = parts[i]));
    obj[field] = sum;
    return obj;
  });
};

