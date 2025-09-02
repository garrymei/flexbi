import React from 'react';

// 路由配置类型
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  icon?: string;
  children?: RouteConfig[];
}

// 主路由配置
export const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => <div>首页</div>,
    title: '首页',
    icon: '🏠'
  },
  {
    path: '/dataset',
    component: () => <div>数据管理</div>,
    title: '数据管理',
    icon: '📊'
  },
  {
    path: '/charts',
    component: () => <div>图表制作</div>,
    title: '图表制作',
    icon: '📈'
  },
  {
    path: '/templates',
    component: () => <div>模板管理</div>,
    title: '模板管理',
    icon: '📋'
  }
];

export default routes;

