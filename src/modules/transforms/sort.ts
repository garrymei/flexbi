import { Field, DataRow } from '@/app/types';

export interface SortField {
  field: string;
  direction: 'asc' | 'desc';
}

export type SortRule = SortField[];

/**
 * 对数据集进行排序
 */
export const sortData = (
  rows: DataRow[],
  sortRule: SortRule
): DataRow[] => {
  if (sortRule.length === 0) {
    return rows;
  }

  return [...rows].sort((a, b) => {
    for (const { field, direction } of sortRule) {
      const comparison = compareValues(a[field], b[field]);
      if (comparison !== 0) {
        return direction === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
};

/**
 * 比较两个值
 */
const compareValues = (a: any, b: any): number => {
  // 处理null/undefined
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (a === b) return 0;

  // 数字比较
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  // 日期比较
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // 字符串比较
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  // 布尔值比较
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return a === b ? 0 : a ? 1 : -1;
  }

  // 混合类型，转换为字符串比较
  return String(a).localeCompare(String(b));
};

/**
 * 创建单字段排序规则
 */
export const createSortRule = (field: string, direction: 'asc' | 'desc' = 'asc'): SortRule => {
  return [{ field, direction }];
};

/**
 * 创建多字段排序规则
 */
export const createMultiSortRule = (fields: Array<{ field: string; direction?: 'asc' | 'desc' }>): SortRule => {
  return fields.map(({ field, direction = 'asc' }) => ({ field, direction }));
};

/**
 * 切换排序方向
 */
export const toggleSortDirection = (currentDirection: 'asc' | 'desc'): 'asc' | 'desc' => {
  return currentDirection === 'asc' ? 'desc' : 'asc';
};

/**
 * 获取字段的排序建议
 */
export const getSortSuggestions = (fields: Field[]): SortField[] => {
  const suggestions: SortField[] = [];

  // 优先按日期字段排序
  const dateFields = fields.filter(f => f.type === 'date');
  if (dateFields.length > 0) {
    suggestions.push({ field: dateFields[0].name, direction: 'desc' });
  }

  // 其次按数值字段排序
  const numberFields = fields.filter(f => f.type === 'number');
  if (numberFields.length > 0) {
    suggestions.push({ field: numberFields[0].name, direction: 'desc' });
  }

  // 最后按文本字段排序
  const stringFields = fields.filter(f => f.type === 'string');
  if (stringFields.length > 0) {
    suggestions.push({ field: stringFields[0].name, direction: 'asc' });
  }

  return suggestions;
};

/**
 * 智能排序（基于字段类型和数据特征）
 */
export const smartSort = (rows: DataRow[], fields: Field[]): DataRow[] => {
  const suggestions = getSortSuggestions(fields);
  if (suggestions.length === 0) {
    return rows;
  }

  return sortData(rows, suggestions);
};

/**
 * 自然排序（处理包含数字的字符串）
 */
export const naturalSort = (
  rows: DataRow[],
  field: string,
  direction: 'asc' | 'desc' = 'asc'
): DataRow[] => {
  return [...rows].sort((a, b) => {
    const aVal = String(a[field] || '');
    const bVal = String(b[field] || '');
    
    const comparison = naturalCompare(aVal, bVal);
    return direction === 'asc' ? comparison : -comparison;
  });
};

/**
 * 自然比较函数
 */
const naturalCompare = (a: string, b: string): number => {
  const aParts = a.match(/(\d+|\D+)/g) || [];
  const bParts = b.match(/(\d+|\D+)/g) || [];
  
  const maxLength = Math.max(aParts.length, bParts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const aPart = aParts[i] || '';
    const bPart = bParts[i] || '';
    
    // 如果都是数字，按数值比较
    if (/^\d+$/.test(aPart) && /^\d+$/.test(bPart)) {
      const aNum = parseInt(aPart, 10);
      const bNum = parseInt(bPart, 10);
      if (aNum !== bNum) {
        return aNum - bNum;
      }
    } else {
      // 否则按字符串比较
      const comparison = aPart.localeCompare(bPart);
      if (comparison !== 0) {
        return comparison;
      }
    }
  }
  
  return 0;
};

/**
 * 随机排序
 */
export const shuffleData = (rows: DataRow[]): DataRow[] => {
  const shuffled = [...rows];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

