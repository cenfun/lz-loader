const StatsReportPlugin = require("webpack-stats-report").StatsReportPlugin;

module.exports = {
    //mode: "production",
    mode: "development",
    devtool: "source-map",
    output: {
        filename: "lz-string-loader-test.normal.js",
        umdNamedDefine: true,
        library: "lz-string-loader-test.normal",
        libraryTarget: "umd"
    },
    plugins: [new StatsReportPlugin({
        title: "Stats Report - lz-string-loader-test.normal",
        output: ".temp/stats-report.normal.html",
        outputStatsJson: true,
        generateMinifiedAndGzipSize: true
    })],
    module: {
        rules: [{
            test: /\.(txt)$/,
            type: "asset/source"
        }]
    }
};