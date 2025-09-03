import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChartConfig, ChartKind, Mapping } from '@/app/types';

export interface ChartConfigState {
  // 状态
  charts: ChartConfig[];
  currentChart: ChartConfig | null;

  // 操作
  addChart: (chart: ChartConfig) => void;
  updateChart: (id: string, updates: Partial<ChartConfig>) => void;
  removeChart: (id: string) => void;
  setCurrentChart: (chart: ChartConfig | null) => void;
  createDefaultChart: (type: ChartKind, title: string, mapping?: Mapping, style?: Partial<ChartConfig['style']>) => ChartConfig;
}

export const useChartConfigStore = create<ChartConfigState>()(
  devtools(
    (set) => ({
      // 初始状态
      charts: [],
      currentChart: null,

      // 添加图表
      addChart: (chart: ChartConfig) => {
        set((state) => ({
          charts: [...state.charts, chart],
          currentChart: chart,
        }));
      },

      // 更新图表
      updateChart: (id: string, updates: Partial<ChartConfig>) => {
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === id ? { ...chart, ...updates } : chart
          ),
          currentChart:
            state.currentChart?.id === id
              ? { ...state.currentChart, ...updates }
              : state.currentChart,
        }));
      },

      // 删除图表
      removeChart: (id: string) => {
        set((state) => ({
          charts: state.charts.filter((chart) => chart.id !== id),
          currentChart:
            state.currentChart?.id === id ? null : state.currentChart,
        }));
      },

      // 设置当前图表
      setCurrentChart: (chart: ChartConfig | null) => {
        set({ currentChart: chart });
      },

      // 创建默认图表
      createDefaultChart: (type: ChartKind, title: string, mapping?: Mapping, style?: Partial<ChartConfig['style']>): ChartConfig => {
        return {
          id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: type,
          title: title,
          subtitle: '',
          mapping: mapping || {},
          style: {
            title: title,
            showLegend: true,
            showDataLabels: false,
            gridMargin: 60,
            colorScheme: 'default',
            xLabelRotate: 0,
            decimals: 2,
            ...(style || {}),
          },
        };
      },
    }),
    {
      name: 'chart-config-store',
    }
  )
);
