const Config = {
    basePath: '/',
    authPath: '/auth/',
    baseApi: '/api/v3/',
};

export type Version = typeof window.APP_CONFIG.AVAILABLE_VERSIONS[number];
export default Config;
