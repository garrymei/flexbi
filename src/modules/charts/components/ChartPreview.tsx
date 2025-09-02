import React from 'react';
import { ChartConfig } from '@/app/types';
import { CHART_TYPES } from '@/app/config';

interface ChartPreviewProps {
  chart: ChartConfig;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({ chart }) => {
  const chartConfig = CHART_TYPES[chart.type];

  // 检查图表是否配置完整
  const isConfigured = () => {
    const requiredFields = chartConfig.requiredFields;
    return requiredFields.every(field => chart.fieldMapping[field]);
  };

  if (!isConfigured()) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-2xl mb-2">{chartConfig.icon}</div>
          <p className="text-sm text-gray-500">图表配置不完整</p>
          <p className="text-xs text-gray-400 mt-1">
            需要配置: {chartConfig.requiredFields.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 图表预览区域 */}
      <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">{chartConfig.icon}</div>
          <h6 className="font-medium text-gray-900 mb-1">{chart.title}</h6>
          <p className="text-sm text-gray-500">{chartConfig.name}</p>
          <div className="mt-2 text-xs text-gray-400">
            字段映射: {Object.keys(chart.fieldMapping).length} 个
          </div>
        </div>
      </div>

      {/* 字段映射信息 */}
      <div className="space-y-2">
        <h6 className="text-sm font-medium text-gray-700">字段映射</h6>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(chart.fieldMapping).map(([role, fieldId]) => (
            <div key={role} className="flex justify-between">
              <span className="text-gray-500">{role}:</span>
              <span className="text-gray-900 font-medium">{fieldId}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <button className="btn btn-outline btn-sm flex-1">
          编辑配置
        </button>
        <button className="btn btn-primary btn-sm flex-1">
          导出图表
        </button>
      </div>
    </div>
  );
};

export default ChartPreview;
