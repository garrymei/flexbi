import React, { useState } from 'react';
import { useDatasetStore } from '@/store';
import { CONFIG } from '@/app/config';

const DataTable: React.FC = () => {
  const { currentDataset } = useDatasetStore();
  const [showAllRows, setShowAllRows] = useState(false);

  if (!currentDataset) {
    return (
      <div className="text-center py-8 text-gray-500">
        没有可显示的数据
      </div>
    );
  }

  const displayRows = showAllRows 
    ? currentDataset.rows.slice(0, CONFIG.MAX_ROWS_PREVIEW)
    : currentDataset.rows.slice(0, 100); // 默认显示前100行

  const hasMoreRows = currentDataset.rows.length > displayRows.length;

  return (
    <div className="space-y-4">
      {/* 字段信息 */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">字段信息</h4>
        <div className="grid grid-cols-1 gap-2">
          {currentDataset.fields.map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">{field.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  field.type === 'number' ? 'bg-blue-100 text-blue-800' :
                  field.type === 'date' ? 'bg-green-100 text-green-800' :
                  field.type === 'boolean' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {field.type}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {field.uniqueValues} 个唯一值
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 数据预览 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">数据预览</h4>
          <span className="text-sm text-gray-500">
            显示 {displayRows.length} / {currentDataset.rows.length} 行
          </span>
        </div>
        
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {currentDataset.fields.map((field) => (
                  <th
                    key={field.id}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex flex-col">
                      <span>{field.name}</span>
                      <span className="text-xs text-gray-400 font-normal">
                        {field.type}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate"
                      title={String(cell)}
                    >
                      {formatCellValue(cell, currentDataset.fields[cellIndex]?.type)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 显示更多按钮 */}
        {hasMoreRows && (
          <div className="text-center">
            <button
              onClick={() => setShowAllRows(!showAllRows)}
              className="btn btn-outline btn-sm"
            >
              {showAllRows ? '显示较少行' : '显示更多行'}
            </button>
          </div>
        )}
      </div>

      {/* 数据统计 */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">数据统计</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {currentDataset.rowCount.toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">总行数</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {currentDataset.fields.length}
            </div>
            <div className="text-sm text-green-700">字段数</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 格式化单元格值
 */
function formatCellValue(value: any, fieldType?: string): string {
  if (value === null || value === undefined) {
    return '-';
  }

  switch (fieldType) {
    case 'date':
      try {
        const date = new Date(value);
        return date.toLocaleDateString();
      } catch {
        return String(value);
      }
    
    case 'number':
      if (typeof value === 'number') {
        return value.toLocaleString();
      }
      return String(value);
    
    case 'boolean':
      return value ? '是' : '否';
    
    default:
      return String(value);
  }
}

export default DataTable;
