import React, { useState } from 'react';
import { useDatasetStore, useChartConfigStore } from '@/store';
import { ChartType, FieldRole } from '@/app/types';
import { CHART_TYPES } from '@/app/config';

interface ChartConfiguratorProps {
  chartType: ChartType;
  onCreateChart: (title: string) => void;
  onCancel: () => void;
}

const ChartConfigurator: React.FC<ChartConfiguratorProps> = ({
  chartType,
  onCreateChart,
  onCancel,
}) => {
  const { currentDataset } = useDatasetStore();
  const { createDefaultChart } = useChartConfigStore();
  
  const [title, setTitle] = useState('');
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);

  if (!currentDataset) {
    return null;
  }

  const chartConfig = CHART_TYPES[chartType];
  const { requiredFields, optionalFields } = chartConfig;

  const handleFieldMappingChange = (role: string, fieldId: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [role]: fieldId,
    }));
  };

  const validateConfig = (): boolean => {
    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push('请输入图表标题');
    }

    // 检查必需字段是否已映射
    for (const requiredField of requiredFields) {
      if (!fieldMapping[requiredField]) {
        newErrors.push(`请映射必需字段: ${requiredField}`);
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCreate = () => {
    if (validateConfig()) {
      onCreateChart(title);
    }
  };

  const getFieldOptions = (role: string) => {
    return currentDataset.fields.filter(field => {
      // 根据角色过滤合适的字段类型
      switch (role) {
        case 'x':
        case 'category':
        case 'dimension':
          return field.type === 'string' || field.type === 'date' || field.type === 'number';
        case 'y':
        case 'value':
          return field.type === 'number';
        case 'series':
          return field.type === 'string';
        default:
          return true;
      }
    });
  };

  const getRoleLabel = (role: string): string => {
    const roleLabels: Record<string, string> = {
      x: 'X轴',
      y: 'Y轴',
      series: '系列',
      category: '分类',
      value: '数值',
      dimension: '维度',
    };
    return roleLabels[role] || role;
  };

  const getRoleDescription = (role: string): string => {
    const roleDescriptions: Record<string, string> = {
      x: '用于X轴显示的字段',
      y: '用于Y轴数值的字段',
      series: '用于分组显示的字段',
      category: '用于分类显示的字段',
      value: '用于数值计算的字段',
      dimension: '用于多维度分析的字段',
    };
    return roleDescriptions[role] || '';
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h4 className="text-lg font-medium text-gray-900">
          配置 {chartConfig.name}
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          {chartConfig.description}
        </p>
      </div>

      {/* 图表标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          图表标题 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入图表标题"
          className="input w-full"
        />
      </div>

      {/* 字段映射 */}
      <div className="space-y-4">
        <h5 className="font-medium text-gray-900">字段映射</h5>
        
        {/* 必需字段 */}
        <div className="space-y-3">
          <h6 className="text-sm font-medium text-gray-700">必需字段</h6>
          {requiredFields.map((role) => (
            <div key={role} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {getRoleLabel(role)} *
              </label>
              <select
                value={fieldMapping[role] || ''}
                onChange={(e) => handleFieldMappingChange(role, e.target.value)}
                className="select w-full"
              >
                <option value="">请选择字段</option>
                {getFieldOptions(role).map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name} ({field.type})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                {getRoleDescription(role)}
              </p>
            </div>
          ))}
        </div>

        {/* 可选字段 */}
        {optionalFields.length > 0 && (
          <div className="space-y-3">
            <h6 className="text-sm font-medium text-gray-700">可选字段</h6>
            {optionalFields.map((role) => (
              <div key={role} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {getRoleLabel(role)}
                </label>
                <select
                  value={fieldMapping[role] || ''}
                  onChange={(e) => handleFieldMappingChange(role, e.target.value)}
                  className="select w-full"
                >
                  <option value="">请选择字段（可选）</option>
                  {getFieldOptions(role).map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name} ({field.type})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  {getRoleDescription(role)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">配置错误</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="btn btn-outline"
        >
          取消
        </button>
        <button
          onClick={handleCreate}
          className="btn btn-primary"
        >
          创建图表
        </button>
      </div>
    </div>
  );
};

export default ChartConfigurator;
