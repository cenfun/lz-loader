const path = require("path");
const StatsReportPlugin = require("webpack-stats-report").StatsReportPlugin;

module.exports = {
    //mode: "production",
    mode: "development",
    devtool: "source-map",
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
            test: /\.(json|txt)$/,
            type: "javascript/auto",
            use: {
                //loader: "lz-loader"
                loader: path.resolve(__dirname, "../"),
                options: {
                    esModule: false
                }
            }
        }]
    }
};