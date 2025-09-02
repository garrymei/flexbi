import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDatasetStore } from '@/store';
import { parseData } from '../utils/parseData';

interface DataUploaderProps {
  onDataLoaded?: () => void;
}

const DataUploader: React.FC<DataUploaderProps> = ({ onDataLoaded }) => {
  const { setDataset, setFields, setRows } = useDatasetStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    try {
      const result = await parseData(file);
      
      if (result.success) {
        // 创建数据集对象
        const dataset = {
          id: `dataset_${Date.now()}`,
          name: file.name,
          fields: result.fields,
          rows: result.rows,
          rowCount: result.rows.length,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setDataset(dataset);
        onDataLoaded?.();
      } else {
        console.error('数据解析失败:', result.error);
      }
    } catch (error) {
      console.error('文件处理错误:', error);
    }
  }, [setDataset, setFields, setRows, onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {isDragActive ? '释放文件以上传' : '拖拽文件到此处或点击选择'}
            </h3>
            <p className="text-sm text-gray-500">
              支持 CSV、Excel (.xlsx, .xls) 格式
            </p>
          </div>
          
          <div className="text-xs text-gray-400">
            最大文件大小: 10MB
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUploader;
