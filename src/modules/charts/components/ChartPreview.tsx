import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChartConfig } from '@/app/types';
import { getChartSpec, getRequiredRoles } from '@/modules/charts/registry';
import { toEChartsOption } from '@/modules/charts/adapters/echarts/toOption';
import { applyTransforms } from '@/modules/transforms';
import { useDatasetStore } from '@/store';
import ReactECharts from 'echarts-for-react';
import { exportImage } from '@/modules/charts/services/export';
import { validateMapping, getChartSpec as getSpec } from '@/modules/charts/registry';
import { getLastMeta } from '@/modules/charts/adapters/echarts/toOption/data';

interface ChartPreviewProps {
  chart: ChartConfig;
  onReady?: (utils: { getInstance: () => any | null }) => void;
  showExportControls?: boolean;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({ chart, onReady, showExportControls = true }) => {
  const { currentDataset } = useDatasetStore();
  const chartSpec = getChartSpec(chart.type);
  
  if (!chartSpec || !currentDataset) return null;

  const requiredRoles = getRequiredRoles(chart.type);

  const isConfigured = () => {
    return requiredRoles.every(role => {
      const mapping = chart.mapping as Record<string, string>;
      return mapping?.[role];
    });
  };

  const getFieldMappingText = () => {
    if (!chart.mapping) return '未配置字段映射';
    
    const mappings = Object.entries(chart.mapping)
      .filter(([, value]) => value)
      .map(([role, field]) => `${role}: ${field}`)
      .join(', ');
    
    return mappings || '未配置字段映射';
  };

  // 生成ECharts选项
  const echartsOption = useMemo(() => {
    if (!isConfigured() || !currentDataset) return null;
    try {
      const rows2 = applyTransforms(currentDataset.rows, chart.transform);
      return toEChartsOption(currentDataset.fields, rows2, chart);
    } catch (error) {
      console.error('生成图表选项失败:', error);
      return null;
    }
  }, [chart, currentDataset]);

  const ignoredInfo = useMemo(() => getLastMeta(), [echartsOption]);

  // 实例获取器
  const echartsRef = useRef<any>(null);
  const getInstance = () => echartsRef.current?.getEchartsInstance?.() || null;

  // 向上暴露实例获取器
  useEffect(() => {
    if (onReady) {
      onReady({ getInstance });
    }
  }, [onReady]);

  // 导出前校验
  const canExport = useMemo(() => {
    if (!currentDataset) return false;
    const spec = getSpec(chart.type);
    if (!spec) return false;
    const validation = validateMapping(spec, chart.mapping as any, currentDataset.fields);
    return validation.ok;
  }, [chart, currentDataset]);

  const [exportName, setExportName] = useState<string>(chart.title || 'chart');

  if (!isConfigured()) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-2xl mb-2">⚠️</div>
        <p className="text-sm">图表配置不完整</p>
        <p className="text-xs mt-1">{getFieldMappingText()}</p>
      </div>
    );
  }

  if (!echartsOption) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-2xl mb-2">❌</div>
        <p className="text-sm">图表渲染失败</p>
        <p className="text-xs mt-1">请检查数据格式</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 图表预览区域 */}
      <div className="bg-white rounded-lg border border-gray-200 min-h-[300px] dark:bg-gray-800 dark:border-gray-700">
        {showExportControls && (
          <div className="flex items-center justify-end p-2 space-x-2">
            <input
              type="text"
              value={exportName}
              onChange={(e) => setExportName(e.target.value)}
              className="px-2 py-1 text-xs border rounded"
              placeholder="文件名"
            />
            <button
              className={`px-2 py-1 text-xs rounded ${canExport ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              disabled={!canExport}
              onClick={() => exportImage(getInstance, 'png', { filename: exportName || 'chart', pixelRatio: 2 })}
              title={canExport ? '导出为 PNG' : '配置不完整，无法导出'}
            >导出PNG</button>
            <button
              className={`px-2 py-1 text-xs rounded ${canExport ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              disabled={!canExport}
              onClick={() => exportImage(getInstance, 'svg', { filename: exportName || 'chart' })}
              title={canExport ? '导出为 SVG' : '配置不完整，无法导出'}
            >导出SVG</button>
          </div>
        )}
        <ReactECharts
          ref={echartsRef}
          option={echartsOption}
          style={{ height: '300px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* 字段映射信息 */}
      {chart.mapping && Object.entries(chart.mapping).map(([role, field]) => (
        <div key={role} className="flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize">{role}:</span>
          <span>{field}</span>
        </div>
      ))}

      {ignoredInfo.ignored > 0 && (
        <div className="text-xs text-amber-600">已忽略 {ignoredInfo.ignored} 条无效记录（空/非数值）</div>
      )}
    </div>
  );
};

export default ChartPreview;
