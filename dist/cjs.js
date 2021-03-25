const path = require("path");
const loaderUtils = require("loader-utils");
const { validate } = require("schema-utils");
const compress = require("./runtime/compress.js");
const schema = require("./options.json");

const loaderApi = function(source) {

    const options = loaderUtils.getOptions(this);

    validate(schema, options, {
        name: "LZ String Loader",
        baseDataPath: "options"
    });

    const apiPath = loaderUtils.stringifyRequest(this, require.resolve("./runtime/decompress.js"));
    //console.log(apiPath);

    const ext = path.extname(this.resourcePath);
    const isJson = ext === ".json";
    const esModule = !!options.esModule;

    const lzStr = compress(`${source}`);

    let out = "";

    if (esModule) {
        out += `import decompress from ${apiPath};\n`;
    } else {
        out += `const decompress = require(${apiPath});\n`;
    }
       
    out += `const source = "${lzStr}";\n`;
    if (isJson) {
        out += "const result = JSON.parse(decompress(source));\n";
    } else {
        out += "const result = decompress(source);\n";
    }

    if (esModule) {
        out += "export default result;";
    } else {
        out += "module.exports = result;";
    }

    return out;
};

module.exports = loaderApi;
