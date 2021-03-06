import localKey from './localKey'
// 192.168.88.18:81
const devApiUrl = 'https://www.scynyykj.com';//本地开发环境
// const devApiUrl = 'http://27s540w789.zicp.vip:56976';//本地开发环境
// const devApiUrl = 'http://www.miaomuxia.com:81';//本地开发环境
// const buildDevApiUrl = 'http://192.168.1.92:9088';//打包开发环境
// const buildTestApiUrl = 'http://192.168.1.92:6906';//打包测试环境
// const buildProApiUrl = 'http://www.miaomuxia.com:81';//打包正式环境
// const buildProApiUrl = 'http://27s540w789.zicp.vip:56976';//本地开发环境
const buildProApiUrl = "https://www.scynyykj.com";//本地开发环境


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
  siteName: '易脑永逸管理后台',
  minSiteMame: '易脑永逸',
  apiPrefix: "",
  timeout: 1200000,
  cookiesExpires: 7,
  requestRetry: 4,
  requestRetryDelay: 800,
  tokenKey: 'ACCESS_TOKEN',
  userInfoKey: 'USER_INFO',
  permissionsKey:'PERMISSION_ARRAY',
  gitHub: ' ',
  ...localKey
}
