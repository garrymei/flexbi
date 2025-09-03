import React, { useState } from 'react';
import { useChartConfigStore, useDatasetStore } from '@/store';
import { registry, getChartSpec, ChartKind } from '@/modules/charts/registry';
import ChartConfigurator from './ChartConfigurator';
import ChartPreview from './ChartPreview';

interface ChartGalleryProps {
  className?: string;
}

const ChartGallery: React.FC<ChartGalleryProps> = ({ className = '' }) => {
  const { charts, addChart, createDefaultChart } = useChartConfigStore();
  const { currentDataset } = useDatasetStore();
  const [selectedChartType, setSelectedChartType] = useState<ChartKind | null>(null);
  const [showConfigurator, setShowConfigurator] = useState(false);

  const handleCreateChart = () => {
    if (!currentDataset) {
      alert('请先选择数据集');
      return;
    }
    setShowConfigurator(true);
  };

  const handleChartTypeSelect = (chartType: ChartKind) => {
    setSelectedChartType(chartType);
    setShowConfigurator(true);
  };

  const handleCloseConfigurator = () => {
    setShowConfigurator(false);
    setSelectedChartType(null);
  };

  if (!currentDataset) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 mb-4">
          <div className="text-4xl mb-2">📊</div>
          <h3 className="text-lg font-medium mb-2">还没有选择数据集</h3>
          <p className="text-sm">请先上传或选择一个数据集来创建图表</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            图表库
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            为 "{currentDataset.name}" 创建可视化图表
          </p>
        </div>
        <button
          onClick={handleCreateChart}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          创建图表
        </button>
      </div>

      {/* 图表类型选择 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {registry.map((chartSpec) => (
          <button
            key={chartSpec.kind}
            onClick={() => handleChartTypeSelect(chartSpec.kind)}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800"
          >
            <div className="text-3xl mb-2">{chartSpec.icon}</div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-1">{chartSpec.displayName}</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">{chartSpec.description}</p>
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              需要字段: {chartSpec.roles.filter(r => r.required).map(r => r.label).join(', ')}
            </div>
          </button>
        ))}
      </div>

      {/* 现有图表列表 */}
      {charts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            已创建的图表 ({charts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {getChartSpec(chart.type)?.icon || '📊'}
                    </span>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">{chart.title}</h5>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getChartSpec(chart.type)?.displayName || chart.type}
                      </span>
                    </div>
                  </div>
                </div>

                <ChartPreview chart={chart} />

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    字段映射: {Object.keys(chart.mapping || {}).length} 个
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

      {/* 图表配置器 */}
      {showConfigurator && selectedChartType && (
        <ChartConfigurator
          chartType={selectedChartType}
          onCreateChart={(title, mapping, style) => {
            if (selectedChartType) {
              const newChart = createDefaultChart(selectedChartType, title, mapping, style);
              addChart(newChart);
              handleCloseConfigurator();
            }
          }}
          onCancel={handleCloseConfigurator}
        />
      )}
    </div>
  );
};

export default ChartGallery;
