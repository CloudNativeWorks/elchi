import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProjectVariableProvider } from './hooks/useProjectVariable';
import { ConfigProvider, theme, App as AntdApp } from 'antd';
import AppRoutes from '@/Route';
import "./assets/styles/app.css";
import "./assets/styles/responsive.css";
import "./assets/styles/elchi.scss";
import { LoadingProvider } from '@/hooks/loadingContext';
import { setNotificationApi } from './common/notificationHandler';
import { useEffect } from 'react';


const queryClient = new QueryClient()

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

function App() {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.compactAlgorithm,
                components: {
                    Card: {
                        actionsBg: "#1990FF",
                        actionsLiMargin: "4px"
                    }
                }
            }}
        >
            <AntdApp>
                <AppContent />
            </AntdApp>
        </ConfigProvider>
    );
}

export default App;
