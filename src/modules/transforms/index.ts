// 过滤相关
export * from './filter';

// 排序相关
export * from './sort';

// 分组聚合相关
export * from './groupBy';
export * from './aggregate';

// 数据处理工具函数
export const processData = {
  // 链式处理数据
  chain: (rows: any[]) => ({
    filter: (filterRule: any) => {
      const { applyFilter } = require('./filter');
      return processData.chain(applyFilter(rows, filterRule));
    },
    sort: (sortRule: any) => {
      const { sortData } = require('./sort');
      return processData.chain(sortData(rows, sortRule));
    },
    groupBy: (groupConfig: any) => {
      const { groupBy } = require('./groupBy');
      return processData.chain(groupBy(rows, groupConfig));
    },
    get: () => rows
  })
};

// 统一应用过滤/排序/聚合
import type { DataRow } from '@/app/types';
import { applyFilter, FilterCondition } from './filter';
import { sortData } from './sort';
import { aggregateRows } from './aggregate';

type TransformConfig = {
  filter?: Array<{ field: string; op: 'eq'|'ne'|'gt'|'lt'|'ge'|'le'|'in'|'notin'; value: any | any[] }>;
  sort?: Array<{ field: string; order: 'asc'|'desc' }>;
  aggregate?: { by?: string[]; field: string; op?: 'sum' };
};

const opMap: Record<string, FilterCondition['operator']> = {
  eq: 'equals',
  ne: 'not_equals',
  gt: 'greater_than',
  lt: 'less_than',
  ge: 'greater_equal',
  le: 'less_equal',
  in: 'in',
  notin: 'not_in',
};

export const applyTransforms = (rows: DataRow[], config?: TransformConfig): DataRow[] => {
  if (!config) return rows;
  let out = rows;

  // 过滤
  if (config.filter && config.filter.length > 0) {
    const conditions: FilterCondition[] = config.filter.map(f => ({
      field: f.field,
      operator: opMap[f.op] || 'equals',
      value: f.value as any,
      value2: undefined,
    }));
    if (conditions.length === 1) {
      out = applyFilter(out, conditions[0]);
    } else {
      out = applyFilter(out, { conditions, logic: 'AND' });
    }
  }

  // 排序
  if (config.sort && config.sort.length > 0) {
    out = sortData(out, config.sort.map(s => ({ field: s.field, direction: s.order })));
  }

  // 聚合（仅 sum）
  if (config.aggregate && config.aggregate.field) {
    out = aggregateRows(out, { by: config.aggregate.by || [], field: config.aggregate.field, op: 'sum' });
  }

  return out;
};


// 数据质量检查
export const validateData = (rows: any[]) => {
  const issues: Array<{ row: number; field: string; issue: string; value: any }> = [];
  
  rows.forEach((row, rowIndex) => {
    Object.entries(row).forEach(([field, value]) => {
      // 检查空值
      if (value === null || value === undefined || value === '') {
        issues.push({
          row: rowIndex + 1,
          field,
          issue: '空值',
          value
        });
      }
      
      // 检查数值字段
      if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
        // 可能是数值，建议转换
        issues.push({
          row: rowIndex + 1,
          field,
          issue: '建议转换为数值类型',
          value
        });
      }
    });
  });
  
  return {
    totalRows: rows.length,
    issues,
    hasIssues: issues.length > 0,
    issueCount: issues.length
  };
};

// 数据统计摘要
export const getDataSummary = (rows: any[]) => {
  if (rows.length === 0) {
    return {
      totalRows: 0,
      totalFields: 0,
      fieldTypes: {},
      sampleData: []
    };
  }
  
  const firstRow = rows[0];
  const fields = Object.keys(firstRow);
  
  // 推断字段类型
  const fieldTypes: Record<string, string> = {};
  fields.forEach(field => {
    const sampleValues = rows.slice(0, 100).map(row => row[field]);
    fieldTypes[field] = inferFieldType(sampleValues);
  });
  
  return {
    totalRows: rows.length,
    totalFields: fields.length,
    fieldTypes,
    sampleData: rows.slice(0, 5), // 前5行作为样本
    fieldStats: fields.map(field => ({
      name: field,
      type: fieldTypes[field],
      uniqueValues: new Set(rows.map(row => row[field])).size,
      nullCount: rows.filter(row => row[field] === null || row[field] === undefined).length
    }))
  };
};

// 推断字段类型
const inferFieldType = (values: any[]): string => {
  const nonNullValues = values.filter(v => v !== null && v !== undefined);
  
  if (nonNullValues.length === 0) return 'unknown';
  
  // 检查是否为布尔值
  const booleanValues = nonNullValues.filter(v => 
    typeof v === 'boolean' || 
    (typeof v === 'string' && /^(true|false|yes|no|1|0)$/i.test(v))
  );
  if (booleanValues.length === nonNullValues.length) return 'boolean';
  
  // 检查是否为日期
  const dateValues = nonNullValues.filter(v => {
    if (v instanceof Date) return true;
    if (typeof v === 'string') {
      const date = new Date(v);
      return !isNaN(date.getTime());
    }
    return false;
  });
  if (dateValues.length > nonNullValues.length * 0.8) return 'date';
  
  // 检查是否为数值
  const numberValues = nonNullValues.filter(v => 
    typeof v === 'number' || 
    (typeof v === 'string' && !isNaN(Number(v)) && v.trim() !== '')
  );
  if (numberValues.length > nonNullValues.length * 0.8) return 'number';
  
  return 'string';
};
