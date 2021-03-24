const path = require("path");
const StatsReportPlugin = require("webpack-stats-report").StatsReportPlugin;

module.exports = {
    //mode: "production",
    mode: "development",
    devtool: "source-map",
    output: {
        filename: "lz-string-loader-test.js",
        umdNamedDefine: true,
        library: "lz-string-loader-test",
        libraryTarget: "umd"
    },
    plugins: [new StatsReportPlugin({
        title: "Stats Report - lz-string-loader-test",
        output: ".temp/stats-report.html",
        outputStatsJson: true,
        generateMinifiedAndGzipSize: true
    })],
    module: {
        rules: [{
            test: /\.(json|txt)$/,
            //loader: "lz-string-loader"
            loader: path.resolve(__dirname, "../dist/cjs.js")
        }]
    }
};