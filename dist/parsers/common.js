const path = require("path");

module.exports = function(source, compress, decompressPath, options) {

    const esModule = !!options.esModule;

    const ext = path.extname(this.resourcePath);
    //console.log(ext);
    const isJson = ext === ".json";

    const lzStr = compress(`${source}`);

    let out = "";

    if (esModule) {
        out += `import decompress from ${decompressPath};\n`;
    } else {
        out += `var decompress = require(${decompressPath});\n`;
    }
       
    out += `var source = "${lzStr}";\n`;
    if (isJson) {
        out += "var result = JSON.parse(decompress(source));\n";
    } else {
        out += "var result = decompress(source);\n";
    }

    if (esModule) {
        out += "export default result;";
    } else {
        out += "module.exports = result;";
    }

    return out;
};