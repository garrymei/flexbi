import React, { useState } from 'react';
import { useChartConfigStore, useDatasetStore } from '@/store';
import { ChartType, CHART_TYPES } from '@/app/config';
import ChartConfigurator from './ChartConfigurator';
import ChartPreview from './ChartPreview';

const ChartGallery: React.FC = () => {
  const { charts, addChart, createDefaultChart } = useChartConfigStore();
  const { currentDataset } = useDatasetStore();
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);
  const [showConfigurator, setShowConfigurator] = useState(false);

  if (!currentDataset) {
    return (
      <div className="text-center py-8 text-gray-500">
        请先导入数据以创建图表
      </div>
    );
  }

  const handleChartTypeSelect = (chartType: ChartType) => {
    setSelectedChartType(chartType);
    setShowConfigurator(true);
  };

  const handleCreateChart = (title: string) => {
    if (selectedChartType) {
      const newChart = createDefaultChart(selectedChartType, title);
      addChart(newChart);
      setShowConfigurator(false);
      setSelectedChartType(null);
    }
  };

  const handleCancel = () => {
    setShowConfigurator(false);
    setSelectedChartType(null);
  };

  return (
    <div className="space-y-6">
      {/* 图表类型选择 */}
      {!showConfigurator && (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">选择图表类型</h4>
            <p className="text-sm text-gray-500">
              根据您的数据选择合适的图表类型来展示数据
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(CHART_TYPES).map(([type, config]) => (
              <button
                key={type}
                onClick={() => handleChartTypeSelect(type as ChartType)}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
              >
                <div className="text-3xl mb-2">{config.icon}</div>
                <h5 className="font-medium text-gray-900 mb-1">{config.name}</h5>
                <p className="text-sm text-gray-500">{config.description}</p>
                <div className="mt-2 text-xs text-gray-400">
                  需要字段: {config.requiredFields.join(', ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 图表配置器 */}
      {showConfigurator && selectedChartType && (
        <ChartConfigurator
          chartType={selectedChartType}
          onCreateChart={handleCreateChart}
          onCancel={handleCancel}
        />
      )}

      {/* 已创建的图表 */}
      {charts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">已创建的图表</h4>
            <span className="text-sm text-gray-500">
              {charts.length} 个图表
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {charts.map((chart) => (
              <div key={chart.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{chart.title}</h5>
                  <span className="text-xs text-gray-500">
                    {CHART_TYPES[chart.type]?.name}
                  </span>
                </div>
                
                <ChartPreview chart={chart} />
                
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    字段映射: {Object.keys(chart.fieldMapping).length} 个
                  </span>
                  <span>
                    创建时间: {chart.id.split('_')[1] ? new Date(parseInt(chart.id.split('_')[1])).toLocaleTimeString() : '未知'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartGallery;
