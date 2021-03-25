const path = require("path");
const loaderUtils = require("loader-utils");
const LzString = require("./runtime/compress.js");

const loaderApi = function(source) {

    //esModule

    const apiPath = loaderUtils.stringifyRequest(this, require.resolve("./runtime/decompress.js"));
    //console.log(apiPath);

    const ext = path.extname(this.resourcePath);
    const isJson = ext === ".json";

    const lzStr = LzString.compressToBase64(`${source}`);

    let out = `const LzString = require(${apiPath});\n`;
    out += `const source = "${lzStr}";\n`;
    out += "let result = LzString.decompressFromBase64(source);\n";
    if (isJson) {
        out += "result = JSON.parse(result);\n";
    }
    out += "module.exports = result;";

    //console.log(out);

    return out;
};

module.exports = loaderApi;
