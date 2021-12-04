const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const shelljs = require('shelljs');
const webpack = require('webpack');
const StatsReportPlugin = require('webpack-stats-report').StatsReportPlugin;
const ConsoleGrid = require('console-grid');

//'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'
const EC = require('eight-colors');
const consoleGrid = new ConsoleGrid();

const distPath = path.resolve(__dirname, 'dist');
const tempPath = path.resolve(__dirname, '.temp');

const logColor = function(color, msg) {
    const fn = EC[color];
    if (typeof (fn) === 'function') {
        msg = fn(msg);
    }
    console.log(msg);
    return msg;
};

const logRed = function(msg) {
    return logColor('red', msg);
};

const logYellow = function(msg) {
    return logColor('yellow', msg);
};

const logGreen = function(msg) {
    return logColor('green', msg);
};

const BF = function(v, digits = 1, base = 1024) {
    if (v === 0) {
        return '0 B';
    }
    let prefix = '';
    if (v < 0) {
        v = Math.abs(v);
        prefix = '-';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    for (let i = 0, l = units.length; i < l; i++) {
        const min = Math.pow(base, i);
        const max = Math.pow(base, i + 1);
        if (v > min && v < max) {
            const unit = ` ${units[i]}`;
            v = prefix + (v / min).toFixed(digits) + unit;
            break;
        }
    }
    return v;
};


const link = function() {
    
    const nPath = path.resolve(__dirname, '../node_modules/lz-loader/');
    console.log(`linking lz-loader: ${nPath}`);

    if (fs.existsSync(nPath)) {
        console.log('removing previous lz-loader ...');
        rimraf.sync(nPath);
    }

    fs.mkdirSync(nPath);

    const fileList = {
        'package.json': '',
        'README.md': '',
        'dist/cjs.js': 'dist/',
        'dist/options.json': 'dist/',
        'dist/runtime/compress.js': 'dist/runtime/',
        'dist/runtime/decompress.js': 'dist/runtime/',
        'dist/compressors/common.js': 'dist/compressors/',
        'dist/compressors/css-loader.js': 'dist/compressors/'
    };

    Object.keys(fileList).forEach(key => {
        const fp = path.resolve(__dirname, '../', key);
        if (fs.existsSync(fp)) {
            const des = path.resolve(nPath, fileList[key]);
            if (!fs.existsSync(des)) {
                fs.mkdirSync(des);
            }
            shelljs.cp('-R', fp, des);
        }
    });

    logGreen(`linked lz-loader: ${nPath}`);

};

const createWebpackConf = function(item) {

    const name = item.name;
    
    const conf = {
        entry: path.resolve(__dirname, item.entry),
        mode: item.mode,
        cache: false,
        devtool: 'source-map',
        target: ['web', 'es5'],
        output: {
            filename: `${name}.js`,
            path: distPath,
            umdNamedDefine: true,
            library: name,
            libraryTarget: 'umd'
        },
        plugins: [new StatsReportPlugin({
            title: `Stats Report - ${name}`,
            output: path.resolve(tempPath, `stats-report-${name}.html`),
            outputStatsJson: true,
            generateMinifiedAndGzipSize: true
        })],
        module: {
            rules: [{
                test: /\.(js)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: ['@babel/preset-env']
                    }
                }
            }]
        }
    };

    if (item.lz) {

        conf.module.rules.push({
            test: /\.css$/,
            use: [{
                loader: 'style-loader',
                options: {
                    injectType: 'singletonStyleTag'
                }
            }, {
                loader: 'lz-loader',
                options: {
                    esModule: false,
                    compressor: function(source, compress, decompressPath, options) {
                        console.log('test custom compressor:');
                        console.log(decompressPath, options);
                        return source;
                    }
                }
            }, {
                loader: 'lz-loader',
                options: {
                    esModule: false,
                    compressor: 'css-loader'
                }
            }, {
                loader: 'css-loader',
                options: {
                    esModule: false,
                    import: false,
                    sourceMap: false
                }
            }]
        });

        conf.module.rules.push({
            test: /\.(json|txt|svg)$/,
            type: 'javascript/auto',
            use: {
                loader: 'lz-loader',
                options: {
                    esModule: false
                }
            }
        });

    } else {

        conf.module.rules.push({
            test: /\.css$/,
            use: [{
                loader: 'style-loader',
                options: {
                    injectType: 'singletonStyleTag'
                }
            }, {
                loader: 'css-loader',
                options: {
                    esModule: false,
                    import: false,
                    sourceMap: false
                }
            }]
        });

        conf.module.rules.push({
            test: /\.(txt|svg)$/,
            type: 'asset/source'
        });

    }

    return conf;
};


const buildItem = function(item) {
    return new Promise((resolve) => {

        console.log(`building ${item.name}: ${item.entry}`);
        const now = new Date().getTime();

        const conf = createWebpackConf(item);
        webpack(conf, function(err, stats) {

            // error for webpack self
            if (err) {
                logRed(err.stack || err);
                if (err.details) {
                    logRed(err.details);
                }
                resolve(1);
                return;
            }

            const info = stats.toJson({
                source: false,
                reasons: false,
                chunkModules: false
            });

            // error for project
            if (stats.hasErrors()) {
                logRed(`ERROR: Found ${info.errors.length} Errors on building ${item.name}`);
                info.errors.forEach(function(it, i) {
                    const msg = it.stack || it.message;
                    logRed(`【${i + 1}】 ${msg}`);
                });
                resolve(1);
                return;
            }

            if (stats.hasWarnings()) {
                logYellow(`WARN: Found ${info.warnings.length} Warnings on building ${item.name}`);
                info.warnings.forEach(function(it, i) {
                    const msg = it.message || it.stack;
                    logYellow(`【${i + 1}】 ${msg}`);
                });
            }

            const duration = `${(new Date().getTime() - now).toLocaleString()} ms`;
            item.duration = duration;
            logGreen(`built ${item.name} cost: ${duration}`);

            const file = path.resolve(conf.output.path, conf.output.filename);
            const stat = fs.statSync(file);
            item.size = stat.size;
            
            resolve(0);

        });
    });
};

const build = async function() {

    // if (fs.existsSync(distPath)) {
    //     console.log(`removing previous dist: ${distPath}`);
    //     rimraf.sync(distPath);
    // }

    link();
    
    const typeList = [
        {
            type: 'css',
            entry: 'src/case-css.js'
        },
        {
            type: 'json',
            entry: 'src/case-json.js'
        },
        {
            type: 'svg',
            entry: 'src/case-svg.js'
        },
        {
            type: 'text',
            entry: 'src/case-text.js'
        },
        {
            type: 'mixed',
            entry: 'src/index.js'
        }
    ];

    const modeList = [
        'development',
        'production'
    ];
    const lzList = [
        false,
        true
    ];

    const list = [];
    typeList.forEach(t => {
        modeList.forEach(mode => {
            lzList.forEach(lz => {
                const item = {
                    ... t
                };
                item.mode = mode;
                item.lz = lz;
                const arr = [item.type, item.mode];
                if (item.lz) {
                    arr.push('lz');
                }
                item.name = arr.join('-');
                list.push(item);
            });
        });
    });

    for (const job of list) {
        const code = await buildItem(job);
        if (code) {
            process.exit(1);
        }
    }

    //report
    //console.log(list);

    const rows = [];
    //update reduced
    list.forEach((item, i) => {
        rows.push(item);
        if (item.lz) {
            const prev = list[i - 1];
            item.reduced = `${((prev.size - item.size) / prev.size * 100).toFixed(2)}%`;
            if (i !== list.length - 1) {
                rows.push({
                    innerBorder: true
                });
            }
        }
    });

    typeList.forEach(item => {
        console.log(`* ${item.type}: [test/${item.entry}](test/${item.entry})`);
    });

    consoleGrid.render({
        option: {},
        columns: [{
            id: 'type',
            name: 'type'
        }, {
            id: 'mode',
            name: 'build mode'
        }, {
            id: 'lz',
            name: 'with lz'
        }, {
            id: 'duration',
            name: 'duration',
            align: 'right'
        }, {
            id: 'size',
            name: 'size',
            align: 'right',
            formatter: function(v) {
                return BF(v);
            }
        }, {
            id: 'reduced',
            name: 'size reduced',
            align: 'right'
        }],
        rows: rows
    });

    console.log(`open ${EC.green('test/test.html')} for runtime validation`);

};


build();