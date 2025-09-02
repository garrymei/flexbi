import React from 'react';
import { useDatasetStore } from '@/store';
import { Field, DataRow } from '@/app/types';

interface DataTableProps {
  maxRows?: number;
}

const DataTable: React.FC<DataTableProps> = ({ maxRows = 100 }) => {
  const { fields, rows } = useDatasetStore();
  
  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无数据，请先上传文件
      </div>
    );
  }

  const displayRows = rows.slice(0, maxRows);
  const hasMore = rows.length > maxRows;

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">数据预览</h3>
        <div className="text-sm text-gray-500">
          显示前 {displayRows.length} 行，共 {rows.length} 行
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {fields.map((field, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center space-x-2">
                    <span>{field.name}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
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
                {fields.map((field, fieldIndex) => (
                  <td
                    key={fieldIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formatCellValue(row[field.name], field.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="mt-4 text-center text-sm text-gray-500">
          仅显示前 {maxRows} 行数据，完整数据共 {rows.length} 行
        </div>
      )}
    </div>
  );
};

// 格式化单元格值
const formatCellValue = (value: any, type: string): string => {
  if (value === null || value === undefined) {
    return '-';
  }

  switch (type) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value);
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      return String(value);
    case 'boolean':
      return value ? '是' : '否';
    default:
      return String(value);
  }
};

export default DataTable;
