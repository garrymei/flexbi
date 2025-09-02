import { Field, DataRow } from '@/app/types';

export interface FilterCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'between' | 'in' | 'not_in';
  value: any;
  value2?: any; // 用于between操作符
}

export interface FilterRule {
  conditions: FilterCondition[];
  logic: 'AND' | 'OR';
}

/**
 * 应用过滤条件到数据集
 */
export const applyFilter = (
  rows: DataRow[],
  filter: FilterRule | FilterCondition
): DataRow[] => {
  if ('conditions' in filter) {
    // 复合过滤规则
    return applyFilterRule(rows, filter);
  } else {
    // 单个过滤条件
    return applyFilterCondition(rows, filter);
  }
};

/**
 * 应用复合过滤规则
 */
const applyFilterRule = (rows: DataRow[], rule: FilterRule): DataRow[] => {
  if (rule.conditions.length === 0) {
    return rows;
  }

  if (rule.conditions.length === 1) {
    return applyFilterCondition(rows, rule.conditions[0]);
  }

  return rows.filter(row => {
    if (rule.logic === 'AND') {
      return rule.conditions.every(condition => 
        evaluateCondition(row, condition)
      );
    } else {
      return rule.conditions.some(condition => 
        evaluateCondition(row, condition)
      );
    }
  });
};

/**
 * 应用单个过滤条件
 */
const applyFilterCondition = (rows: DataRow[], condition: FilterCondition): DataRow[] => {
  return rows.filter(row => evaluateCondition(row, condition));
};

/**
 * 评估单个条件
 */
const evaluateCondition = (row: DataRow, condition: FilterCondition): boolean => {
  const { field, operator, value, value2 } = condition;
  const fieldValue = row[field];

  switch (operator) {
    case 'equals':
      return fieldValue === value;
    
    case 'not_equals':
      return fieldValue !== value;
    
    case 'contains':
      return String(fieldValue).includes(String(value));
    
    case 'not_contains':
      return !String(fieldValue).includes(String(value));
    
    case 'greater_than':
      return Number(fieldValue) > Number(value);
    
    case 'less_than':
      return Number(fieldValue) < Number(value);
    
    case 'greater_equal':
      return Number(fieldValue) >= Number(value);
    
    case 'less_equal':
      return Number(fieldValue) <= Number(value);
    
    case 'between':
      if (value2 === undefined) return false;
      const numValue = Number(fieldValue);
      return numValue >= Number(value) && numValue <= Number(value2);
    
    case 'in':
      if (Array.isArray(value)) {
        return value.includes(fieldValue);
      }
      return false;
    
    case 'not_in':
      if (Array.isArray(value)) {
        return !value.includes(fieldValue);
      }
      return true;
    
    default:
      return true;
  }
};

/**
 * 创建文本字段的模糊搜索过滤
 */
export const createTextSearchFilter = (field: string, searchText: string): FilterCondition => {
  return {
    field,
    operator: 'contains',
    value: searchText
  };
};

/**
 * 创建数值范围过滤
 */
export const createRangeFilter = (field: string, min?: number, max?: number): FilterCondition[] => {
  const conditions: FilterCondition[] = [];
  
  if (min !== undefined) {
    conditions.push({
      field,
      operator: 'greater_equal',
      value: min
    });
  }
  
  if (max !== undefined) {
    conditions.push({
      field,
      operator: 'less_equal',
      value: max
    });
  }
  
  return conditions;
};

/**
 * 创建日期范围过滤
 */
export const createDateRangeFilter = (field: string, startDate?: Date, endDate?: Date): FilterCondition[] => {
  const conditions: FilterCondition[] = [];
  
  if (startDate) {
    conditions.push({
      field,
      operator: 'greater_equal',
      value: startDate
    });
  }
  
  if (endDate) {
    conditions.push({
      field,
      operator: 'less_equal',
      value: endDate
    });
  }
  
  return conditions;
};

/**
 * 创建枚举值过滤
 */
export const createEnumFilter = (field: string, values: any[], exclude: boolean = false): FilterCondition => {
  return {
    field,
    operator: exclude ? 'not_in' : 'in',
    value: values
  };
};

/**
 * 获取字段的唯一值（用于过滤选项）
 */
export const getFieldUniqueValues = (rows: DataRow[], field: string): any[] => {
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
 * 获取字段的统计信息
 */
export const getFieldStats = (rows: DataRow[], field: string): {
  min: number;
  max: number;
  avg: number;
  count: number;
} => {
  const numericValues = rows
    .map(row => Number(row[field]))
    .filter(value => !isNaN(value));
  
  if (numericValues.length === 0) {
    return { min: 0, max: 0, avg: 0, count: 0 };
  }
  
  const sum = numericValues.reduce((acc, val) => acc + val, 0);
  
  return {
    min: Math.min(...numericValues),
    max: Math.max(...numericValues),
    avg: sum / numericValues.length,
    count: numericValues.length
  };
};

