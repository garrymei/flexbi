import React from 'react';
import { useDatasetStore } from '@/store';
import DataUploader from '@/modules/dataset/components/DataUploader';
import DataTable from '@/modules/dataset/components/DataTable';
import ChartGallery from '@/modules/charts/components/ChartGallery';
import EmptyState from '@/components/ui/EmptyState';

const MainContent: React.FC = () => {
  const { currentDataset, isLoading } = useDatasetStore();

  if (isLoading) {
    return (
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500">正在处理数据...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!currentDataset) {
    return (
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        <EmptyState
          icon="📊"
          title="欢迎使用 FlexBI"
          description="开始您的数据可视化之旅，请先导入数据文件"
          action={
            <div className="mt-6">
              <DataUploader />
            </div>
          }
        />
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto bg-gray-50">
      {/* 数据集信息 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{currentDataset.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentDataset.fields.length} 个字段，{currentDataset.rowCount.toLocaleString()} 行数据
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              最后更新: {currentDataset.updatedAt.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 数据预览 */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">数据预览</h3>
                <p className="text-sm text-gray-500 mt-1">查看数据结构和内容</p>
              </div>
              <div className="card-body">
                <DataTable />
              </div>
            </div>
          </div>

          {/* 图表制作 */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">图表制作</h3>
                <p className="text-sm text-gray-500 mt-1">选择图表类型并配置字段映射</p>
              </div>
              <div className="card-body">
                <ChartGallery />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
