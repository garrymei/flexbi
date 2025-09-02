import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDatasetStore, useUIStore } from '@/store';
import { parseData } from '../utils/parseData';
import { inferSchema } from '../utils/inferSchema';

const DataUploader: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { setDataset, setLoading, setError } = useDatasetStore();
  const { showSuccess, showError } = useUIStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsProcessing(true);
    setLoading(true);
    setError(null);

    try {
      // 解析数据
      const rawData = await parseData(file);
      
      // 推断字段类型
      const fields = await inferSchema(rawData);
      
      // 创建数据集
      const dataset = {
        id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name.replace(/\.[^/.]+$/, ''), // 移除文件扩展名
        fields,
        rows: rawData,
        rowCount: rawData.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setDataset(dataset);
      showSuccess(`成功导入 ${file.name}，共 ${rawData.length} 行数据`);
    } catch (error) {
      console.error('数据导入失败:', error);
      const errorMessage = error instanceof Error ? error.message : '数据导入失败';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  }, [setDataset, setLoading, setError, showSuccess, showError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : isDragReject
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }`}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600">正在处理数据...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📁</div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? '释放文件以上传' : '拖拽文件到此处'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                或点击选择文件
              </p>
            </div>
            <div className="text-xs text-gray-400">
              支持 CSV、Excel (.xlsx, .xls) 格式
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUploader;
