import React from 'react';
import { useUIStore } from '@/store';
import { useDatasetStore } from '@/store';

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { currentDataset } = useDatasetStore();

  const menuItems = [
    {
      id: 'data',
      label: '数据管理',
      icon: '📊',
      description: '导入、查看和管理数据',
      active: true,
    },
    {
      id: 'charts',
      label: '图表制作',
      icon: '📈',
      description: '创建和配置图表',
      active: !!currentDataset,
    },
    {
      id: 'templates',
      label: '模板库',
      icon: '📋',
      description: '保存和复用图表模板',
      active: false,
    },
    {
      id: 'export',
      label: '导出分享',
      icon: '📤',
      description: '导出图表和报表',
      active: !!currentDataset,
    },
  ];

  return (
    <>
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 侧边栏头部 */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">功能导航</h2>
            <p className="text-sm text-gray-500 mt-1">选择要使用的功能</p>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  item.active
                    ? 'border-primary-200 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                } ${!item.active && 'opacity-60 cursor-not-allowed'}`}
                disabled={!item.active}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </nav>

          {/* 侧边栏底部 */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-400">
                {currentDataset ? (
                  <>
                    当前数据集: <span className="font-medium">{currentDataset.name}</span>
                    <br />
                    {currentDataset.rowCount.toLocaleString()} 行数据
                  </>
                ) : (
                  '请先导入数据'
                )}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
