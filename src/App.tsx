import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProjectVariableProvider } from './hooks/useProjectVariable';
import { ConfigProvider, theme, App as AntdApp } from 'antd';
import AppRoutes from '@/Route';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import "./assets/styles/theme-variables.css";
import "./assets/styles/app.css";
import "./assets/styles/responsive.css";
import "./assets/styles/elchi.scss";
import { LoadingProvider } from '@/hooks/loadingContext';
import { setNotificationApi } from './common/notificationHandler';
import { useEffect } from 'react';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0, // Always refetch on mount
            gcTime: 5 * 60 * 1000, // 5 minutes - garbage collect unused queries
            refetchOnWindowFocus: false,
            retry: 1,
            retryDelay: 1000,
        },
    },
})

const AppContent = () => {
    const { notification } = AntdApp.useApp();

    useEffect(() => {
        setNotificationApi(notification);
    }, [notification]);

    return (
        <div className="App" key={"app"}>
            <QueryClientProvider client={queryClient}>
                <ProjectVariableProvider>
                    <HashRouter>
                        <LoadingProvider>
                            <AppRoutes />
                        </LoadingProvider>
                    </HashRouter>
                </ProjectVariableProvider>
            </QueryClientProvider>
        </div>
    );
};

const ThemedConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isDark } = useTheme();

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark
                    ? [theme.darkAlgorithm, theme.compactAlgorithm]
                    : theme.compactAlgorithm,
                components: {
                    Card: {
                        actionsBg: isDark ? "#334155" : "#1990FF",
                        actionsLiMargin: "4px"
                    }
                },
                token: isDark ? {
                    colorBgContainer: '#1e293b',
                    colorBgElevated: '#334155',
                    colorBgLayout: '#0f172a',
                    colorBorder: '#334155',
                    colorBorderSecondary: '#475569',
                    colorText: '#f1f5f9',
                    colorTextSecondary: '#94a3b8',
                    colorTextTertiary: '#64748b',
                    colorTextQuaternary: '#475569',
                    colorFill: '#334155',
                    colorFillSecondary: '#475569',
                    colorFillTertiary: '#1e293b',
                    colorFillQuaternary: '#0f172a',
                    colorBgSpotlight: '#334155',
                    colorPrimaryBg: '#1e3a5f',
                    colorPrimaryBgHover: '#1e40af',
                } : {}
            }}
        >
            {children}
        </ConfigProvider>
    );
};

function App() {
    return (
        <ThemeProvider>
            <ThemedConfigProvider>
                <AntdApp>
                    <AppContent />
                </AntdApp>
            </ThemedConfigProvider>
        </ThemeProvider>
    );
}

export default App;
