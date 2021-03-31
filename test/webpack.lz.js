const StatsReportPlugin = require("webpack-stats-report").StatsReportPlugin;

module.exports = {
    //mode: "production",
    mode: "development",
    devtool: "source-map",
    target: ["web", "es5"],
    output: {
        filename: "lz-loader-test.lz.js",
        umdNamedDefine: true,
        library: "lz-loader-test.lz",
        libraryTarget: "umd"
    },
    plugins: [new StatsReportPlugin({
        title: "Stats Report - lz-loader-test.lz",
        output: ".temp/stats-report.lz.html",
        outputStatsJson: true,
        generateMinifiedAndGzipSize: true
    })],
    module: {
        rules: [{
            test: /\.(js)$/,
            use: {
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: ["@babel/preset-env"]
                }
            }
        }, {
            test: /\.css$/,
            use: [{
                loader: "style-loader",
                options: {
                    injectType: "singletonStyleTag"
                }
            }, {
                loader: "css-loader",
                options: {
                    esModule: false,
                    import: false,
                    sourceMap: false
                }
            }]
        }, {
            test: /\.(json|txt|svg)$/,
            type: "javascript/auto",
            use: {
                loader: "lz-loader",
                options: {
                    esModule: false
                }
            }
        }]
    }
};