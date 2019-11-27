
module.exports = {
    publicPath: './',
    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    productionSourceMap: undefined,
    parallel: undefined,
    chainWebpack: config => {
        // remove the prefetch plugin
        config.plugins.delete('prefetch')

    },
    devServer: {
        proxy: {
            '': {
                // target: 'https://www.scynyykj.com/',
                target: "http://118.190.245.101:8084/",
                // target:"http://27s540w789.zicp.vip:56976/",
                changeOrigin: true,
                cookieDomainRewrite: "localhost",
            }
        }
    }

}
