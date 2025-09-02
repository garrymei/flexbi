import { Field, Dataset } from '@/app/types';

// 场景1: 时间序列 + 数值 + 分类（用于 line/area/bar）
export const salesData: Dataset = {
  name: '销售数据',
  fields: [
    { key: 'date', type: 'date', uniqueValues: 12 },
    { key: 'sales', type: 'number', uniqueValues: 50 },
    { key: 'region', type: 'string', uniqueValues: 4 }
  ],
  rows: [
    { date: '2024-01', sales: 1200, region: '华东' },
    { date: '2024-01', sales: 980, region: '华北' },
    { date: '2024-01', sales: 850, region: '华南' },
    { date: '2024-01', sales: 1100, region: '西部' },
    { date: '2024-02', sales: 1350, region: '华东' },
    { date: '2024-02', sales: 1050, region: '华北' },
    { date: '2024-02', sales: 920, region: '华南' },
    { date: '2024-02', sales: 1250, region: '西部' },
    { date: '2024-03', sales: 1500, region: '华东' },
    { date: '2024-03', sales: 1150, region: '华北' },
    { date: '2024-03', sales: 980, region: '华南' },
    { date: '2024-03', sales: 1400, region: '西部' },
    { date: '2024-04', sales: 1400, region: '华东' },
    { date: '2024-04', sales: 1100, region: '华北' },
    { date: '2024-04', sales: 950, region: '华南' },
    { date: '2024-04', sales: 1300, region: '西部' },
    { date: '2024-05', sales: 1600, region: '华东' },
    { date: '2024-05', sales: 1250, region: '华北' },
    { date: '2024-05', sales: 1050, region: '华南' },
    { date: '2024-05', sales: 1500, region: '西部' },
    { date: '2024-06', sales: 1800, region: '华东' },
    { date: '2024-06', sales: 1400, region: '华北' },
    { date: '2024-06', sales: 1200, region: '华南' },
    { date: '2024-06', sales: 1700, region: '西部' }
  ]
};

// 场景2: 仅分类 + 数值（pie）
export const productData: Dataset = {
  name: '产品销量',
  fields: [
    { key: 'product', type: 'string', uniqueValues: 6 },
    { key: 'sales', type: 'number', uniqueValues: 6 }
  ],
  rows: [
    { product: '笔记本电脑', sales: 1250 },
    { product: '智能手机', sales: 2100 },
    { product: '平板电脑', sales: 800 },
    { product: '智能手表', sales: 600 },
    { product: '耳机', sales: 950 },
    { product: '其他配件', sales: 400 }
  ]
};

// 场景3: 双数值（scatter）
export const correlationData: Dataset = {
  name: '相关性分析',
  fields: [
    { key: 'age', type: 'number', uniqueValues: 20 },
    { key: 'income', type: 'number', uniqueValues: 20 },
    { key: 'education', type: 'string', uniqueValues: 3 }
  ],
  rows: [
    { age: 25, income: 35000, education: '本科' },
    { age: 30, income: 45000, education: '本科' },
    { age: 35, income: 55000, education: '硕士' },
    { age: 28, income: 40000, education: '本科' },
    { age: 32, income: 50000, education: '硕士' },
    { age: 27, income: 38000, education: '本科' },
    { age: 33, income: 52000, education: '硕士' },
    { age: 29, income: 42000, education: '本科' },
    { age: 31, income: 48000, education: '硕士' },
    { age: 26, income: 36000, education: '本科' },
    { age: 34, income: 58000, education: '博士' },
    { age: 36, income: 60000, education: '博士' },
    { age: 38, income: 65000, education: '博士' },
    { age: 40, income: 70000, education: '博士' },
    { age: 42, income: 75000, education: '博士' },
    { age: 45, income: 80000, education: '博士' },
    { age: 48, income: 85000, education: '博士' },
    { age: 50, income: 90000, education: '博士' },
    { age: 52, income: 95000, education: '博士' },
    { age: 55, income: 100000, education: '博士' }
  ]
};

// 获取所有示例数据
export const getAllSampleData = (): Dataset[] => {
  return [salesData, productData, correlationData];
};

// 根据名称获取示例数据
export const getSampleDataByName = (name: string): Dataset | undefined => {
  return getAllSampleData().find(dataset => dataset.name === name);
};

// 获取示例数据名称列表
export const getSampleDataNames = (): string[] => {
  return getAllSampleData().map(dataset => dataset.name);
};
