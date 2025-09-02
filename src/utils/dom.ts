/**
 * DOM 操作工具函数
 */

/**
 * 下载文件
 */
export function downloadFile(data: string | Blob, filename: string, mimeType?: string): void {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (err) {
    return false;
  }
}

/**
 * 获取元素尺寸和位置
 */
export function getElementRect(element: HTMLElement): {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY,
  };
}

/**
 * 检查元素是否在视口中
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 滚动到元素
 */
export function scrollToElement(element: HTMLElement, options?: {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}): void {
  element.scrollIntoView({
    behavior: options?.behavior || 'smooth',
    block: options?.block || 'start',
    inline: options?.inline || 'nearest',
  });
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 创建并触发自定义事件
 */
export function createCustomEvent(
  name: string,
  detail?: any,
  options?: CustomEventInit
): CustomEvent {
  const event = new CustomEvent(name, {
    detail,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  
  document.dispatchEvent(event);
  return event;
}

/**
 * 监听元素大小变化
 */
export function observeElementResize(
  element: HTMLElement,
  callback: (entries: ResizeObserverEntry[]) => void
): ResizeObserver {
  const observer = new ResizeObserver(callback);
  observer.observe(element);
  return observer;
}

/**
 * 监听元素可见性变化
 */
export function observeElementVisibility(
  element: HTMLElement,
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const observer = new IntersectionObserver(callback, {
    threshold: 0,
    ...options,
  });
  observer.observe(element);
  return observer;
}

/**
 * 获取计算样式
 */
export function getComputedStyle(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * 设置CSS变量
 */
export function setCSSVariable(element: HTMLElement, name: string, value: string): void {
  element.style.setProperty(`--${name}`, value);
}

/**
 * 获取CSS变量
 */
export function getCSSVariable(element: HTMLElement, name: string): string {
  return getComputedStyle(element, `--${name}`);
}
