const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const shelljs = require("shelljs");

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

link();