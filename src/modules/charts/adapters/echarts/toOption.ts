import { Field, DataRow } from '@/app/types';
import { ChartKind } from '../../registry';
import { getDefaultColors } from './colors';

export interface FieldMapping {
  x?: string;
  y?: string;
  series?: string;
  category?: string;
  value?: string;
  dimension?: string;
}

export interface ChartStyle {
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  showDataLabels?: boolean;
  colorScheme?: string;
  gridMargin?: number;
}

export interface ChartConfig {
  kind: ChartKind;
  mapping: FieldMapping;
  style?: ChartStyle;
}

/**
 * 将数据集和配置转换为ECharts配置
 */
export const toEChartsOption = (
  fields: Field[],
  rows: DataRow[],
  config: ChartConfig
): any => {
  const { kind, mapping, style } = config;
  
  switch (kind) {
    case ChartKind.LINE:
      return createLineChartOption(fields, rows, mapping, style);
    case ChartKind.BAR:
      return createBarChartOption(fields, rows, mapping, style);
    case ChartKind.AREA:
      return createAreaChartOption(fields, rows, mapping, style);
    case ChartKind.SCATTER:
      return createScatterChartOption(fields, rows, mapping, style);
    case ChartKind.PIE:
      return createPieChartOption(fields, rows, mapping, style);
    case ChartKind.RADAR:
      return createRadarChartOption(fields, rows, mapping, style);
    default:
      throw new Error(`不支持的图表类型: ${kind}`);
  }
};

/**
 * 创建折线图配置
 */
const createLineChartOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: FieldMapping,
  style?: ChartStyle
): any => {
  const { x, y, series } = mapping;
  if (!x || !y) throw new Error('折线图需要x和y字段');

  const colors = getDefaultColors();
  const processedData = processDataForChart(rows, x, y, series);
  
  return {
    title: {
      text: style?.title || '折线图',
      subtext: style?.subtitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: style?.showLegend !== false,
      top: 30
    },
    grid: {
      left: style?.gridMargin || 60,
      right: style?.gridMargin || 60,
      top: style?.showLegend !== false ? 80 : 60,
      bottom: style?.gridMargin || 60
    },
    xAxis: {
      type: getAxisType(fields.find(f => f.name === x)?.type),
      data: processedData.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: processedData.series.map((s, index) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      color: colors[index % colors.length],
      label: {
        show: style?.showDataLabels || false
      }
    }))
  };
};

/**
 * 创建柱状图配置
 */
const createBarChartOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: FieldMapping,
  style?: ChartStyle
): any => {
  const { x, y, series } = mapping;
  if (!x || !y) throw new Error('柱状图需要x和y字段');

  const colors = getDefaultColors();
  const processedData = processDataForChart(rows, x, y, series);
  
  return {
    title: {
      text: style?.title || '柱状图',
      subtext: style?.subtitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: style?.showLegend !== false,
      top: 30
    },
    grid: {
      left: style?.gridMargin || 60,
      right: style?.gridMargin || 60,
      top: style?.showLegend !== false ? 80 : 60,
      bottom: style?.gridMargin || 60
    },
    xAxis: {
      type: 'category',
      data: processedData.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: processedData.series.map((s, index) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      color: colors[index % colors.length],
      label: {
        show: style?.showDataLabels || false
      }
    }))
  };
};

/**
 * 创建面积图配置
 */
const createAreaChartOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: FieldMapping,
  style?: ChartStyle
): any => {
  const { x, y, series } = mapping;
  if (!x || !y) throw new Error('面积图需要x和y字段');

  const colors = getDefaultColors();
  const processedData = processDataForChart(rows, x, y, series);
  
  return {
    title: {
      text: style?.title || '面积图',
      subtext: style?.subtitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: style?.showLegend !== false,
      top: 30
    },
    grid: {
      left: style?.gridMargin || 60,
      right: style?.gridMargin || 60,
      top: style?.showLegend !== false ? 80 : 60,
      bottom: style?.gridMargin || 60
    },
    xAxis: {
      type: getAxisType(fields.find(f => f.name === x)?.type),
      data: processedData.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: processedData.series.map((s, index) => ({
      name: s.name,
      type: 'line',
      areaStyle: {},
      data: s.data,
      color: colors[index % colors.length],
      label: {
        show: style?.showDataLabels || false
      }
    }))
  };
};

/**
 * 创建散点图配置
 */
const createScatterChartOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: FieldMapping,
  style?: ChartStyle
): any => {
  const { x, y, series } = mapping;
  if (!x || !y) throw new Error('散点图需要x和y字段');

  const colors = getDefaultColors();
  const processedData = processDataForScatter(rows, x, y, series);
  
  return {
    title: {
      text: style?.title || '散点图',
      subtext: style?.subtitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.seriesName}<br/>${x}: ${params.data[0]}<br/>${y}: ${params.data[1]}`;
      }
    },
    legend: {
      show: style?.showLegend !== false,
      top: 30
    },
    grid: {
      left: style?.gridMargin || 60,
      right: style?.gridMargin || 60,
      top: style?.showLegend !== false ? 80 : 60,
      bottom: style?.gridMargin || 60
    },
    xAxis: {
      type: 'value',
      name: x
    },
    yAxis: {
      type: 'value',
      name: y
    },
    series: processedData.series.map((s, index) => ({
      name: s.name,
      type: 'scatter',
      data: s.data,
      color: colors[index % colors.length],
      symbolSize: 8
    }))
  };
};

/**
 * 创建饼图配置
 */
const createPieChartOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: FieldMapping,
  style?: ChartStyle
): any => {
  const { category, value } = mapping;
  if (!category || !value) throw new Error('饼图需要category和value字段');

  const colors = getDefaultColors();
  const processedData = processDataForPie(rows, category, value);
  
  return {
    title: {
      text: style?.title || '饼图',
      subtext: style?.subtitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: style?.showLegend !== false,
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [{
      name: category,
      type: 'pie',
      radius: '50%',
      data: processedData.map((item, index) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: colors[index % colors.length]
        }
      })),
      label: {
        show: style?.showDataLabels || false,
        formatter: '{b}: {c} ({d}%)'
      }
    }]
  };
};

/**
 * 创建雷达图配置
 */
const createRadarChartOption = (
  fields: Field[],
  rows: DataRow[],
  mapping: FieldMapping,
  style?: ChartStyle
): any => {
  const { dimension, value, series } = mapping;
  if (!dimension || !value) throw new Error('雷达图需要dimension和value字段');

  const colors = getDefaultColors();
  const processedData = processDataForRadar(rows, dimension, value, series);
  
  return {
    title: {
      text: style?.title || '雷达图',
      subtext: style?.subtitle,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: style?.showLegend !== false,
      top: 30
    },
    radar: {
      indicator: processedData.indicators
    },
    series: [{
      name: '数据',
      type: 'radar',
      data: processedData.series.map((s, index) => ({
        name: s.name,
        value: s.data,
        itemStyle: {
          color: colors[index % colors.length]
        }
      }))
    }]
  };
};

/**
 * 处理数据用于线图、柱状图、面积图
 */
const processDataForChart = (
  rows: DataRow[],
  xField: string,
  yField: string,
  seriesField?: string
) => {
  if (seriesField) {
    // 有系列字段，按系列分组
    const seriesMap = new Map<string, Map<string, number>>();
    const xValues = new Set<string>();
    
    rows.forEach(row => {
      const xValue = String(row[xField] || '');
      const yValue = Number(row[yField]) || 0;
      const seriesValue = String(row[seriesField] || '默认');
      
      xValues.add(xValue);
      
      if (!seriesMap.has(seriesValue)) {
        seriesMap.set(seriesValue, new Map());
      }
      seriesMap.get(seriesValue)!.set(xValue, yValue);
    });
    
    const xAxisData = Array.from(xValues).sort();
    const series = Array.from(seriesMap.entries()).map(([name, dataMap]) => ({
      name,
      data: xAxisData.map(x => dataMap.get(x) || 0)
    }));
    
    return { xAxisData, series };
  } else {
    // 无系列字段，简单聚合
    const dataMap = new Map<string, number>();
    
    rows.forEach(row => {
      const xValue = String(row[xField] || '');
      const yValue = Number(row[yField]) || 0;
      dataMap.set(xValue, (dataMap.get(xValue) || 0) + yValue);
    });
    
    const xAxisData = Array.from(dataMap.keys()).sort();
    const series = [{
      name: yField,
      data: xAxisData.map(x => dataMap.get(x) || 0)
    }];
    
    return { xAxisData, series };
  }
};

/**
 * 处理数据用于散点图
 */
const processDataForScatter = (
  rows: DataRow[],
  xField: string,
  yField: string,
  seriesField?: string
) => {
  if (seriesField) {
    // 有系列字段，按系列分组
    const seriesMap = new Map<string, Array<[number, number]>>();
    
    rows.forEach(row => {
      const xValue = Number(row[xField]);
      const yValue = Number(row[yField]);
      const seriesValue = String(row[seriesField] || '默认');
      
      if (!isNaN(xValue) && !isNaN(yValue)) {
        if (!seriesMap.has(seriesValue)) {
          seriesMap.set(seriesValue, []);
        }
        seriesMap.get(seriesValue)!.push([xValue, yValue]);
      }
    });
    
    const series = Array.from(seriesMap.entries()).map(([name, data]) => ({
      name,
      data
    }));
    
    return { series };
  } else {
    // 无系列字段
    const data = rows
      .map(row => {
        const xValue = Number(row[xField]);
        const yValue = Number(row[yField]);
        return !isNaN(xValue) && !isNaN(yValue) ? [xValue, yValue] : null;
      })
      .filter(Boolean) as Array<[number, number]>;
    
    return {
      series: [{
        name: '数据',
        data
      }]
    };
  }
};

/**
 * 处理数据用于饼图
 */
const processDataForPie = (
  rows: DataRow[],
  categoryField: string,
  valueField: string
) => {
  const dataMap = new Map<string, number>();
  
  rows.forEach(row => {
    const category = String(row[categoryField] || '其他');
    const value = Number(row[valueField]) || 0;
    dataMap.set(category, (dataMap.get(category) || 0) + value);
  });
  
  return Array.from(dataMap.entries()).map(([name, value]) => ({
    name,
    value
  }));
};

/**
 * 处理数据用于雷达图
 */
const processDataForRadar = (
  rows: DataRow[],
  dimensionField: string,
  valueField: string,
  seriesField?: string
) => {
  if (seriesField) {
    // 有系列字段，按系列分组
    const seriesMap = new Map<string, Map<string, number>>();
    const dimensions = new Set<string>();
    
    rows.forEach(row => {
      const dimension = String(row[dimensionField] || '');
      const value = Number(row[valueField]) || 0;
      const seriesValue = String(row[seriesField] || '默认');
      
      dimensions.add(dimension);
      
      if (!seriesMap.has(seriesValue)) {
        seriesMap.set(seriesValue, new Map());
      }
      seriesMap.get(seriesValue)!.set(dimension, value);
    });
    
    const indicators = Array.from(dimensions).map(name => ({ name, max: 100 }));
    const series = Array.from(seriesMap.entries()).map(([name, dataMap]) => ({
      name,
      data: indicators.map(indicator => dataMap.get(indicator.name) || 0)
    }));
    
    return { indicators, series };
  } else {
    // 无系列字段
    const dataMap = new Map<string, number>();
    
    rows.forEach(row => {
      const dimension = String(row[dimensionField] || '');
      const value = Number(row[valueField]) || 0;
      dataMap.set(dimension, (dataMap.get(dimension) || 0) + value);
    });
    
    const indicators = Array.from(dataMap.keys()).map(name => ({ name, max: 100 }));
    const series = [{
      name: '数据',
      data: indicators.map(indicator => dataMap.get(indicator.name) || 0)
    }];
    
    return { indicators, series };
  }
};

/**
 * 获取坐标轴类型
 */
const getAxisType = (fieldType?: string): 'category' | 'time' | 'value' => {
  switch (fieldType) {
    case 'date':
      return 'time';
    case 'number':
      return 'value';
    default:
      return 'category';
  }
};

