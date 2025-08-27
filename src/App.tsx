import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProjectVariableProvider } from './hooks/useProjectVariable';
import { ConfigProvider, theme, App as AntdApp } from 'antd';
import AppRoutes from '@/Route';
import "./assets/styles/app.css";
import "./assets/styles/responsive.css";
import "./assets/styles/elchi.scss";
import { LoadingProvider } from '@/hooks/loadingContext';


const queryClient = new QueryClient()
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
            </AntdApp>
        </ConfigProvider>
    );
}

export default App;
