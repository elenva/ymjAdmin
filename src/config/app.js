import localKey from './localKey'

// const devApiUrl = 'http://gj26975614.wicp.vip:11842';//本地开发环境
const devApiUrl = 'http://www.miaomuxia.com:81';//本地开发环境
const buildDevApiUrl = 'http://192.168.1.92:9088';//打包开发环境
const buildTestApiUrl = 'http://192.168.1.92:6906';//打包测试环境
const buildProApiUrl = 'http://www.miaomuxia.com:81';//打包正式环境


let useApiUrl;

switch (process.env.NODE_ENV) {
  case 'development':
    useApiUrl = devApiUrl;
    break;
  case 'buildDev':
    useApiUrl = buildDevApiUrl;
    break;
  case 'buildTest':
    useApiUrl = buildTestApiUrl;
    break;
  case 'production':
    useApiUrl = buildProApiUrl;
    break;
}

export default {
  nodeDevEnv: process.env.NODE_ENV == 'development',
  apiUrl: useApiUrl,
  siteName: '虞美家管理后台',
  minSiteMame: '虞美家',
  apiPrefix: "",
  timeout: 120000,
  cookiesExpires: 7,
  requestRetry: 4,
  requestRetryDelay: 800,
  tokenKey: 'ACCESS_TOKEN',
  userInfoKey: 'USER_INFO',
  permissionsKey:'PERMISSION_ARRAY',
  gitHub: ' ',
  ...localKey
}
