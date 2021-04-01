const path = require("path");
const loaderUtils = require("loader-utils");
const { validate } = require("schema-utils");
const compress = require("./runtime/compress.js");
const decompress = require("./runtime/decompress.js");
const schema = require("./options.json");

//ast
const esprima = require("esprima");
const escodegen = require("escodegen");


const getCssLoaderString = function(source, esModule, apiPath) {

    //console.log(source.substr(0, 1000));

    const tree = esprima.parseModule(source);

    //console.log(tree);

    let cssItem;
    tree.body.forEach((e) => {
        if (e.type === "ExpressionStatement") {
            const expression = e.expression;
            if (expression.type === "CallExpression") {
                expression.arguments.forEach(a => {
                    if (a.type === "ArrayExpression") {
                        a.elements.forEach(item => {
                            if (item.type === "Literal" && item.value) {
                                cssItem = item;
                            }
                        });
                    }
                });
            }
        }
    });

    if (!cssItem) {
        return source;
    }

    //raw is value with \r\n

    const lzStr = compress(cssItem.value);

    const key = `lz-string-key-${Math.random().toString().substr(2)}`;
    console.log(key);

    cssItem.value = key;
    //console.log(cssItem);

    const importStr = esModule ? `import decompress from ${apiPath};\n` : `var decompress = require(${apiPath});\n`;

    const newString = escodegen.generate(tree);

    const index = newString.indexOf(key);

    const ls = newString.substring(0, index - 1);
    const rs = newString.substr(index + key.length + 1);

    const out = `${importStr}${ls}decompress('${lzStr}')${rs}`;

    //console.log(out.substr(0, 1000));

    return out;
};

const getNormalString = function(source, esModule, apiPath, isJson) {
    const lzStr = compress(`${source}`);

    let out = "";

    if (esModule) {
        out += `import decompress from ${apiPath};\n`;
    } else {
        out += `var decompress = require(${apiPath});\n`;
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

const loaderApi = function(source) {

    const options = loaderUtils.getOptions(this);
    validate(schema, options, {
        name: "LZ String Loader",
        baseDataPath: "options"
    });

    //==================================================================================
    const esModule = !!options.esModule;
   
    const apiPath = loaderUtils.stringifyRequest(this, require.resolve("./runtime/decompress.js"));
    //console.log(apiPath);

    const ext = path.extname(this.resourcePath);
    //console.log(ext);
    const isJson = ext === ".json";

    //==================================================================================
    //support css loader string
    if (options.cssLoader) {
        let newSource;
        try {
            newSource = getCssLoaderString(source, esModule, apiPath);
        } catch (e) {
            console.log(e);
        }
        return newSource || source;
    }

    //==================================================================================
    //normal json or string
    return getNormalString(source, esModule, apiPath, isJson);

};

loaderApi.compress = compress;
loaderApi.decompress = decompress;

module.exports = loaderApi;
