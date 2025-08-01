import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App';
import "./assets/styles/index.css";
import 'antd/dist/reset.css';
import { Provider } from 'react-redux';
import store from "./redux/store";

const consoleError = console.error.bind(console);
console.error = (errObj, ...args) => {
    if (args.includes('findDOMNode')) {
        return;
    }
    consoleError(errObj, ...args);
};
const rootElement = document.getElementById('root');

declare global {/* eslint-disable no-unused-vars */
    interface Window {
        APP_CONFIG: {
            API_URL: string;
            API_URL_LOCAL: string;
            ENABLE_DEMO: boolean;
            AVAILABLE_VERSIONS: string[];
            VERSION: string;
        }
    }
}

if (rootElement) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        isDevelopment ? (
            <React.StrictMode>
                <Provider store={store}>
                    <App />
                </Provider>
            </React.StrictMode>
        ) : (
            <Provider store={store}>
                <App />
            </Provider>
        )
    );
} else {
    console.error("Root element not found");
}
