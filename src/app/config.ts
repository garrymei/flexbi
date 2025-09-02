// 全局配置常量
export const CONFIG = {
  // 应用信息
  APP_NAME: 'FlexBI',
  APP_VERSION: '0.1.0',
  APP_DESCRIPTION: '低门槛、轻量、可扩展的数据可视化工具',

  // 数据相关
  MAX_ROWS_PREVIEW: 1000, // 预览最大行数
  MAX_ROWS_PROCESS: 100000, // 处理最大行数
  SAMPLE_SIZE: 1000, // 字段类型推断采样大小

  // 图表相关
  DEFAULT_CHART_HEIGHT: 400,
  DEFAULT_CHART_WIDTH: 600,
  MAX_CHARTS_PER_CANVAS: 20,

  // 导出相关
  EXPORT_QUALITY: 0.9, // PNG导出质量
  EXPORT_SCALE: 2, // 导出缩放比例

  // 存储相关
  STORAGE_PREFIX: 'flexbi_',
  MAX_STORAGE_SIZE: 50 * 1024 * 1024, // 50MB

  // 性能相关
  DEBOUNCE_DELAY: 300, // 防抖延迟
  THROTTLE_DELAY: 100, // 节流延迟
} as const;

// 功能开关
export const FEATURES = {
  ENABLE_TEMPLATES: true,
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_DATA_TRANSFORMS: true,
  ENABLE_EXPORT_PPTX: false, // v2功能
  ENABLE_EXPORT_EXCEL: false, // v2功能
  ENABLE_CANVAS: false, // v2功能
} as const;

// 图表类型配置
export const CHART_TYPES = {
  line: {
    name: '折线图',
    description: '展示数据趋势变化',
    icon: '📈',
    requiredFields: ['x', 'y'],
    optionalFields: ['series'],
  },
  bar: {
    name: '柱状图',
    description: '对比不同类别的数值',
    icon: '📊',
    requiredFields: ['x', 'y'],
    optionalFields: ['series'],
  },
  area: {
    name: '面积图',
    description: '展示数据量的累积变化',
    icon: '🟦',
    requiredFields: ['x', 'y'],
    optionalFields: ['series'],
  },
  scatter: {
    name: '散点图',
    description: '展示两个数值变量的关系',
    icon: '🔵',
    requiredFields: ['x', 'y'],
    optionalFields: ['series'],
  },
  pie: {
    name: '饼图',
    description: '展示部分与整体的比例关系',
    icon: '🥧',
    requiredFields: ['category', 'value'],
    optionalFields: [],
  },
  radar: {
    name: '雷达图',
    description: '展示多维度的对比分析',
    icon: '🕸️',
    requiredFields: ['dimension', 'value'],
    optionalFields: ['series'],
  },
} as const;

// 颜色方案
export const COLOR_SCHEMES = {
  default: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
  warm: ['#f97316', '#ef4444', '#f59e0b', '#eab308', '#fbbf24', '#fde047'],
  cool: ['#3b82f6', '#06b6d4', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e'],
  pastel: ['#a5b4fc', '#fca5a5', '#86efac', '#fcd34d', '#c4b5fd', '#99f6e4'],
} as const;

// 默认样式
export const DEFAULT_STYLES = {
  chart: {
    showLegend: true,
    showDataLabels: false,
    showGrid: true,
    colorScheme: 'default',
    fontSize: 14,
    margin: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 30,
    },
  },
  ui: {
    theme: 'light',
    sidebarOpen: true,
    activeModal: null,
    loading: false,
    error: null,
  },
} as const;
