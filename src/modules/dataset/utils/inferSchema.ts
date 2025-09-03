import { Field, FieldType } from '@/app/types';
import { CONFIG } from '@/app/config';

/**
 * 推断数据集的字段类型和结构
 */
export async function inferSchema(data: any[][]): Promise<Field[]> {
  if (!data || data.length === 0) {
    throw new Error('数据为空，无法推断字段类型');
  }

  const headers = data[0];
  const sampleSize = Math.min(CONFIG.SAMPLE_SIZE, data.length - 1);
  const sampleData = data.slice(1, sampleSize + 1);

  const fields: Field[] = headers.map((header, index) => {
    const columnData = sampleData.map(row => row[index]).filter(val => val !== null && val !== undefined);
    const fieldType = inferFieldType(columnData);
    const uniqueValues = new Set(columnData).size;
    const sampleValues = columnData.slice(0, 5); // 取前5个值作为样本

    return {
      key: `field_${index}`,
      name: header || `字段${index + 1}`,
      type: fieldType,
      uniqueValues,
      sampleValues,
    };
  });

  return fields;
}

/**
 * 推断单个字段的类型
 */
function inferFieldType(values: any[]): FieldType {
  if (values.length === 0) return 'string';

  // 统计类型分布
  let stringCount = 0;
  let numberCount = 0;
  let dateCount = 0;
  let booleanCount = 0;

  for (const value of values) {
    if (value === null || value === undefined) continue;

    if (isBoolean(value)) {
      booleanCount++;
    } else if (isDate(value)) {
      dateCount++;
    } else if (isNumber(value)) {
      numberCount++;
    } else {
      stringCount++;
    }
  }

  const total = values.length;

  // 如果某种类型占比超过70%，则认为是该类型
  if (booleanCount / total > 0.7) return 'boolean';
  if (dateCount / total > 0.7) return 'date';
  if (numberCount / total > 0.7) return 'number';
  
  // 默认返回string类型
  return 'string';
}

/**
 * 检查是否为布尔值
 */
function isBoolean(value: any): boolean {
  if (typeof value === 'boolean') return true;
  
  const str = String(value).toLowerCase().trim();
  return ['true', 'false', '1', '0', 'yes', 'no', '是', '否'].includes(str);
}

/**
 * 检查是否为日期
 */
function isDate(value: any): boolean {
  if (value instanceof Date) return true;
  
  const str = String(value);
  
  // 常见的日期格式
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
    /^\d{8}$/, // YYYYMMDD
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/, // M/D/YY or M/D/YYYY
  ];

  if (datePatterns.some(pattern => pattern.test(str))) {
    const parsed = new Date(str);
    return !isNaN(parsed.getTime());
  }

  // 尝试解析为日期
  const parsed = new Date(str);
  return !isNaN(parsed.getTime());
}

/**
 * 检查是否为数字
 */
function isNumber(value: any): boolean {
  if (typeof value === 'number') return true;
  
  const str = String(value).trim();
  
  // 检查是否为有效的数字字符串
  if (/^-?\d*\.?\d+$/.test(str)) {
    const num = parseFloat(str);
    return !isNaN(num) && isFinite(num);
  }
  
  return false;
}

/**
 * 获取字段的统计信息
 */
export function getFieldStats(values: any[], fieldType: FieldType) {
  const validValues = values.filter(val => val !== null && val !== undefined);
  
  switch (fieldType) {
    case 'number':
      return {
        min: Math.min(...validValues),
        max: Math.max(...validValues),
        avg: validValues.reduce((sum, val) => sum + val, 0) / validValues.length,
        count: validValues.length,
      };
    
    case 'date':
      const dates = validValues.map(val => new Date(val));
      return {
        min: new Date(Math.min(...dates.map(d => d.getTime()))),
        max: new Date(Math.max(...dates.map(d => d.getTime()))),
        count: validValues.length,
      };
    
    case 'boolean':
      const trueCount = validValues.filter(val => Boolean(val)).length;
      return {
        trueCount,
        falseCount: validValues.length - trueCount,
        count: validValues.length,
      };
    
    case 'string':
    default:
      const valueCounts = validValues.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        uniqueValues: Object.keys(valueCounts).length,
        mostCommon: Object.entries(valueCounts)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 5),
        count: validValues.length,
      };
  }
}
