/**
 * 数值格式化工具
 */

/**
 * 格式化数字，添加千分位分隔符
 */
export function formatNumber(value: number, options?: {
  decimals?: number;
  locale?: string;
  currency?: string;
}): string {
  const { decimals = 2, locale = 'zh-CN', currency } = options || {};
  
  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 日期格式化工具
 */

/**
 * 格式化日期
 */
export function formatDate(date: Date | string | number, options?: {
  format?: 'short' | 'medium' | 'long' | 'full';
  locale?: string;
  timeZone?: string;
}): string {
  const { format = 'medium', locale = 'zh-CN', timeZone } = options || {};
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    ...(format === 'short' && {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    ...(format === 'medium' && {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    ...(format === 'long' && {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }),
    ...(format === 'full' && {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    }),
  };
  
  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const targetDate = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '刚刚';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}天前`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}年前`;
}

/**
 * 字符串格式化工具
 */

/**
 * 截断长文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 首字母大写
 */
export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * 转换为驼峰命名
 */
export function toCamelCase(text: string): string {
  return text
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

/**
 * 转换为短横线命名
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * 通用格式化工具
 */

/**
 * 安全地获取嵌套对象属性
 */
export function getNestedValue(obj: any, path: string, defaultValue: any = undefined): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}
