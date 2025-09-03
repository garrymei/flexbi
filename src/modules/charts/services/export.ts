import { saveAs } from 'file-saver';
import { Field, DataRow, Mapping } from '@/app/types';
import { ChartKind } from '../registry';
import { toEChartsOption } from '../adapters/echarts/toOption';
import { applyTransforms } from '@/modules/transforms';

export interface ExportOptions {
  format: 'png' | 'svg';
  filename?: string;
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * 导出图表为图片
 */
export const exportChart = async (
  chartRef: any, // ECharts实例引用
  fields: Field[],
  rows: DataRow[],
  chartKind: ChartKind,
  mapping: Mapping,
  style?: any,
  transform?: any,
  options: ExportOptions = { format: 'png' }
): Promise<void> => {
  try {
    const { format, filename, width = 800, height = 600, quality = 1 } = options;
    
    if (!chartRef || !chartRef.getDataURL) {
      throw new Error('无效的图表引用');
    }

    // 生成文件名
    const defaultFilename = `chart_${Date.now()}`;
    const finalFilename = filename || defaultFilename;

    // 先应用数据变换
    const rows2 = applyTransforms(rows, transform);

    // 获取ECharts配置
    const option = toEChartsOption(fields, rows2, {
      id: 'export_temp',
      type: chartKind,
      title: filename || '导出图表',
      subtitle: '',
      mapping,
      style: style || {},
    } as any);

    chartRef.setOption(option, true);

    // 设置图表尺寸
    chartRef.resize({ width, height });

    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 100));

    // 导出图片
    const dataURL = chartRef.getDataURL({
      type: format,
      pixelRatio: quality,
      backgroundColor: '#ffffff'
    });

    // 下载文件
    if (format === 'png') {
      downloadAsPNG(dataURL, `${finalFilename}.png`);
    } else if (format === 'svg') {
      downloadAsSVG(dataURL, `${finalFilename}.svg`);
    }

  } catch (error) {
    console.error('图表导出失败:', error);
    throw new Error(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

/**
 * 解耦导出：直接从已渲染实例导出为图片
 */
export async function exportImage(
  getInstance: () => any | null,
  type: 'png' | 'svg' = 'png',
  opts: { filename?: string; pixelRatio?: number } = {}
): Promise<void> {
  const inst = getInstance();
  if (!inst || typeof inst.getDataURL !== 'function') {
    throw new Error('ECharts 实例不可用');
  }

  const filename = opts.filename || `chart_${Date.now()}.${type}`;
  const dataURL = inst.getDataURL({
    type,
    pixelRatio: opts.pixelRatio ?? 1,
    backgroundColor: '#ffffff',
  });

  if (type === 'png') {
    const base64Data = dataURL.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    saveAs(blob, filename);
  } else {
    const svgContent = decodeURIComponent(dataURL.split(',')[1]);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    saveAs(blob, filename);
  }
}

/**
 * 下载PNG图片
 */
const downloadAsPNG = (dataURL: string, filename: string): void => {
  // 将base64转换为blob
  const base64Data = dataURL.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  
  // 使用file-saver下载
  saveAs(blob, filename);
};

/**
 * 下载SVG图片
 */
const downloadAsSVG = (dataURL: string, filename: string): void => {
  // SVG格式的dataURL直接包含SVG内容
  const svgContent = decodeURIComponent(dataURL.split(',')[1]);
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  
  saveAs(blob, filename);
};

/**
 * 批量导出多个图表
 */
export const exportMultipleCharts = async (
  charts: Array<{
    ref: any;
    fields: Field[];
    rows: DataRow[];
    kind: ChartKind;
    mapping: Mapping;
    style?: any;
    transform?: any;
    name: string;
  }>,
  options: ExportOptions
): Promise<void> => {
  const exportPromises = charts.map(async (chart, index) => {
    try {
      await exportChart(
        chart.ref,
        chart.fields,
        chart.rows,
        chart.kind,
        chart.mapping,
        chart.style,
        chart.transform,
        {
          ...options,
          filename: `${chart.name}_${index + 1}`
        }
      );
    } catch (error) {
      console.error(`导出图表 ${chart.name} 失败:`, error);
    }
  });

  await Promise.all(exportPromises);
};

/**
 * 导出为ZIP包（多个图表）
 */
export const exportAsZip = async (
  charts: Array<{
    ref: any;
    fields: Field[];
    rows: DataRow[];
    kind: ChartKind;
    mapping: Mapping;
    style?: any;
    name: string;
  }>,
  options: ExportOptions
): Promise<void> => {
  // 注意：这里需要额外的JSZip库支持
  // 暂时使用单独导出的方式
  console.warn('ZIP导出功能需要JSZip库支持，暂时使用单独导出');
  await exportMultipleCharts(charts, options);
};

/**
 * 获取图表预览URL（用于预览）
 */
export const getChartPreviewURL = (
  chartRef: any,
  format: 'png' | 'svg' = 'png',
  quality: number = 1
): string | null => {
  try {
    if (!chartRef || !chartRef.getDataURL) {
      return null;
    }

    return chartRef.getDataURL({
      type: format,
      pixelRatio: quality,
      backgroundColor: '#ffffff'
    });
  } catch (error) {
    console.error('获取预览URL失败:', error);
    return null;
  }
};

/**
 * 复制图表到剪贴板
 */
export const copyChartToClipboard = async (
  chartRef: any,
  format: 'png' | 'svg' = 'png'
): Promise<boolean> => {
  try {
    if (!navigator.clipboard) {
      throw new Error('剪贴板API不支持');
    }

    const dataURL = getChartPreviewURL(chartRef, format);
    if (!dataURL) {
      throw new Error('无法获取图表数据');
    }

    // 将dataURL转换为blob
    const response = await fetch(dataURL);
    const blob = await response.blob();

    // 复制到剪贴板
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);

    return true;
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    return false;
  }
};
