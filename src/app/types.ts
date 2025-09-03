// 基础数据类型
export type FieldType = 'number' | 'string' | 'date' | 'boolean';

// 字段定义
export interface Field {
  key: string;
  name: string;
  type: FieldType;
  uniqueValues?: number;
  sampleValues?: any[];
}

// 数据行类型
export type DataRow = Record<string, any>;

// 数据集
export interface Dataset {
  id: string;
  name: string;
  fields: Field[];
  rows: DataRow[];
  rowCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 图表类型
export type ChartKind = 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'radar';
export type ChartType = ChartKind;

// 字段映射
export interface Mapping {
  x?: string;
  y?: string;
  series?: string;
  value?: string;      // pie/radar
}

// 字段角色
export type FieldRole = 'x' | 'y' | 'series' | 'value';

// 图表配置
export interface ChartConfig {
  id: string;
  type: ChartKind;
  title: string;
  subtitle?: string;
  mapping: Mapping;
  style?: {
    title?: string;
    subtitle?: string;
    showLegend?: boolean;
    showDataLabels?: boolean;
    gridMargin?: number;
    colorScheme?: 'default' | 'schemeA' | 'schemeB';
    xLabelRotate?: 0 | 30 | 45 | 60 | 90;
    decimals?: 0 | 1 | 2 | 3;
    // 动态样式属性
    smooth?: boolean;           // 平滑曲线 (line/area)
    showSymbol?: boolean;       // 显示标记点 (line/area/scatter)
    lineWidth?: number;         // 线条宽度 (line/area)
    stacked?: boolean;          // 堆叠 (bar/area)
    barWidth?: number;          // 柱状图宽度 (bar)
    showLabel?: boolean;        // 显示标签 (bar/pie)
    opacity?: number;           // 透明度 (area)
    symbolSize?: number;        // 标记点大小 (scatter)
    roseType?: boolean;         // 玫瑰图 (pie)
    showPercent?: boolean;      // 显示百分比 (pie)
    radius?: number | string;   // 半径 (pie/radar)
    showArea?: boolean;         // 显示区域 (radar)
    showLine?: boolean;         // 显示线条 (radar)
  };
  transform?: {
    filter?: Array<{ field: string; op: 'eq'|'ne'|'gt'|'lt'|'ge'|'le'|'in'|'notin'; value: any | any[] }>;
    sort?: { field: string; order: 'asc'|'desc' }[];
    aggregate?: { by?: string[]; field: string; op?: 'sum' };
  };
}

// 画布布局（v2+）
export interface Dashboard {
  id: string;
  title: string;
  items: Array<{
    id: string;
    chart: ChartConfig;
    position: { x: number; y: number; w: number; h: number }; // grid 单位
  }>;
  createdAt: string;
  updatedAt: string;
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
