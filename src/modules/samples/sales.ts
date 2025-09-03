import { Field, DataRow, Dataset } from '@/app/types';

// 销售数据字段定义
export const salesFields: Field[] = [
  {
    key: 'date',
    name: 'date',
    type: 'date',
    uniqueValues: 12
  },
  {
    key: 'product',
    name: 'product',
    type: 'string',
    uniqueValues: 4
  },
  {
    key: 'region',
    name: 'region',
    type: 'string',
    uniqueValues: 3
  },
  {
    key: 'sales',
    name: 'sales',
    type: 'number',
    uniqueValues: 36
  },
  {
    key: 'quantity',
    name: 'quantity',
    type: 'number',
    uniqueValues: 36
  },
  {
    key: 'profit',
    name: 'profit',
    type: 'number',
    uniqueValues: 36
  }
];

// 生成销售数据
export const generateSalesData = (): DataRow[] => {
  const products = ['笔记本电脑', '智能手机', '平板电脑', '智能手表'];
  const regions = ['华东', '华南', '华北'];
  const months = [
    '2024-01-01', '2024-02-01', '2024-03-01', '2024-04-01',
    '2024-05-01', '2024-06-01', '2024-07-01', '2024-08-01',
    '2024-09-01', '2024-10-01', '2024-11-01', '2024-12-01'
  ];

  const data: DataRow[] = [];

  products.forEach(product => {
    regions.forEach(region => {
      months.forEach(month => {
        // 基础销量（不同产品有不同基础销量）
        const baseSales = {
          '笔记本电脑': 120,
          '智能手机': 200,
          '平板电脑': 80,
          '智能手表': 150
        }[product] || 100;

        // 地区影响因子
        const regionFactor = {
          '华东': 1.2,
          '华南': 1.0,
          '华北': 0.9
        }[region] || 1.0;

        // 季节性影响（夏季和冬季销量较高）
        const monthNum = new Date(month).getMonth();
        const seasonalFactor = monthNum >= 5 && monthNum <= 8 ? 1.3 : 
                             monthNum >= 11 || monthNum <= 1 ? 1.2 : 1.0;

        // 计算最终销量
        const sales = Math.round(baseSales * regionFactor * seasonalFactor * (0.8 + Math.random() * 0.4));
        const quantity = Math.round(sales / (100 + Math.random() * 50));
        const profit = Math.round(sales * (0.15 + Math.random() * 0.1));

        data.push({
          date: new Date(month),
          product,
          region,
          sales,
          quantity,
          profit
        });
      });
    });
  });

  return data;
};

// 预生成的销售数据
export const salesData: DataRow[] = [
  { date: new Date('2024-01-01'), product: '笔记本电脑', region: '华东', sales: 144, quantity: 1, profit: 22 },
  { date: new Date('2024-01-01'), product: '笔记本电脑', region: '华南', sales: 120, quantity: 1, profit: 18 },
  { date: new Date('2024-01-01'), product: '笔记本电脑', region: '华北', sales: 108, quantity: 1, profit: 16 },
  { date: new Date('2024-01-01'), product: '智能手机', region: '华东', sales: 240, quantity: 2, profit: 36 },
  { date: new Date('2024-01-01'), product: '智能手机', region: '华南', sales: 200, quantity: 2, profit: 30 },
  { date: new Date('2024-01-01'), product: '智能手机', region: '华北', sales: 180, quantity: 2, profit: 27 },
  { date: new Date('2024-01-01'), product: '平板电脑', region: '华东', sales: 96, quantity: 1, profit: 14 },
  { date: new Date('2024-01-01'), product: '平板电脑', region: '华南', sales: 80, quantity: 1, profit: 12 },
  { date: new Date('2024-01-01'), product: '平板电脑', region: '华北', sales: 72, quantity: 1, profit: 11 },
  { date: new Date('2024-01-01'), product: '智能手表', region: '华东', sales: 180, quantity: 1, profit: 27 },
  { date: new Date('2024-01-01'), product: '智能手表', region: '华南', sales: 150, quantity: 1, profit: 23 },
  { date: new Date('2024-01-01'), product: '智能手表', region: '华北', sales: 135, quantity: 1, profit: 20 },
  
  { date: new Date('2024-02-01'), product: '笔记本电脑', region: '华东', sales: 132, quantity: 1, profit: 20 },
  { date: new Date('2024-02-01'), product: '笔记本电脑', region: '华南', sales: 110, quantity: 1, profit: 17 },
  { date: new Date('2024-02-01'), product: '笔记本电脑', region: '华北', sales: 99, quantity: 1, profit: 15 },
  { date: new Date('2024-02-01'), product: '智能手机', region: '华东', sales: 220, quantity: 2, profit: 33 },
  { date: new Date('2024-02-01'), product: '智能手机', region: '华南', sales: 183, quantity: 2, profit: 27 },
  { date: new Date('2024-02-01'), product: '智能手机', region: '华北', sales: 165, quantity: 2, profit: 25 },
  { date: new Date('2024-02-01'), product: '平板电脑', region: '华东', sales: 88, quantity: 1, profit: 13 },
  { date: new Date('2024-02-01'), product: '平板电脑', region: '华南', sales: 73, quantity: 1, profit: 11 },
  { date: new Date('2024-02-01'), product: '平板电脑', region: '华北', sales: 66, quantity: 1, profit: 10 },
  { date: new Date('2024-02-01'), product: '智能手表', region: '华东', sales: 165, quantity: 1, profit: 25 },
  { date: new Date('2024-02-01'), product: '智能手表', region: '华南', sales: 138, quantity: 1, profit: 21 },
  { date: new Date('2024-02-01'), product: '智能手表', region: '华北', sales: 124, quantity: 1, profit: 19 },
  
  { date: new Date('2024-03-01'), product: '笔记本电脑', region: '华东', sales: 156, quantity: 1, profit: 23 },
  { date: new Date('2024-03-01'), product: '笔记本电脑', region: '华南', sales: 130, quantity: 1, profit: 20 },
  { date: new Date('2024-03-01'), product: '笔记本电脑', region: '华北', sales: 117, quantity: 1, profit: 18 },
  { date: new Date('2024-03-01'), product: '智能手机', region: '华东', sales: 260, quantity: 2, profit: 39 },
  { date: new Date('2024-03-01'), product: '智能手机', region: '华南', sales: 217, quantity: 2, profit: 33 },
  { date: new Date('2024-03-01'), product: '智能手机', region: '华北', sales: 195, quantity: 2, profit: 29 },
  { date: new Date('2024-03-01'), product: '平板电脑', region: '华东', sales: 104, quantity: 1, profit: 16 },
  { date: new Date('2024-03-01'), product: '平板电脑', region: '华南', sales: 87, quantity: 1, profit: 13 },
  { date: new Date('2024-03-01'), product: '平板电脑', region: '华北', sales: 78, quantity: 1, profit: 12 },
  { date: new Date('2024-03-01'), product: '智能手表', region: '华东', sales: 195, quantity: 1, profit: 29 },
  { date: new Date('2024-03-01'), product: '智能手表', region: '华南', sales: 163, quantity: 1, profit: 24 },
  { date: new Date('2024-03-01'), product: '智能手表', region: '华北', sales: 146, quantity: 1, profit: 22 }
];

// 获取演示数据
export const getSampleData = () => {
  return {
    fields: salesFields,
    rows: salesData,
    name: '销售数据示例',
    description: '包含2024年各产品在各地区的销售数据'
  };
};

// 销售数据演示集
export const sampleSalesData: Dataset = {
  id: 'sample_sales',
  name: '销售数据演示',
  fields: salesFields,
  rows: salesData,
  rowCount: salesData.length,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-12-01'),
};

/**
 * 用户数据演示集
 */
export const sampleUserData: Dataset = {
  id: 'sample_users',
  name: '用户数据演示',
  fields: [
    {
      key: 'user_id',
      name: '用户ID',
      type: 'string',
      uniqueValues: 100,
      sampleValues: ['U001', 'U002', 'U003'],
    },
    {
      key: 'age',
      name: '年龄',
      type: 'number',
      uniqueValues: 45,
      sampleValues: [25, 32, 28],
    },
    {
      key: 'gender',
      name: '性别',
      type: 'string',
      uniqueValues: 2,
      sampleValues: ['男', '女'],
    },
    {
      key: 'city',
      name: '城市',
      type: 'string',
      uniqueValues: 8,
      sampleValues: ['北京', '上海', '广州'],
    },
    {
      key: 'register_date',
      name: '注册时间',
      type: 'date',
      uniqueValues: 100,
      sampleValues: ['2023-01-15', '2023-03-20', '2023-06-10'],
    },
    {
      key: 'activity',
      name: '活跃度',
      type: 'number',
      uniqueValues: 100,
      sampleValues: [85, 92, 78],
    },
  ],
  rows: [
    ['U001', 25, '男', '北京', '2023-01-15', 85],
    ['U002', 32, '女', '上海', '2023-03-20', 92],
    ['U003', 28, '男', '广州', '2023-06-10', 78],
    ['U004', 35, '女', '深圳', '2023-02-08', 88],
    ['U005', 29, '男', '杭州', '2023-04-12', 95],
    ['U006', 31, '女', '南京', '2023-07-25', 82],
    ['U007', 27, '男', '成都', '2023-05-18', 90],
    ['U008', 33, '女', '武汉', '2023-08-30', 87],
    ['U009', 26, '男', '西安', '2023-09-14', 93],
    ['U010', 30, '女', '重庆', '2023-10-22', 79],
  ],
  rowCount: 10,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-12-01'),
};

/**
 * 获取所有演示数据集
 */
export function getSampleDatasets(): Dataset[] {
  return [sampleSalesData, sampleUserData];
}

/**
 * 根据ID获取演示数据集
 */
export function getSampleDatasetById(id: string): Dataset | undefined {
  return getSampleDatasets().find(dataset => dataset.id === id);
}
