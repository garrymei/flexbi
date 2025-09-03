import { Field } from '@/app/types';

// 图表类型枚举
export type ChartKind = 'line' | 'bar' | 'area' | 'scatter' | 'pie' | 'radar';

// 图表规范接口
export interface ChartSpec {
  kind: ChartKind;
  name: string;
  description: string;
  icon: string;
  requiredFields: {
    x?: string[];
    y?: string[];
    series?: string[];
    category?: string[];
    value?: string[];
    dimension?: string[];
  };
  fieldTypes: {
    x?: string[];
    y?: string[];
    series?: string[];
    category?: string[];
    value?: string[];
    dimension?: string[];
  };
  maxSeries?: number;
  maxCategories?: number;
}

// 图表注册表
export const chartRegistry: Record<ChartKind, ChartSpec> = {
  line: {
    kind: 'line',
    name: '折线图',
    description: '展示数据随时间或类别的变化趋势',
    icon: '📈',
    requiredFields: {
      x: ['x'],
      y: ['y'],
      series: ['series']
    },
    fieldTypes: {
      x: ['string', 'date', 'number'],
      y: ['number'],
      series: ['string']
    },
    maxSeries: 10,
    maxCategories: 50
  },
  bar: {
    kind: 'bar',
    name: '柱状图',
    description: '比较不同类别的数值大小',
    icon: '📊',
    requiredFields: {
      x: ['x'],
      y: ['y'],
      series: ['series']
    },
    fieldTypes: {
      x: ['string', 'date', 'number'],
      y: ['number'],
      series: ['string']
    },
    maxSeries: 8,
    maxCategories: 30
  },
  area: {
    kind: 'area',
    name: '面积图',
    description: '展示数据量的累积变化',
    icon: '🟦',
    requiredFields: {
      x: ['x'],
      y: ['y'],
      series: ['series']
    },
    fieldTypes: {
      x: ['string', 'date', 'number'],
      y: ['number'],
      series: ['string']
    },
    maxSeries: 6,
    maxCategories: 40
  },
  scatter: {
    kind: 'scatter',
    name: '散点图',
    description: '展示两个数值变量之间的关系',
    icon: '🔵',
    requiredFields: {
      x: ['x'],
      y: ['y'],
      series: ['series']
    },
    fieldTypes: {
      x: ['number'],
      y: ['number'],
      series: ['string']
    },
    maxSeries: 8,
    maxCategories: 100
  },
  pie: {
    kind: 'pie',
    name: '饼图',
    description: '展示部分与整体的比例关系',
    icon: '🥧',
    requiredFields: {
      x: ['x'],
      value: ['value']
    },
    fieldTypes: {
      x: ['string'],
      value: ['number']
    },
    maxCategories: 12
  },
  radar: {
    kind: 'radar',
    name: '雷达图',
    description: '展示多维度的数值对比',
    icon: '🕸️',
    requiredFields: {
      x: ['x'],
      value: ['value'],
      series: ['series']
    },
    fieldTypes: {
      x: ['string'],
      value: ['number'],
      series: ['string']
    },
    maxSeries: 5,
    maxCategories: 15
  }
};

/**
 * 为数据集推荐合适的图表类型
 */
export const suggestChartsForDataset = (fields: Field[]): ChartKind[] => {
  const suggestions: Array<{ kind: ChartKind; score: number }> = [];
  
  // 统计字段类型
  const stringFields = fields.filter(f => f.type === 'string');
  const numberFields = fields.filter(f => f.type === 'number');
  const dateFields = fields.filter(f => f.type === 'date');

  // 计算每种图表的适用性得分
  Object.values(chartRegistry).forEach(chart => {
    let score = 0;

    switch (chart.kind) {
      case 'line':
        if (dateFields.length > 0 && numberFields.length > 0) score += 10;
        if (stringFields.length > 0) score += 5;
        break;
      
      case 'bar':
        if (stringFields.length > 0 && numberFields.length > 0) score += 10;
        if (stringFields.length <= 30) score += 5;
        break;
      
      case 'area':
        if (dateFields.length > 0 && numberFields.length > 0) score += 8;
        if (stringFields.length > 0) score += 3;
        break;
      
      case 'scatter':
        if (numberFields.length >= 2) score += 10;
        if (stringFields.length > 0) score += 3;
        break;
      
      case 'pie':
        if (stringFields.length > 0 && numberFields.length > 0) score += 8;
        if (stringFields.length <= 12) score += 5;
        break;
      
      case 'radar':
        if (stringFields.length > 0 && numberFields.length > 0) score += 6;
        if (stringFields.length <= 15) score += 4;
        break;
    }

    if (score > 0) {
      suggestions.push({ kind: chart.kind, score });
    }
  });

  // 按得分排序并返回前3个推荐
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.kind);
};

/**
 * 获取图表规范
 */
export const getChartSpec = (kind: ChartKind): ChartSpec => {
  return chartRegistry[kind];
};

/**
 * 获取所有图表类型
 */
export const getAllChartKinds = (): ChartKind[] => {
  return Object.keys(chartRegistry) as ChartKind[];
};

/**
 * 检查数据集是否适合某种图表类型
 */
export const isDatasetSuitableForChart = (
  fields: Field[], 
  chartKind: ChartKind
): boolean => {
  const spec = chartRegistry[chartKind];
  if (!spec) return false;

  // 检查必需字段
  for (const [, requiredTypes] of Object.entries(spec.fieldTypes)) {
    if (requiredTypes && requiredTypes.length > 0) {
      const hasSuitableField = fields.some(field => 
        requiredTypes.includes(field.type)
      );
      if (!hasSuitableField) return false;
    }
  }

  return true;
};

