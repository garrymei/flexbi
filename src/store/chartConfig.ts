import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChartConfig, ChartKind, Mapping } from '@/app/types';
import { DEFAULT_STYLES, CHART_TYPES } from '@/app/config';

interface ChartConfigState {
  // 状态
  charts: ChartConfig[];
  activeChartId: string | null;
  selectedChartType: ChartKind | null;
  
  // 操作
  addChart: (chart: ChartConfig) => void;
  updateChart: (chartId: string, updates: Partial<ChartConfig>) => void;
  removeChart: (chartId: string) => void;
  setActiveChart: (chartId: string | null) => void;
  setSelectedChartType: (chartType: ChartKind | null) => void;
  
  // 字段映射操作
  updateFieldMapping: (chartId: string, role: keyof Mapping, fieldName: string) => void;
  clearFieldMapping: (chartId: string, role: keyof Mapping) => void;
  
  // 样式操作
  updateChartStyle: (chartId: string, styleUpdates: Partial<ChartConfig['style']>) => void;
  resetChartStyle: (chartId: string) => void;
  
  // 验证
  validateChartConfig: (chart: ChartConfig) => boolean;
  getChartValidationErrors: (chart: ChartConfig) => string[];
  
  // 获取
  getActiveChart: () => ChartConfig | null;
  getChartById: (chartId: string) => ChartConfig | null;
  
  // 工具方法
  createDefaultChart: (type: ChartKind, title: string) => ChartConfig;
  duplicateChart: (chartId: string) => void;
}

export const useChartConfigStore = create<ChartConfigState>()(
  devtools(
    (set, get) => ({
      // 初始状态
      charts: [],
      activeChartId: null,
      selectedChartType: null,
      
      // 添加图表
      addChart: (chart: ChartConfig) => {
        if (get().validateChartConfig(chart)) {
          set(state => ({
            charts: [...state.charts, chart],
            activeChartId: chart.id,
          }));
        }
      },
      
      // 更新图表
      updateChart: (chartId: string, updates: Partial<ChartConfig>) => {
        set(state => ({
          charts: state.charts.map(chart =>
            chart.id === chartId ? { ...chart, ...updates } : chart
          ),
        }));
      },
      
      // 删除图表
      removeChart: (chartId: string) => {
        set(state => {
          const newCharts = state.charts.filter(chart => chart.id !== chartId);
          const newActiveChartId = state.activeChartId === chartId 
            ? (newCharts.length > 0 ? newCharts[0].id : null)
            : state.activeChartId;
          
          return {
            charts: newCharts,
            activeChartId: newActiveChartId,
          };
        });
      },
      
      // 设置活动图表
      setActiveChart: (chartId: string | null) => {
        set({ activeChartId: chartId });
      },
      
      // 设置选中的图表类型
      setSelectedChartType: (chartType: ChartType | null) => {
        set({ selectedChartType: chartType });
      },
      
      // 更新字段映射
      updateFieldMapping: (chartId: string, role: keyof Mapping, fieldName: string) => {
        set(state => ({
          charts: state.charts.map(chart => {
            if (chart.id === chartId) {
              const newMapping = { ...chart.mapping, [role]: fieldName };
              return { ...chart, mapping: newMapping };
            }
            return chart;
          }),
        }));
      },
      
      // 清除字段映射
      clearFieldMapping: (chartId: string, role: keyof Mapping) => {
        set(state => ({
          charts: state.charts.map(chart => {
            if (chart.id === chartId) {
              const { [role]: removed, ...newMapping } = chart.mapping;
              return { ...chart, mapping: newMapping };
            }
            return chart;
          }),
        }));
      },
      
      // 更新图表样式
      updateChartStyle: (chartId: string, styleUpdates: Partial<ChartConfig['style']>) => {
        set(state => ({
          charts: state.charts.map(chart => {
            if (chart.id === chartId) {
              return {
                ...chart,
                style: { ...chart.style, ...styleUpdates },
              };
            }
            return chart;
          }),
        }));
      },
      
      // 重置图表样式
      resetChartStyle: (chartId: string) => {
        const chart = get().getChartById(chartId);
        if (chart) {
          get().updateChartStyle(chartId, {
            title: chart.style?.title || '',
            legend: true,
            label: false,
            colorScheme: 'default',
            xLabelRotate: 0,
            decimals: 2
          });
        }
      },
      
      // 验证图表配置
      validateChartConfig: (chart: ChartConfig): boolean => {
        const errors = get().getChartValidationErrors(chart);
        return errors.length === 0;
      },
      
      // 获取图表验证错误
      getChartValidationErrors: (chart: ChartConfig): string[] => {
        const errors: string[] = [];
        
        // 基本验证
        if (!chart.title.trim()) {
          errors.push('图表标题不能为空');
        }
        
        if (!chart.type) {
          errors.push('图表类型不能为空');
        }
        
        // 字段映射验证
        const chartSpec = CHART_TYPES[chart.type];
        if (chartSpec) {
          const { requiredFields } = chartSpec;
          for (const requiredField of requiredFields) {
            if (!chart.fieldMapping[requiredField]) {
              errors.push(`必需字段 ${requiredField} 未映射`);
            }
          }
        }
        
        return errors;
      },
      
      // 获取活动图表
      getActiveChart: () => {
        const { activeChartId, charts } = get();
        return activeChartId ? charts.find(chart => chart.id === activeChartId) || null : null;
      },
      
      // 根据ID获取图表
      getChartById: (chartId: string) => {
        return get().charts.find(chart => chart.id === chartId) || null;
      },
      
      // 创建默认图表
      createDefaultChart: (type: ChartKind, title: string): ChartConfig => {
        const id = `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
          kind: type,
          mapping: {},
          style: {
            title,
            legend: true,
            label: false,
            colorScheme: 'default',
            xLabelRotate: 0,
            decimals: 2
          },
          transform: undefined
        };
      },
      
      // 复制图表
      duplicateChart: (chartId: string) => {
        const originalChart = get().getChartById(chartId);
        if (originalChart) {
          const duplicatedChart: ChartConfig = {
            ...originalChart,
            id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: `${originalChart.title} (副本)`,
          };
          get().addChart(duplicatedChart);
        }
      },
    }),
    {
      name: 'chart-config-store',
    }
  )
);
