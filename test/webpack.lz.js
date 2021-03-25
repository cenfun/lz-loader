const path = require("path");
const StatsReportPlugin = require("webpack-stats-report").StatsReportPlugin;

module.exports = {
    //mode: "production",
    mode: "development",
    devtool: "source-map",
    output: {
        filename: "lz-string-loader-test.lz.js",
        umdNamedDefine: true,
        library: "lz-string-loader-test.lz",
        libraryTarget: "umd"
    },
    plugins: [new StatsReportPlugin({
        title: "Stats Report - lz-string-loader-test.lz",
        output: ".temp/stats-report.lz.html",
        outputStatsJson: true,
        generateMinifiedAndGzipSize: true
    })],
    module: {
        rules: [{
            test: /\.(json|txt)$/,
            type: "javascript/auto",
            //loader: "lz-string-loader"
            loader: path.resolve(__dirname, "../")
        }]
    }
};