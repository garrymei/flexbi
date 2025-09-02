import React from 'react';
import { clsx } from 'clsx';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description = '这里还没有任何内容',
  icon,
  action,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  };

  const iconSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const defaultIcon = (
    <svg 
      className={clsx('text-gray-400', iconSizeClasses[size])} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <div className={clsx('text-center', sizeClasses[size])}>
      {icon || defaultIcon}
      
      <h3 className={clsx(
        'mt-4 font-medium text-gray-900',
        size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={clsx(
          'mt-2 text-gray-500',
          size === 'sm' ? 'text-sm' : 'text-base'
        )}>
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

// 预定义的常用空状态
export const EmptyStateVariants = {
  // 无数据
  NoData: (props: Omit<EmptyStateProps, 'title' | 'description' | 'icon'>) => (
    <EmptyState
      title="暂无数据"
      description="这里还没有任何数据，请先导入或创建一些数据"
      icon={
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      }
      {...props}
    />
  ),

  // 无搜索结果
  NoSearchResults: (props: Omit<EmptyStateProps, 'title' | 'description' | 'icon'>) => (
    <EmptyState
      title="未找到搜索结果"
      description="尝试调整搜索条件或关键词"
      icon={
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      {...props}
    />
  ),

  // 无权限
  NoPermission: (props: Omit<EmptyStateProps, 'title' | 'description' | 'icon'>) => (
    <EmptyState
      title="无访问权限"
      description="您没有权限访问此内容，请联系管理员"
      icon={
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      }
      {...props}
    />
  ),

  // 加载失败
  LoadFailed: (props: Omit<EmptyStateProps, 'title' | 'description' | 'icon'>) => (
    <EmptyState
      title="加载失败"
      description="数据加载出现问题，请稍后重试"
      icon={
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      {...props}
    />
  )
};

export default EmptyState;
