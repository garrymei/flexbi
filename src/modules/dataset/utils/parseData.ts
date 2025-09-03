import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Field, DataRow, FieldType } from '@/app/types';

export interface ParseResult {
  success: boolean;
  fields?: Field[];
  rows?: DataRow[];
  error?: string;
}

/**
 * 解析CSV文件
 */
const parseCSV = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          resolve({
            success: false,
            error: `CSV解析错误: ${results.errors[0].message}`
          });
          return;
        }

        if (results.data.length === 0) {
          resolve({
            success: false,
            error: 'CSV文件为空或没有数据行'
          });
          return;
        }

        const fields = inferFields(results.data as DataRow[]);
        const rows = results.data as DataRow[];

        resolve({
          success: true,
          fields,
          rows
        });
      },
      error: (error) => {
        resolve({
          success: false,
          error: `CSV解析失败: ${error.message}`
        });
      }
    });
  });
};

/**
 * 解析Excel文件
 */
const parseExcel = async (file: File): Promise<ParseResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // 获取第一个工作表
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    if (!worksheet) {
      return {
        success: false,
        error: 'Excel文件没有工作表'
      };
    }

    // 转换为JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length < 2) {
      return {
        success: false,
        error: 'Excel文件数据不足（至少需要标题行和一行数据）'
      };
    }

    // 第一行作为字段名
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1) as any[][];

    // 转换为对象数组
    const rows: DataRow[] = dataRows.map(row => {
      const obj: DataRow = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });

    const fields = inferFields(rows);

    return {
      success: true,
      fields,
      rows
    };
  } catch (error) {
    return {
      success: false,
      error: `Excel解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

/**
 * 推断字段类型
 */
const inferFields = (rows: DataRow[]): Field[] => {
  if (rows.length === 0) return [];

  const sampleSize = Math.min(1000, rows.length);
  const sampleRows = rows.slice(0, sampleSize);
  const fieldNames = Object.keys(sampleRows[0] || {});

  return fieldNames.map(name => {
    const type = inferFieldType(name, sampleRows);
    return {
      key: name,
      name,
      type: type as FieldType,
      uniqueValues: countUniqueValues(name, sampleRows)
    };
  });
};

/**
 * 推断单个字段类型
 */
const inferFieldType = (fieldName: string, rows: DataRow[]): string => {
  const values = rows.map(row => row[fieldName]).filter(v => v !== null && v !== undefined);
  
  if (values.length === 0) return 'string';

  // 检查是否为布尔值
  const booleanValues = values.filter(v => 
    typeof v === 'boolean' || 
    (typeof v === 'string' && /^(true|false|yes|no|1|0)$/i.test(v))
  );
  if (booleanValues.length === values.length) return 'boolean';

  // 检查是否为日期
  const dateValues = values.filter(v => {
    if (v instanceof Date) return true;
    if (typeof v === 'string') {
      const date = new Date(v);
      return !isNaN(date.getTime());
    }
    return false;
  });
  if (dateValues.length > values.length * 0.8) return 'date';

  // 检查是否为数字
  const numberValues = values.filter(v => 
    typeof v === 'number' || 
    (typeof v === 'string' && !isNaN(Number(v)) && v.trim() !== '')
  );
  if (numberValues.length > values.length * 0.8) return 'number';

  return 'string';
};

/**
 * 统计唯一值数量
 */
const countUniqueValues = (fieldName: string, rows: DataRow[]): number => {
  const values = rows.map(row => row[fieldName]);
  const uniqueValues = new Set(values);
  return uniqueValues.size;
};

/**
 * 主解析函数
 */
export const parseData = async (file: File): Promise<ParseResult> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      return await parseCSV(file);
    } else if (
      fileType.includes('excel') || 
      fileType.includes('spreadsheet') ||
      fileName.endsWith('.xlsx') || 
      fileName.endsWith('.xls')
    ) {
      return await parseExcel(file);
    } else {
      return {
        success: false,
        error: '不支持的文件格式，请上传CSV或Excel文件'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

/**
 * 验证数据格式
 */
export function validateData(data: any[][]): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }
  
  // 检查每行是否有相同的列数
  const firstRowLength = data[0]?.length || 0;
  if (firstRowLength === 0) {
    return false;
  }
  
  return data.every(row => Array.isArray(row) && row.length === firstRowLength);
}

/**
 * 清理数据（移除空行、标准化格式等）
 */
export function cleanData(data: any[][]): any[][] {
  return data
    .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
    .map(row => row.map(cell => {
      if (typeof cell === 'string') {
        const trimmed = cell.trim();
        return trimmed === '' ? null : trimmed;
      }
      return cell;
    }));
}
