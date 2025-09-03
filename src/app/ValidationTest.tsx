import React, { useState } from 'react';
import { useDatasetStore, useChartConfigStore } from '@/store';
import { ChartKind, Mapping } from '@/app/types';
import { getAllSampleData, getSampleDataByName } from '@/modules/samples/validationData';
import { getAllChartKinds, suggestChartsForDataset } from '@/modules/charts/registry';
import DataUploader from '@/modules/dataset/components/DataUploader';
import DataTable from '@/modules/dataset/components/DataTable';
import ChartConfigurator from '@/modules/charts/components/ChartConfigurator';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

const ValidationTest: React.FC = () => {
  const { currentDataset, setDataset } = useDatasetStore();
  const { charts, addChart, createDefaultChart } = useChartConfigStore();
  
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<ChartKind | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'sample' | 'charts'>('upload');

  // 加载示例数据
  const loadSampleData = (datasetName: string) => {
    const sampleData = getSampleDataByName(datasetName);
    if (sampleData) {
      setDataset(sampleData);
      setActiveTab('charts');
    }
  };

  // 创建图表
  const handleCreateChart = (title: string, mapping: Mapping, style?: Record<string, any>) => {
    if (selectedChartType && currentDataset) {
      const chart = createDefaultChart(selectedChartType, title, mapping, style);
      addChart(chart);
      setShowChartModal(false);
      setSelectedChartType(null);
    }
  };

  // 获取推荐图表
  const getRecommendedCharts = () => {
    if (!currentDataset) return [];
    return suggestChartsForDataset(currentDataset.fields);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FlexBI MVP-1 验收测试</h1>
              <p className="text-sm text-gray-600">验证数据导入、图表配置、预览渲染和导出功能</p>
            </div>
            <div className="text-sm text-gray-500">
              版本: 0.1.0 | 目标: MVP-1 本地闭环
            </div>
          </div>
        </div>
      </header>

      {/* 标签页导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              数据上传
            </button>
            <button
              onClick={() => setActiveTab('sample')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sample'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              示例数据
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'charts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              图表配置
            </button>
          </nav>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 数据上传标签页 */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">数据上传</h2>
              <p className="text-sm text-gray-600 mb-4">
                支持 CSV 和 Excel 文件上传，系统将自动识别字段类型
              </p>
              <DataUploader />
            </div>
            
            {currentDataset && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">数据预览</h3>
                <DataTable />
              </div>
            )}
          </div>
        )}

        {/* 示例数据标签页 */}
        {activeTab === 'sample' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">验收用示例数据</h2>
              <p className="text-sm text-gray-600 mb-6">
                点击下方按钮加载对应的示例数据，用于验证不同图表类型的渲染效果
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getAllSampleData().map((dataset) => (
                  <div key={dataset.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900 mb-2">{dataset.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      字段: {dataset.fields.map(f => `${f.key}(${f.type})`).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      行数: {dataset.rows.length}
                    </p>
                    <Button
                      onClick={() => loadSampleData(dataset.name)}
                      className="w-full"
                    >
                      加载数据
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 图表配置标签页 */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            {!currentDataset ? (
              <EmptyState
                title="暂无数据"
                description="请先上传数据或加载示例数据"
                action={
                  <Button onClick={() => setActiveTab('upload')}>
                    去上传数据
                  </Button>
                }
              />
            ) : (
              <>
                {/* 数据集信息 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">当前数据集</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">名称:</span>
                      <p className="text-sm text-gray-900">{currentDataset.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">字段数:</span>
                      <p className="text-sm text-gray-900">{currentDataset.fields.length}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">行数:</span>
                      <p className="text-sm text-gray-900">{currentDataset.rows.length}</p>
                    </div>
                  </div>
                </div>

                {/* 推荐图表 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">推荐图表类型</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {getRecommendedCharts().map((chartKind) => (
                      <button
                        key={chartKind}
                        onClick={() => {
                          setSelectedChartType(chartKind);
                          setShowChartModal(true);
                        }}
                        className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        <div className="text-2xl mb-2">
                          {getAllChartKinds().find(k => k === chartKind) === 'line' ? '📈' :
                           getAllChartKinds().find(k => k === chartKind) === 'bar' ? '📊' :
                           getAllChartKinds().find(k => k === chartKind) === 'pie' ? '🥧' :
                           getAllChartKinds().find(k => k === chartKind) === 'scatter' ? '🔵' :
                           getAllChartKinds().find(k => k === chartKind) === 'area' ? '🟦' :
                           getAllChartKinds().find(k => k === chartKind) === 'radar' ? '🕸️' : '📊'}
                        </div>
                        <div className="text-sm font-medium text-gray-900 capitalize">{chartKind}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 所有图表类型 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">所有图表类型</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {getAllChartKinds().map((chartKind) => (
                      <button
                        key={chartKind}
                        onClick={() => {
                          setSelectedChartType(chartKind);
                          setShowChartModal(true);
                        }}
                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-2xl mb-2">
                          {chartKind === 'line' ? '📈' :
                           chartKind === 'bar' ? '📊' :
                           chartKind === 'pie' ? '🥧' :
                           chartKind === 'scatter' ? '🔵' :
                           chartKind === 'area' ? '🟦' :
                           chartKind === 'radar' ? '🕸️' : '📊'}
                        </div>
                        <div className="text-sm font-medium text-gray-900 capitalize">{chartKind}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 已创建的图表 */}
                {charts.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">已创建的图表</h3>
                    <div className="space-y-3">
                      {charts.map((chart, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {chart.style?.title || `图表 ${index + 1}`}
                            </span>
                            <span className="ml-2 text-xs text-gray-500 capitalize">
                              ({chart.type})
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            映射: {Object.entries(chart.mapping).map(([k, v]) => `${k}:${v}`).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* 图表配置模态框 */}
      <Modal
        isOpen={showChartModal}
        onClose={() => {
          setShowChartModal(false);
          setSelectedChartType(null);
        }}
        title="配置图表"
      >
        {selectedChartType && (
          <ChartConfigurator
            chartType={selectedChartType}
            onCreateChart={handleCreateChart}
            onCancel={() => {
              setShowChartModal(false);
              setSelectedChartType(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default ValidationTest;
