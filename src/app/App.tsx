import React from 'react';
import { useUIStore } from '@/store';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MainContent from '@/components/layout/MainContent';
import NotificationContainer from '@/components/ui/NotificationContainer';

const App: React.FC = () => {
  const { theme, sidebarOpen } = useUIStore();

  return (
    <div className={`min-h-screen bg-gray-50 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen">
        {/* 侧边栏 */}
        <Sidebar />
        
        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 头部 */}
          <Header />
          
          {/* 主内容 */}
          <MainContent />
        </div>
      </div>
      
      {/* 通知容器 */}
      <NotificationContainer />
    </div>
  );
};

export default App;
