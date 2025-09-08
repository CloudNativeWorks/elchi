const Config = {
    basePath: '/',
    authPath: '/auth/',
    baseApi: '/api/v3/',
};

export type Version = typeof window.APP_CONFIG.AVAILABLE_VERSIONS[number];
export const defaultVersion = window.APP_CONFIG.AVAILABLE_VERSIONS[0];
export default Config;
