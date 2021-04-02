//ast
const esprima = require("esprima");
const escodegen = require("escodegen");

module.exports = function(source, compress, decompressPath, options) {

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