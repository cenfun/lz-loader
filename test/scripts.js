const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const shelljs = require("shelljs");
const webpack = require("webpack");
const StatsReportPlugin = require("webpack-stats-report").StatsReportPlugin;

const link = function() {
    const nPath = path.resolve(__dirname, "node_modules/lz-loader/");
    if (fs.existsSync(nPath)) {
        rimraf.sync(nPath);
    }

    fs.mkdirSync(nPath);

    const fileList = {
        "package.json": "",
        "README.md": "",
        "dist/cjs.js": "dist/",
        "dist/options.json": "dist/",
        "dist/runtime/compress.js": "dist/runtime/",
        "dist/runtime/decompress.js": "dist/runtime/"
    };

    Object.keys(fileList).forEach(key => {
        const fp = path.resolve(__dirname, "../", key);
        if (fs.existsSync(fp)) {
            const des = path.resolve(nPath, fileList[key]);
            if (!fs.existsSync(des)) {
                fs.mkdirSync(des);
            }
            shelljs.cp("-R", fp, des);
        }
    });

};

const createWebpackConf = function(option) {
    const conf = {
        entry: path.resolve(option.entry),
        mode: option.mode,
        cache: false,
        devtool: "source-map",
        target: ["web", "es5"],
        output: {
            filename: `${option.name}.js`,
            umdNamedDefine: true,
            library: option.name,
            libraryTarget: "umd"
        },
        plugins: [new StatsReportPlugin({
            title: `Stats Report - ${option.name}`,
            output: `.temp/${option.name}.html`,
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
            }]
        }
    };

    if (option.lz) {

        conf.module.rules.push({
            test: /\.css$/,
            use: [{
                loader: "style-loader",
                options: {
                    injectType: "singletonStyleTag"
                }
            }, {
                loader: "lz-loader",
                options: {
                    esModule: false,
                    cssLoader: true
                }
            }, {
                loader: "css-loader",
                options: {
                    esModule: false,
                    import: false,
                    sourceMap: false
                }
            }]
        });

        conf.module.rules.push({
            test: /\.(json|txt|svg)$/,
            type: "javascript/auto",
            use: {
                loader: "lz-loader",
                options: {
                    esModule: false
                }
            }
        });

    } else {

        conf.module.rules.push({
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
        });

        conf.module.rules.push({
            test: /\.(txt|svg)$/,
            type: "asset/source"
        });

    }

    return conf;
};


const buildItem = function(item) {
    return new Promise((resolve) => {

        const now = new Date().getTime();

        const conf = createWebpackConf(item);
        webpack(conf, function(err, stats) {
            if (err) {
                console.log(err);
            }

            const cost = (new Date().getTime() - now).toLocaleString();
            console.log(`build ${item.name} cost: ${cost}ms`);

            resolve();
        });
    });
};

const build = async function() {
    link();
    
    const list = [{
        name: "css-development-normal",
        entry: "src/case-css.js",
        mode: "development"
    }, {
        name: "css-production-normal",
        entry: "src/case-css.js",
        mode: "production"
    }, {
        name: "css-development-lz",
        entry: "src/case-css.js",
        mode: "development",
        lz: true
    }, {
        name: "css-production-lz",
        entry: "src/case-css.js",
        mode: "production",
        lz: true
    }, {
        name: "lz-loader-normal",
        entry: "src/index.js",
        mode: "production"
    }, {
        name: "lz-loader-lz",
        entry: "src/index.js",
        mode: "production",
        lz: true
    }];

    for (const item of list) {
        await buildItem(item);
    }

};


build();