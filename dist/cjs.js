
const loaderUtils = require("loader-utils");
const { validate } = require("schema-utils");
const compress = require("./runtime/compress.js");
const decompress = require("./runtime/decompress.js");
const schema = require("./options.json");

const commonParser = require("./parsers/common.js");
const cssLoaderParser = require("./parsers/css-loader.js");

const defaultParsers = {
    "common": commonParser,
    "css-loader": cssLoaderParser
};

const loaderApi = function(source) {

    const options = loaderUtils.getOptions(this);
    validate(schema, options, {
        name: "LZ String Loader",
        baseDataPath: "options"
    });
    
    const decompressPath = loaderUtils.stringifyRequest(this, require.resolve("./runtime/decompress.js"));

    let parser = options.parser || "common";
    if (typeof parser === "string") {
        parser = defaultParsers[parser];
    }

    if (typeof parser !== "function") {
        parser = defaultParsers.common;
    }

    return parser.call(this, source, compress, decompressPath, options);
};

loaderApi.compress = compress;
loaderApi.decompress = decompress;

module.exports = loaderApi;
