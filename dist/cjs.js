const path = require("path");
const loaderUtils = require("loader-utils");

const LzString = require("./runtime/api.js");

const loaderApi = (source) => {
  
};

loaderApi.pitch = function(remainingRequest) {

    const apiPath = loaderUtils.stringifyRequest(this, path.resolve(__dirname, "runtime/api.js"));

    const filePath = loaderUtils.stringifyRequest(this, `!!${remainingRequest}`);

    console.log(apiPath);
    console.log(filePath, remainingRequest);

    //const lzStr = LzString.compressToBase64(JSON.stringify(reportData));

    const lzStr = "";

    return `
        const LzString = require(${apiPath});
        module.exports = JSON.parse(LzString.decompressFromBase64(${lzStr}));
        `;
    
};

module.exports = loaderApi;
