import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { CONFIG } from '@/app/config';

export interface ParsedData {
  headers: string[];
  rows: any[][];
}

/**
 * 解析数据文件（CSV或Excel）
 */
export async function parseData(file: File): Promise<any[][]> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  try {
    if (fileExtension === 'csv') {
      return await parseCSV(file);
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      return await parseExcel(file);
    } else {
      throw new Error('不支持的文件格式');
    }
  } catch (error) {
    console.error('文件解析失败:', error);
    throw new Error(`文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 解析CSV文件
 */
async function parseCSV(file: File): Promise<any[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV解析错误: ${results.errors[0].message}`));
          return;
        }
        
        const data = results.data as any[][];
        if (data.length === 0) {
          reject(new Error('CSV文件为空'));
          return;
        }
        
        // 限制行数
        const limitedData = data.slice(0, CONFIG.MAX_ROWS_PROCESS);
        resolve(limitedData);
      },
      error: (error) => {
        reject(new Error(`CSV解析失败: ${error.message}`));
      },
    });
  });
}

/**
 * 解析Excel文件
 */
async function parseExcel(file: File): Promise<any[][]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          reject(new Error('Excel文件没有工作表'));
          return;
        }
        
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 转换为数组格式
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          reject(new Error('Excel工作表为空'));
          return;
        }
        
        // 过滤空行并限制行数
        const filteredData = (jsonData as any[][])
          .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
          .slice(0, CONFIG.MAX_ROWS_PROCESS);
        
        resolve(filteredData);
      } catch (error) {
        reject(new Error(`Excel解析失败: ${error instanceof Error ? error.message : '未知错误'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

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
