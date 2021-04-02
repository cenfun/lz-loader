
const loaderUtils = require("loader-utils");
const { validate } = require("schema-utils");
const compress = require("./runtime/compress.js");
const decompress = require("./runtime/decompress.js");
const schema = require("./options.json");

const commonCompressor = require("./compressors/common.js");
const cssLoaderCompressor = require("./compressors/css-loader.js");

const defaultCompressors = {
    "common": commonCompressor,
    "css-loader": cssLoaderCompressor
};

const loaderApi = function(source) {

    const options = loaderUtils.getOptions(this);
    validate(schema, options, {
        name: "LZ Loader",
        baseDataPath: "options"
    });
    
    const decompressPath = loaderUtils.stringifyRequest(this, require.resolve("./runtime/decompress.js"));

    let compressor = options.compressor || "common";
    if (typeof compressor === "string") {
        compressor = defaultCompressors[compressor];
    }

    if (typeof compressor !== "function") {
        compressor = defaultCompressors.common;
    }

    return compressor.call(this, source, compress, decompressPath, options);
};

loaderApi.compress = compress;
loaderApi.decompress = decompress;

module.exports = loaderApi;
