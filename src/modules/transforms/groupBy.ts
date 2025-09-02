import { Field, DataRow } from '@/app/types';

export type AggregationFunction = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'first' | 'last';

export interface AggregationField {
  field: string;
  function: AggregationFunction;
  alias?: string;
}

export interface GroupByConfig {
  groupFields: string[];
  aggregations: AggregationField[];
}

export interface GroupedResult {
  groups: Record<string, any>;
  aggregations: Record<string, any>;
  count: number;
}

/**
 * 按字段分组并聚合数据
 */
export const groupBy = (
  rows: DataRow[],
  config: GroupByConfig
): GroupedResult[] => {
  const { groupFields, aggregations } = config;
  
  if (groupFields.length === 0) {
    // 无分组字段，对整个数据集进行聚合
    return [{
      groups: {},
      aggregations: calculateAggregations(rows, aggregations),
      count: rows.length
    }];
  }

  // 按分组字段分组
  const groups = new Map<string, DataRow[]>();
  
  rows.forEach(row => {
    const groupKey = createGroupKey(row, groupFields);
    
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(row);
  });

  // 对每个分组计算聚合
  return Array.from(groups.entries()).map(([groupKey, groupRows]) => {
    const groupValues = parseGroupKey(groupKey, groupFields);
    
    return {
      groups: groupValues,
      aggregations: calculateAggregations(groupRows, aggregations),
      count: groupRows.length
    };
  });
};

/**
 * 创建分组键
 */
const createGroupKey = (row: DataRow, groupFields: string[]): string => {
  return groupFields.map(field => {
    const value = row[field];
    if (value === null || value === undefined) {
      return 'null';
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  }).join('|');
};

/**
 * 解析分组键
 */
const parseGroupKey = (groupKey: string, groupFields: string[]): Record<string, any> => {
  const values = groupKey.split('|');
  const result: Record<string, any> = {};
  
  groupFields.forEach((field, index) => {
    const value = values[index];
    if (value === 'null') {
      result[field] = null;
    } else {
      // 尝试转换为原始类型
      const numValue = Number(value);
      if (!isNaN(numValue) && value !== '') {
        result[field] = numValue;
      } else {
        result[field] = value;
      }
    }
  });
  
  return result;
};

/**
 * 计算聚合值
 */
const calculateAggregations = (
  rows: DataRow[],
  aggregations: AggregationField[]
): Record<string, any> => {
  const result: Record<string, any> = {};
  
  aggregations.forEach(({ field, function: aggFunc, alias }) => {
    const key = alias || `${aggFunc}_${field}`;
    result[key] = calculateAggregation(rows, field, aggFunc);
  });
  
  return result;
};

/**
 * 计算单个聚合值
 */
const calculateAggregation = (
  rows: DataRow[],
  field: string,
  function: AggregationFunction
): any => {
  const values = rows
    .map(row => row[field])
    .filter(value => value !== null && value !== undefined);
  
  if (values.length === 0) {
    return null;
  }
  
  switch (function) {
    case 'sum':
      return values.reduce((sum, val) => sum + Number(val), 0);
    
    case 'avg':
      const sum = values.reduce((sum, val) => sum + Number(val), 0);
      return sum / values.length;
    
    case 'min':
      return Math.min(...values.map(val => Number(val)));
    
    case 'max':
      return Math.max(...values.map(val => Number(val)));
    
    case 'count':
      return values.length;
    
    case 'first':
      return values[0];
    
    case 'last':
      return values[values.length - 1];
    
    default:
      return null;
  }
};

/**
 * 创建简单的分组配置
 */
export const createSimpleGroupBy = (
  groupField: string,
  aggregationField: string,
  aggregationFunction: AggregationFunction = 'sum'
): GroupByConfig => {
  return {
    groupFields: [groupField],
    aggregations: [{
      field: aggregationField,
      function: aggregationFunction
    }]
  };
};

/**
 * 创建多字段分组配置
 */
export const createMultiGroupBy = (
  groupFields: string[],
  aggregationFields: Array<{ field: string; function: AggregationFunction; alias?: string }>
): GroupByConfig => {
  return {
    groupFields,
    aggregations: aggregationFields
  };
};

/**
 * 获取分组字段的唯一值
 */
export const getGroupFieldValues = (rows: DataRow[], field: string): any[] => {
  const values = new Set<any>();
  
  rows.forEach(row => {
    const value = row[field];
    if (value !== null && value !== undefined) {
      values.add(value);
    }
  });
  
  return Array.from(values).sort();
};

/**
 * 获取分组统计信息
 */
export const getGroupStats = (
  rows: DataRow[],
  groupField: string,
  valueField: string
): Array<{ group: any; count: number; sum: number; avg: number; min: number; max: number }> => {
  const config = createSimpleGroupBy(groupField, valueField);
  const grouped = groupBy(rows, config);
  
  return grouped.map(item => ({
    group: item.groups[groupField],
    count: item.count,
    sum: item.aggregations[`sum_${valueField}`],
    avg: item.aggregations[`avg_${valueField}`],
    min: item.aggregations[`min_${valueField}`],
    max: item.aggregations[`max_${valueField}`]
  }));
};

/**
 * 透视表功能（交叉表）
 */
export const createPivotTable = (
  rows: DataRow[],
  rowField: string,
  colField: string,
  valueField: string,
  aggregationFunction: AggregationFunction = 'sum'
): {
  rowHeaders: any[];
  colHeaders: any[];
  data: (number | null)[][];
} => {
  const rowValues = getGroupFieldValues(rows, rowField);
  const colValues = getGroupFieldValues(rows, colField);
  
  // 创建数据矩阵
  const data: (number | null)[][] = [];
  
  rowValues.forEach((rowValue, rowIndex) => {
    data[rowIndex] = [];
    
    colValues.forEach((colValue, colIndex) => {
      // 过滤出当前行列组合的数据
      const filteredRows = rows.filter(row => 
        row[rowField] === rowValue && row[colField] === colValue
      );
      
      if (filteredRows.length === 0) {
        data[rowIndex][colIndex] = null;
      } else {
        data[rowIndex][colIndex] = calculateAggregation(filteredRows, valueField, aggregationFunction);
      }
    });
  });
  
  return {
    rowHeaders: rowValues,
    colHeaders: colValues,
    data
  };
};

