// 基础数据类型
export type FieldType = 'string' | 'number' | 'date' | 'boolean';

// 字段定义
export interface Field {
  id: string;
  name: string;
  type: FieldType;
  uniqueValues: number;
  sampleValues: any[];
}

// 数据集
export interface Dataset {
  id: string;
  name: string;
  fields: Field[];
  rows: any[][];
  rowCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 图表类型
export type ChartType = 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'radar';

// 字段角色
export type FieldRole = 'x' | 'y' | 'series' | 'category' | 'value' | 'dimension';

// 字段映射
export interface FieldMapping {
  [role: string]: string; // role -> fieldId
}

// 图表配置
export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  subtitle?: string;
  fieldMapping: FieldMapping;
  style: ChartStyle;
  data: any[];
}

// 图表样式
export interface ChartStyle {
  showLegend: boolean;
  showDataLabels: boolean;
  showGrid: boolean;
  colorScheme: string;
  fontSize: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// 导出格式
export type ExportFormat = 'png' | 'svg' | 'pptx' | 'excel';

// 处理操作类型
export type TransformType = 'filter' | 'sort' | 'groupBy' | 'compute';

// 过滤条件
export interface FilterCondition {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: any;
  value2?: any; // 用于between操作
}

// 排序条件
export interface SortCondition {
  fieldId: string;
  direction: 'asc' | 'desc';
}

// 分组条件
export interface GroupCondition {
  fieldId: string;
  aggregate: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

// 模板
export interface Template {
  id: string;
  name: string;
  description?: string;
  chartConfig: ChartConfig;
  createdAt: Date;
  updatedAt: Date;
}

// UI状态
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeModal: string | null;
  loading: boolean;
  error: string | null;
}
