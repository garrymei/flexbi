import { Field, ChartKind, FieldType, FieldRole } from '@/app/types';

// 重新导出类型
export type { ChartKind, FieldType, FieldRole };

// 字段角色别名
export type Role = FieldRole;

// 角色规则接口
export interface RoleRule {
  role: Role;
  types: FieldType[];          // 支持的字段类型
  required?: boolean;          // 是否必填
  label: string;               // UI 标签
  description?: string;        // 角色描述
  maxCount?: number;           // 最大数量限制
}

// 样式配置接口
export interface StyleOption {
  key: string;
  label: string;
  type: 'boolean' | 'select' | 'number' | 'color';
  defaultValue: any;
  description?: string;
  options?: Array<{ value: any; label: string }>;
  min?: number;
  max?: number;
  step?: number;
}

// 图表规范接口
export interface ChartSpec {
  kind: ChartKind;
  displayName: string;
  description: string;
  icon: string;
  roles: RoleRule[];           // 该图表需要哪些角色
  defaults?: Partial<Record<Role, string>>; // 可选默认映射
  maxSeries?: number;          // 最大系列数
  maxCategories?: number;      // 最大分类数
  suitableFor?: string[];      // 适用场景描述
  styleSchema?: StyleOption[]; // 样式配置选项
}

// 图表注册表
export const registry: ChartSpec[] = [
  {
    kind: 'line',
    displayName: '折线图',
    description: '展示数据随时间或类别的变化趋势',
    icon: '📈',
    roles: [
      { role: 'x', types: ['date', 'string', 'number'], required: true, label: 'X轴', description: '时间、类别或数值' },
      { role: 'y', types: ['number'], required: true, label: 'Y轴', description: '数值指标' },
      { role: 'series', types: ['string'], required: false, label: '系列(可选)', description: '分组维度', maxCount: 10 }
    ],
    defaults: { x: 'x', y: 'y' },
    maxSeries: 10,
    maxCategories: 50,
    suitableFor: ['时间序列数据', '趋势分析', '多系列对比'],
    styleSchema: [
      { key: 'smooth', label: '平滑曲线', type: 'boolean', defaultValue: false, description: '是否启用平滑曲线' },
      { key: 'showSymbol', label: '显示标记点', type: 'boolean', defaultValue: true, description: '是否显示数据点标记' },
      { key: 'lineWidth', label: '线条宽度', type: 'number', defaultValue: 2, min: 1, max: 10, step: 1, description: '线条粗细' }
    ]
  },
  {
    kind: 'bar',
    displayName: '柱状图',
    description: '比较不同类别的数值大小',
    icon: '📊',
    roles: [
      { role: 'x', types: ['string', 'date', 'number'], required: true, label: 'X轴', description: '类别、时间或数值' },
      { role: 'y', types: ['number'], required: true, label: 'Y轴', description: '数值指标' },
      { role: 'series', types: ['string'], required: false, label: '系列(可选)', description: '分组维度', maxCount: 8 }
    ],
    defaults: { x: 'x', y: 'y' },
    maxSeries: 8,
    maxCategories: 30,
    suitableFor: ['类别对比', '排名分析', '多维度比较'],
    styleSchema: [
      { key: 'stacked', label: '堆叠显示', type: 'boolean', defaultValue: false, description: '是否启用堆叠模式' },
      { key: 'barWidth', label: '柱子宽度', type: 'number', defaultValue: 0.6, min: 0.1, max: 1, step: 0.1, description: '柱子宽度比例' },
      { key: 'showLabel', label: '显示数值', type: 'boolean', defaultValue: false, description: '是否在柱子上显示数值' }
    ]
  },
  {
    kind: 'area',
    displayName: '面积图',
    description: '展示数据量的累积变化',
    icon: '🟦',
    roles: [
      { role: 'x', types: ['date', 'string', 'number'], required: true, label: 'X轴', description: '时间、类别或数值' },
      { role: 'y', types: ['number'], required: true, label: 'Y轴', description: '数值指标' },
      { role: 'series', types: ['string'], required: false, label: '系列(可选)', description: '分组维度', maxCount: 6 }
    ],
    defaults: { x: 'x', y: 'y' },
    maxSeries: 6,
    maxCategories: 40,
    suitableFor: ['累积数据', '占比分析', '趋势对比'],
    styleSchema: [
      { key: 'smooth', label: '平滑曲线', type: 'boolean', defaultValue: false, description: '是否启用平滑曲线' },
      { key: 'stacked', label: '堆叠显示', type: 'boolean', defaultValue: false, description: '是否启用堆叠模式' },
      { key: 'opacity', label: '透明度', type: 'number', defaultValue: 0.7, min: 0.1, max: 1, step: 0.1, description: '面积填充透明度' }
    ]
  },
  {
    kind: 'scatter',
    displayName: '散点图',
    description: '展示两个数值变量之间的关系',
    icon: '🔵',
    roles: [
      { role: 'x', types: ['number'], required: true, label: 'X轴', description: '数值变量' },
      { role: 'y', types: ['number'], required: true, label: 'Y轴', description: '数值变量' },
      { role: 'series', types: ['string'], required: false, label: '系列(可选)', description: '分组维度', maxCount: 8 }
    ],
    defaults: { x: 'x', y: 'y' },
    maxSeries: 8,
    maxCategories: 100,
    suitableFor: ['相关性分析', '分布分析', '异常值检测'],
    styleSchema: [
      { key: 'symbolSize', label: '点大小', type: 'number', defaultValue: 6, min: 2, max: 20, step: 1, description: '散点大小' },
      { key: 'showSymbol', label: '显示标记', type: 'boolean', defaultValue: true, description: '是否显示散点标记' },
      { key: 'bubbleMode', label: '气泡模式', type: 'boolean', defaultValue: false, description: '是否启用气泡大小映射' }
    ]
  },
  {
    kind: 'pie',
    displayName: '饼图',
    description: '展示部分与整体的比例关系',
    icon: '🥧',
    roles: [
      { role: 'x', types: ['string'], required: true, label: '类别', description: '分类维度' },
      { role: 'value', types: ['number'], required: true, label: '值', description: '数值指标' }
    ],
    defaults: { x: 'x', value: 'y' },
    maxCategories: 12,
    suitableFor: ['占比分析', '构成分析', '简单分类'],
    styleSchema: [
      { key: 'showLabel', label: '显示标签', type: 'boolean', defaultValue: true, description: '是否显示数值标签' },
      { key: 'showPercent', label: '显示百分比', type: 'boolean', defaultValue: false, description: '是否显示百分比' },
      { key: 'roseType', label: '南丁格尔玫瑰图', type: 'boolean', defaultValue: false, description: '是否启用玫瑰图模式' }
    ]
  },
  {
    kind: 'radar',
    displayName: '雷达图',
    description: '展示多维度的数值对比',
    icon: '🕸️',
    roles: [
      { role: 'x', types: ['string'], required: true, label: '维度', description: '评估维度' },
      { role: 'value', types: ['number'], required: true, label: '值', description: '评估数值' },
      { role: 'series', types: ['string'], required: false, label: '系列(可选)', description: '对比对象', maxCount: 5 }
    ],
    defaults: { x: 'x', value: 'y' },
    maxSeries: 5,
    maxCategories: 15,
    suitableFor: ['多维度评估', '能力对比', '综合评价'],
    styleSchema: [
      { key: 'showArea', label: '显示区域', type: 'boolean', defaultValue: true, description: '是否显示填充区域' },
      { key: 'showLine', label: '显示线条', type: 'boolean', defaultValue: true, description: '是否显示连接线' },
      { key: 'radius', label: '图表半径', type: 'number', defaultValue: 0.7, min: 0.3, max: 0.9, step: 0.1, description: '雷达图半径比例' }
    ]
  }
];

// 验证映射函数
export const validateMapping = (
  spec: ChartSpec,
  mapping: Record<string, string>,
  fields: Field[]
): { ok: boolean; missing: Role[]; errors: string[] } => {
  const missing: Role[] = [];
  const errors: string[] = [];

  // 检查必需角色
  for (const roleRule of spec.roles) {
    if (roleRule.required && !mapping[roleRule.role]) {
      missing.push(roleRule.role);
      errors.push(`缺少必需字段: ${roleRule.label}`);
    }
  }

  // 检查字段类型匹配
  for (const [role, fieldKey] of Object.entries(mapping)) {
    if (!fieldKey) continue;
    
    const field = fields.find(f => f.key === fieldKey || f.name === fieldKey);
    if (!field) {
      errors.push(`字段不存在: ${fieldKey}`);
      continue;
    }

    const roleRule = spec.roles.find(r => r.role === role);
    if (roleRule && !roleRule.types.includes(field.type)) {
      errors.push(`${roleRule.label} 不支持 ${field.type} 类型字段`);
    }
  }

  return {
    ok: missing.length === 0 && errors.length === 0,
    missing,
    errors
  };
};

/**
 * 获取图表规范
 */
export const getChartSpec = (kind: ChartKind): ChartSpec | undefined => {
  return registry.find(chart => chart.kind === kind);
};

/**
 * 获取所有图表类型
 */
export const getAllChartKinds = (): ChartKind[] => {
  return registry.map(chart => chart.kind);
};

/**
 * 获取图表的角色规则
 */
export const getChartRoles = (kind: ChartKind): RoleRule[] => {
  const spec = getChartSpec(kind);
  return spec ? spec.roles : [];
};

/**
 * 获取图表的必需角色
 */
export const getRequiredRoles = (kind: ChartKind): Role[] => {
  const roles = getChartRoles(kind);
  return roles.filter(role => role.required).map(role => role.role);
};

/**
 * 获取角色支持的类型
 */
export const getRoleTypes = (kind: ChartKind, role: Role): FieldType[] => {
  const roles = getChartRoles(kind);
  const roleRule = roles.find(r => r.role === role);
  return roleRule ? roleRule.types : [];
};

/**
 * 检查字段是否适合某个角色
 */
export const isFieldSuitableForRole = (
  field: Field,
  kind: ChartKind,
  role: Role
): boolean => {
  const supportedTypes = getRoleTypes(kind, role);
  return supportedTypes.includes(field.type);
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
  registry.forEach(chart => {
    let score = 0;

    // 检查必需角色是否满足
    const requiredRoles = getRequiredRoles(chart.kind);
    let requiredSatisfied = true;

    for (const role of requiredRoles) {
      const roleTypes = getRoleTypes(chart.kind, role);
      const hasSuitableField = fields.some(field => roleTypes.includes(field.type));
      if (!hasSuitableField) {
        requiredSatisfied = false;
        break;
      }
    }

    if (!requiredSatisfied) return;

    // 根据图表类型计算得分
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
 * 检查数据集是否适合某种图表类型
 */
export const isDatasetSuitableForChart = (
  fields: Field[], 
  chartKind: ChartKind
): boolean => {
  const spec = getChartSpec(chartKind);
  if (!spec) return false;

  // 检查必需角色
  const requiredRoles = spec.roles.filter(role => role.required);
  
  for (const role of requiredRoles) {
    const hasSuitableField = fields.some(field => 
      role.types.includes(field.type)
    );
    if (!hasSuitableField) return false;
  }

  return true;
};

/**
 * 获取字段的角色建议
 */
export const getFieldRoleSuggestions = (
  field: Field,
  chartKind: ChartKind
): Role[] => {
  const roles = getChartRoles(chartKind);
  return roles
    .filter(role => role.types.includes(field.type))
    .map(role => role.role);
};

/**
 * 获取图表的默认字段映射
 */
export const getDefaultFieldMapping = (chartKind: ChartKind): Partial<Record<Role, string>> => {
  const spec = getChartSpec(chartKind);
  return spec?.defaults || {};
};

// 向后兼容的别名
export const chartRegistry = registry.reduce((acc, spec) => {
  acc[spec.kind] = spec;
  return acc;
}, {} as Record<ChartKind, ChartSpec>);
