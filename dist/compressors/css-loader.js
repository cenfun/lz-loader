//ast
const esprima = require("esprima");
const esquery = require("esquery");
const escodegen = require("escodegen");

module.exports = function(source, compress, decompressPath, options) {

    //console.log(source.substr(0, 1000));

    const tree = esprima.parseModule(source);

    //console.log(tree);

    //http://estools.github.io/esquery/
    const selectorAst = esquery.parse("CallExpression  > ArrayExpression > :nth-child(2)");
    const matches = esquery.match(tree, selectorAst);
    
    if (!matches.length) {
        console.log("No css-loader content matched. or mismatched version of css-loader");
        return source;
    }

    const cssItem = matches[0];

    //raw is value with \r\n

    const lzStr = compress(cssItem.value);

    const key = `replace-key-${Math.random().toString().substr(2)}`;
    //console.log(key);

    cssItem.value = key;
    //console.log(cssItem);

    const esModule = !!options.esModule;
    const importStr = esModule ? `import decompress from ${decompressPath};\n` : `var decompress = require(${decompressPath});\n`;

    const newString = escodegen.generate(tree);

    const index = newString.indexOf(key);

    const ls = newString.substring(0, index - 1);
    const rs = newString.substr(index + key.length + 1);

    const out = `${importStr}${ls}decompress('${lzStr}')${rs}`;

    //console.log(out.substr(0, 1000));

    return out;
};