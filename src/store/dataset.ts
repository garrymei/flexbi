import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Dataset, Field, FieldType } from '@/app/types';
import { CONFIG } from '@/app/config';

export interface DatasetState {
  // 状态
  currentDataset: Dataset | null;
  isLoading: boolean;
  error: string | null;
  
  // 操作
  setDataset: (dataset: Dataset) => void;
  setFields: (fields: Field[]) => void;
  setRows: (rows: any[][]) => void;
  clearDataset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 数据操作
  updateField: (fieldName: string, updates: Partial<Field>) => void;
  addField: (field: Field) => void;
  removeField: (fieldName: string) => void;
  
  // 数据验证
  validateDataset: (dataset: Dataset) => boolean;
  
  // 数据统计
  getDatasetStats: () => {
    totalRows: number;
    totalFields: number;
    fieldTypes: Record<FieldType, number>;
    memoryUsage: number;
  } | null;
}

export const useDatasetStore = create<DatasetState>()(
  devtools(
    (set, get) => ({
      // 初始状态
      currentDataset: null,
      isLoading: false,
      error: null,
      
      // 设置数据集
      setDataset: (dataset: Dataset) => {
        if (get().validateDataset(dataset)) {
          set({ currentDataset: dataset, error: null });
        } else {
          set({ error: '数据集格式无效' });
        }
      },
      
      // 设置字段
      setFields: (fields: Field[]) => {
        const { currentDataset } = get();
        if (!currentDataset) return;
        
        set({
          currentDataset: {
            ...currentDataset,
            fields,
            updatedAt: new Date(),
          },
        });
      },
      
      // 设置行数据
      setRows: (rows: any[][]) => {
        const { currentDataset } = get();
        if (!currentDataset) return;
        
        set({
          currentDataset: {
            ...currentDataset,
            rows,
            rowCount: rows.length,
            updatedAt: new Date(),
          },
        });
      },
      
      // 清除数据集
      clearDataset: () => {
        set({ currentDataset: null, error: null });
      },
      
      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      // 设置错误
      setError: (error: string | null) => {
        set({ error });
      },
      
      // 更新字段
      updateField: (fieldName: string, updates: Partial<Field>) => {
        const { currentDataset } = get();
        if (!currentDataset) return;
        
        const updatedFields = currentDataset.fields.map(field =>
          field.name === fieldName ? { ...field, ...updates } : field
        );
        
        set({
          currentDataset: {
            ...currentDataset,
            fields: updatedFields,
            updatedAt: new Date(),
          },
        });
      },
      
      // 添加字段
      addField: (field: Field) => {
        const { currentDataset } = get();
        if (!currentDataset) return;
        
        set({
          currentDataset: {
            ...currentDataset,
            fields: [...currentDataset.fields, field],
            updatedAt: new Date(),
          },
        });
      },
      
      // 删除字段
      removeField: (fieldName: string) => {
        const { currentDataset } = get();
        if (!currentDataset) return;
        
        const updatedFields = currentDataset.fields.filter(
          field => field.name !== fieldName
        );
        
        set({
          currentDataset: {
            ...currentDataset,
            fields: updatedFields,
            updatedAt: new Date(),
          },
        });
      },
      
      // 验证数据集
      validateDataset: (dataset: Dataset): boolean => {
        // 基本验证
        if (!dataset || !dataset.fields || !dataset.rows) {
          return false;
        }
        
        // 字段验证
        if (dataset.fields.length === 0) {
          return false;
        }
        
        // 行数验证
        if (dataset.rows.length > CONFIG.MAX_ROWS_PROCESS) {
          return false;
        }
        
        // 数据一致性验证
        const expectedColumns = dataset.fields.length;
        const hasValidRows = dataset.rows.every(row => 
          Array.isArray(row) && row.length === expectedColumns
        );
        
        return hasValidRows;
      },
      
      // 获取数据集统计
      getDatasetStats: () => {
        const { currentDataset } = get();
        if (!currentDataset) return null;
        
        const fieldTypes = currentDataset.fields.reduce((acc, field) => {
          acc[field.type] = (acc[field.type] || 0) + 1;
          return acc;
        }, {} as Record<FieldType, number>);
        
        // 估算内存使用（粗略计算）
        const memoryUsage = JSON.stringify(currentDataset).length * 2; // 2 bytes per character
        
        return {
          totalRows: currentDataset.rowCount,
          totalFields: currentDataset.fields.length,
          fieldTypes,
          memoryUsage,
        };
      },
    }),
    {
      name: 'dataset-store',
    }
  )
);
