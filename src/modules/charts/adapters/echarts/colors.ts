// 默认颜色方案
export const getDefaultColors = (): string[] => {
  return [
    '#5470c6', // 蓝色
    '#91cc75', // 绿色
    '#fac858', // 黄色
    '#ee6666', // 红色
    '#73c0de', // 浅蓝色
    '#3ba272', // 深绿色
    '#fc8452', // 橙色
    '#9a60b4', // 紫色
    '#ea7ccc', // 粉色
    '#ff9f7f'  // 珊瑚色
  ];
};

// 预设颜色主题
export const colorThemes = {
  default: getDefaultColors(),
  
  // 商务主题
  business: [
    '#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#592E83',
    '#3A86FF', '#8338EC', '#FF006E', '#FB5607', '#FFBE0B'
  ],
  
  // 自然主题
  nature: [
    '#2D5016', '#4A7C59', '#8FBC94', '#C3E8BD', '#F4F1DE',
    '#6B4423', '#8B7355', '#A67B5B', '#C19A6B', '#D4AF37'
  ],
  
  // 暖色主题
  warm: [
    '#FF6B6B', '#FF8E53', '#FFA726', '#FFB74D', '#FFCC02',
    '#FF9800', '#FF5722', '#E64A19', '#D84315', '#BF360C'
  ],
  
  // 冷色主题
  cool: [
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'
  ],
  
  // 灰度主题
  grayscale: [
    '#212121', '#424242', '#616161', '#757575', '#9E9E9E',
    '#BDBDBD', '#E0E0E0', '#EEEEEE', '#F5F5F5', '#FAFAFA'
  ]
};

// 获取指定主题的颜色
export const getThemeColors = (theme: keyof typeof colorThemes = 'default'): string[] => {
  return colorThemes[theme] || colorThemes.default;
};

// 生成随机颜色
export const generateRandomColors = (count: number): string[] => {
  const colors: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const hue = (i * 137.508) % 360; // 黄金角度，确保颜色分布均匀
    const saturation = 60 + Math.random() * 20; // 60-80%
    const lightness = 45 + Math.random() * 20; // 45-65%
    
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
};

// 颜色对比度计算
export const getContrastRatio = (color1: string, color2: string): number => {
  // 简化的对比度计算
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// 计算颜色的相对亮度
const getLuminance = (color: string): number => {
  // 简化的亮度计算
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// 检查颜色是否足够亮（适合深色背景）
export const isLightColor = (color: string): boolean => {
  const luminance = getLuminance(color);
  return luminance > 0.5;
};

// 检查颜色是否足够暗（适合浅色背景）
export const isDarkColor = (color: string): boolean => {
  const luminance = getLuminance(color);
  return luminance < 0.5;
};

