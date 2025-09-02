import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UIState } from '@/app/types';
import { DEFAULT_STYLES } from '@/app/config';

interface UIStoreState extends UIState {
  // 操作
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setActiveModal: (modalId: string | null) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 通知系统
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    createdAt: Date;
  }>;
  addNotification: (notification: Omit<UIStoreState['notifications'][0], 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // 面包屑导航
  breadcrumbs: Array<{
    label: string;
    path?: string;
    onClick?: () => void;
  }>;
  setBreadcrumbs: (breadcrumbs: UIStoreState['breadcrumbs']) => void;
  addBreadcrumb: (breadcrumb: UIStoreState['breadcrumbs'][0]) => void;
  clearBreadcrumbs: () => void;
  
  // 工具方法
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

export const useUIStore = create<UIStoreState>()(
  devtools(
    (set, get) => ({
      // 初始状态
      theme: DEFAULT_STYLES.ui.theme,
      sidebarOpen: DEFAULT_STYLES.ui.sidebarOpen,
      activeModal: DEFAULT_STYLES.ui.activeModal,
      loading: DEFAULT_STYLES.ui.loading,
      error: DEFAULT_STYLES.ui.error,
      notifications: [],
      breadcrumbs: [],
      
      // 主题操作
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        // 保存到localStorage
        localStorage.setItem('flexbi_theme', theme);
        // 应用到document
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      // 侧边栏操作
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },
      
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },
      
      // 弹窗操作
      setActiveModal: (modalId: string | null) => {
        set({ activeModal: modalId });
      },
      
      openModal: (modalId: string) => {
        set({ activeModal: modalId });
      },
      
      closeModal: () => {
        set({ activeModal: null });
      },
      
      // 加载状态
      setLoading: (loading: boolean) => {
        set({ loading });
      },
      
      // 错误处理
      setError: (error: string | null) => {
        set({ error });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      // 通知系统
      addNotification: (notification) => {
        const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newNotification = {
          ...notification,
          id,
          createdAt: new Date(),
        };
        
        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));
        
        // 自动移除通知
        if (notification.duration !== 0) {
          const duration = notification.duration || 5000; // 默认5秒
          setTimeout(() => {
            get().removeNotification(id);
          }, duration);
        }
      },
      
      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
      
      // 面包屑导航
      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs });
      },
      
      addBreadcrumb: (breadcrumb) => {
        set(state => ({
          breadcrumbs: [...state.breadcrumbs, breadcrumb],
        }));
      },
      
      clearBreadcrumbs: () => {
        set({ breadcrumbs: [] });
      },
      
      // 便捷方法
      showSuccess: (message: string, title: string = '成功') => {
        get().addNotification({
          type: 'success',
          title,
          message,
          duration: 3000,
        });
      },
      
      showError: (message: string, title: string = '错误') => {
        get().addNotification({
          type: 'error',
          title,
          message,
          duration: 5000,
        });
      },
      
      showWarning: (message: string, title: string = '警告') => {
        get().addNotification({
          type: 'warning',
          title,
          message,
          duration: 4000,
        });
      },
      
      showInfo: (message: string, title: string = '信息') => {
        get().addNotification({
          type: 'info',
          title,
          message,
          duration: 3000,
        });
      },
    }),
    {
      name: 'ui-store',
    }
  )
);

// 初始化主题
const savedTheme = localStorage.getItem('flexbi_theme') as 'light' | 'dark';
if (savedTheme) {
  useUIStore.getState().setTheme(savedTheme);
}
