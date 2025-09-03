import React, { useEffect, useMemo, useState } from 'react';
import { useDatasetStore } from '@/store';
import { ChartKind, Mapping } from '@/app/types';
import { getChartSpec, getRequiredRoles, getRoleTypes, getDefaultFieldMapping, validateMapping } from '@/modules/charts/registry';
import { colorThemes } from '@/modules/charts/adapters/echarts/colors';

interface ChartConfiguratorProps {
  chartType: ChartKind;
  onCreateChart: (title: string, mapping: Mapping, style?: Record<string, any>) => void;
  onCancel: () => void;
}

const ChartConfigurator: React.FC<ChartConfiguratorProps> = ({
  chartType,
  onCreateChart,
  onCancel,
}) => {
  const { currentDataset } = useDatasetStore();
  
  const [title, setTitle] = useState('');
  const [fieldMapping, setFieldMapping] = useState<Mapping>({});
  const [styleConfig, setStyleConfig] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  if (!currentDataset) {
    return null;
  }

  const chartSpec = getChartSpec(chartType);
  if (!chartSpec) return null;

  const requiredRoles = getRequiredRoles(chartType);
  const optionalRoles = chartSpec.roles.filter(role => !role.required).map(role => role.role);

  // 预填默认映射（若数据集中存在相应字段）与默认标题
  useEffect(() => {
    const defaults = getDefaultFieldMapping(chartType);
    const initial: Mapping = { ...fieldMapping };
    Object.entries(defaults).forEach(([role, key]) => {
      const exists = currentDataset.fields.some(f => f.key === key || f.name === key);
      if (exists) initial[role as keyof Mapping] = key as string;
    });
    setFieldMapping(initial);
    if (!title) {
      const ds = currentDataset?.name || '数据集';
      setTitle(`${chartSpec.displayName} - ${ds}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartType, currentDataset]);

  // 初始化样式配置
  useEffect(() => {
    if (chartSpec.styleSchema) {
      const initial: Record<string, any> = {};
      chartSpec.styleSchema.forEach(option => {
        initial[option.key] = option.defaultValue;
      });
      setStyleConfig(initial);
    }
  }, [chartSpec]);

  const handleFieldMappingChange = (role: keyof Mapping, fieldName: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [role]: fieldName,
    }));
  };

  const handleStyleChange = (key: string, value: any) => {
    setStyleConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateConfig = (): boolean => {
    const validation = validateMapping(chartSpec, fieldMapping as Record<string, string>, currentDataset.fields);
    setErrors(validation.errors);

    // 重复字段警告
    const used = Object.values(fieldMapping).filter(Boolean) as string[];
    const duplicates = used.filter((v, i) => used.indexOf(v) !== i);
    setWarnings(duplicates.length > 0 ? ['同一字段被多个角色使用，请确认是否合理'] : []);

    return validation.ok;
  };

  const canCreate = useMemo(() => {
    if (!title.trim()) return false;
    return requiredRoles.every((r) => !!fieldMapping[r as keyof Mapping]);
  }, [title, fieldMapping, requiredRoles]);

  const handleCreate = () => {
    if (validateConfig()) {
      onCreateChart(title, fieldMapping, styleConfig);
    }
  };

  const getFieldOptions = (role: keyof Mapping) => {
    const roleTypes = getRoleTypes(chartType, role as any);
    const selected = new Set(
      Object.entries(fieldMapping)
        .filter(([r, v]) => r !== role && !!v)
        .map(([, v]) => String(v))
    );
    return currentDataset.fields
      .filter(field => roleTypes.includes(field.type))
      .map((field) => ({ ...field, disabled: selected.has(field.key) })) as Array<any>;
  };

  const getRoleLabel = (role: keyof Mapping): string => {
    const roleRule = chartSpec.roles.find(r => r.role === role);
    return roleRule?.label || role;
  };

  const getRoleHelper = (role: keyof Mapping): string => {
    const rule = chartSpec.roles.find(r => r.role === role);
    const types = rule?.types?.join('/') || '';
    const desc = rule?.description || '';
    return [desc, types ? `支持: ${types}` : ''].filter(Boolean).join(' · ');
  };

  const renderStyleControl = (option: any) => {
    const value = styleConfig[option.key] ?? option.defaultValue;

    switch (option.type) {
      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleStyleChange(option.key, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        );

      case 'select':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {option.label}
            </label>
            <select
              value={value}
              onChange={(e) => handleStyleChange(option.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {option.options?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {option.label}
            </label>
            <input
              type="number"
              value={value}
              min={option.min}
              max={option.max}
              step={option.step}
              onChange={(e) => handleStyleChange(option.key, parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'color':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {option.label}
            </label>
            <input
              type="color"
              value={value}
              onChange={(e) => handleStyleChange(option.key, e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          图表标题
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入图表标题"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 必需字段映射 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">必需字段映射</h4>
        <div className="space-y-3">
          {requiredRoles.map((role) => (
            <div key={role} className="space-y-2">
              <div className="flex items-center space-x-3">
                <label className="w-20 text-sm text-gray-600">
                  {getRoleLabel(role as keyof Mapping)}:
                </label>
                <select
                  value={fieldMapping[role as keyof Mapping] || ''}
                  onChange={(e) => handleFieldMappingChange(role as keyof Mapping, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择字段</option>
                  {getFieldOptions(role as keyof Mapping).map((field: any) => (
                    <option key={field.key} value={field.key} disabled={field.disabled}>
                      {field.name} ({field.type}){field.disabled ? ' · 已选' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-gray-400 ml-2">{getRoleHelper(role as keyof Mapping)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 可选字段映射 */}
      {optionalRoles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">可选字段映射</h4>
          <div className="space-y-3">
            {optionalRoles.map((role) => (
              <div key={role} className="space-y-2">
                <div className="flex items-center space-x-3">
                  <label className="w-20 text-sm text-gray-600">
                    {getRoleLabel(role as keyof Mapping)}:
                  </label>
                  <select
                    value={fieldMapping[role as keyof Mapping] || ''}
                    onChange={(e) => handleFieldMappingChange(role as keyof Mapping, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择字段</option>
                    {getFieldOptions(role as keyof Mapping).map((field: any) => (
                      <option key={field.key} value={field.key} disabled={field.disabled}>
                        {field.name} ({field.type}){field.disabled ? ' · 已选' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-gray-400 ml-2">{getRoleHelper(role as keyof Mapping)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 样式配置 */}
      {chartSpec.styleSchema && chartSpec.styleSchema.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">样式配置</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chartSpec.styleSchema.map((option) => (
              <div key={option.key} className="space-y-2">
                {renderStyleControl(option)}
                {option.description && (
                  <p className="text-xs text-gray-500">{option.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 颜色配置 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">颜色配置</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">颜色主题</label>
            <select
              value={styleConfig.colorScheme || 'default'}
              onChange={(e) => handleStyleChange('colorScheme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(colorThemes).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <div className="flex items-center space-x-1 mt-2">
              {(colorThemes[(styleConfig.colorScheme as keyof typeof colorThemes) || 'default'] || colorThemes.default).slice(0, 10).map((c) => (
                <span key={c} className="inline-block w-4 h-4 rounded" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">选择预设主题，或使用自定义色板覆盖</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">自定义色板（用逗号分隔）</label>
            <input
              type="text"
              value={(styleConfig.colors || []).join(', ')}
              onChange={(e) => {
                const arr = e.target.value
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean);
                handleStyleChange('colors', arr);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#5470c6, #91cc75, #fac858 ..."
            />
            <div className="flex items-center space-x-1 mt-2">
              {(styleConfig.colors || []).slice(0, 10).map((c: string) => (
                <span key={c} className="inline-block w-4 h-4 rounded" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">若填写颜色列表，将优先使用此色板覆盖主题</p>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <ul className="text-sm text-red-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <ul className="text-sm text-yellow-700 space-y-1">
            {warnings.map((w, index) => (
              <li key={index}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 快捷操作 */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          必需角色: {requiredRoles.join(', ')}
        </div>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => {
              const next: Mapping = { ...fieldMapping };
              const chosen = new Set(Object.values(next).filter(Boolean) as string[]);
              requiredRoles.forEach((role) => {
                if (!next[role as keyof Mapping]) {
                  const candidates = currentDataset.fields.filter(f => getRoleTypes(chartType, role as any).includes(f.type));
                  const pick = candidates.find(c => !chosen.has(c.key)) || (candidates.length > 0 ? candidates[0] : null);
                  if (pick) {
                    next[role as keyof Mapping] = pick.key;
                    chosen.add(pick.key);
                  }
                }
              });
              setFieldMapping(next);
            }}
            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
          >
            自动映射
          </button>
          <button
            type="button"
            onClick={() => setFieldMapping({})}
            className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
          >
            清空映射
          </button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          className={`px-4 py-2 rounded-md transition-colors ${
            canCreate
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          创建图表
        </button>
      </div>
    </div>
  );
};

export default ChartConfigurator;
