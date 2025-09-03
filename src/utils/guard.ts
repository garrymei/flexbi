/**
 * 类型守卫和断言工具函数
 */

/**
 * 检查是否为数组
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

/**
 * 检查是否为对象
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 检查是否为函数
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

/**
 * 检查是否为字符串
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * 检查是否为数字
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * 检查是否为布尔值
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * 检查是否为日期
 */
export function isDate(value: any): value is Date {
  return value instanceof Date;
}

/**
 * 检查是否为正则表达式
 */
export function isRegExp(value: any): value is RegExp {
  return value instanceof RegExp;
}

/**
 * 检查是否为Promise
 */
export function isPromise(value: any): value is Promise<any> {
  return value && typeof value.then === 'function';
}

/**
 * 检查是否为Error
 */
export function isError(value: any): value is Error {
  return value instanceof Error;
}

/**
 * 检查是否为null或undefined
 */
export function isNullOrUndefined(value: any): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * 检查是否为空值（null、undefined、空字符串、空数组、空对象）
 */
export function isEmpty(value: any): boolean {
  if (isNullOrUndefined(value)) return true;
  if (isString(value)) return value.trim().length === 0;
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

/**
 * 检查是否为有效值（非空值）
 */
export function isValid<T>(value: T): value is NonNullable<T> {
  return !isNullOrUndefined(value) && !isEmpty(value);
}

/**
 * 类型安全的属性访问
 */
export function safeGet<T, K extends keyof T>(obj: T, key: K): T[K] | undefined {
  return obj?.[key];
}

/**
 * 类型安全的属性设置
 */
export function safeSet<T extends Record<string, any>, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  if (obj && key in obj) {
    obj[key] = value;
  }
}

/**
 * 类型安全的函数调用
 */
export function safeCall<T extends (...args: any[]) => any>(
  fn: T | null | undefined,
  ...args: Parameters<T>
): ReturnType<T> | undefined {
  if (isFunction(fn)) {
    return fn(...args);
  }
  return undefined;
}

/**
 * 类型断言
 */
export function assert<T>(condition: T, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * 类型断言（非空）
 */
export function assertNonNull<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (isNullOrUndefined(value)) {
    throw new Error(message || 'Value cannot be null or undefined');
  }
}

/**
 * 类型断言（数组）
 */
export function assertArray(value: any, message?: string): asserts value is any[] {
  if (!isArray(value)) {
    throw new Error(message || 'Value must be an array');
  }
}

/**
 * 类型断言（对象）
 */
export function assertObject(value: any, message?: string): asserts value is Record<string, any> {
  if (!isObject(value)) {
    throw new Error(message || 'Value must be an object');
  }
}

/**
 * 类型断言（字符串）
 */
export function assertString(value: any, message?: string): asserts value is string {
  if (!isString(value)) {
    throw new Error(message || 'Value must be a string');
  }
}

/**
 * 类型断言（数字）
 */
export function assertNumber(value: any, message?: string): asserts value is number {
  if (!isNumber(value)) {
    throw new Error(message || 'Value must be a number');
  }
}

/**
 * 类型断言（函数）
 */
export function assertFunction(value: any, message?: string): asserts value is Function {
  if (!isFunction(value)) {
    throw new Error(message || 'Value must be a function');
  }
}

/**
 * 类型安全的类型转换
 */
export function as<T>(value: any): T {
  return value as T;
}

/**
 * 类型安全的类型转换（带验证）
 */
export function asWithValidation<T>(
  value: any,
  validator: (value: any) => value is T,
  fallback?: T
): T {
  if (validator(value)) {
    return value;
  }
  if (fallback !== undefined) {
    return fallback;
  }
  throw new Error('Type validation failed');
}

/**
 * 类型安全的默认值
 */
export function withDefault<T>(value: T | null | undefined, defaultValue: T): T {
  return isNullOrUndefined(value) ? defaultValue : value;
}

/**
 * 类型安全的可选链
 */
export function optionalChain<T, R>(
  value: T | null | undefined,
  accessor: (value: T) => R
): R | undefined {
  if (isNullOrUndefined(value)) {
    return undefined;
  }
  try {
    return accessor(value);
  } catch {
    return undefined;
  }
}
