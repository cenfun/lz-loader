# lz-loader

A loader for webpack that allows importing assets (json/txt/svg/html/css ...) as a compressed string with [lz-string](https://github.com/pieroxy/lz-string), and self decompressed on runtime.

## Install
```sh
npm install lz-loader -D
```

## Options
| Name        |       Type               | Default | Description            |
| :---------: | :----------------------: | :-----: | :--------------------- |
| esModule    | `{Boolean}`              | `false` | Uses ES modules syntax |
| compressor  | `{String} or {Function}` |         | Custom compressor      |

## Add the loader to webpack config
```js
//webpack.config.js
module.exports = {
    module: {
        rules: [{
            test: /\.(json|txt|svg)$/,
            type: "javascript/auto",
            use: {
                loader: "lz-loader"
                options: {
                    esModule: false
                }
            }
        }]
    }
};
```

## Inline loader
```js
//inline loader
const str = require("!!lz-loader!./icons.svg");
```
see [https://webpack.js.org/concepts/loaders/#inline](https://webpack.js.org/concepts/loaders/#inline)

## Css compressor between css-loader and style-loader
```js
//webpack.config.js
module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                loader: "style-loader",
                options: {
                    injectType: "singletonStyleTag"
                }
            }, {
                loader: "lz-loader",
                options: {
                    esModule: false,
                    compressor: "css-loader"
                }
            }, {
                loader: "css-loader",
                options: {
                    esModule: false,
                    import: false,
                    sourceMap: false
                }
            }]
    }
};
```
see [dist/compressors/css-loader.js](dist/compressors/css-loader.js)

## Custom compressor function
```js
//webpack.config.js
module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                loader: "after-loader",
            }, {
                loader: "lz-loader",
                options: {
                    esModule: false,
                    compressor: function(source, compress, decompressPath, options) {
                        var newSource = yourHandler(source);
                        return newSource;
                    }
                }
            }, {
                loader: "before-loader"
            }]
    }
};
```
## Compression cases
* css: [test/src/case-css.js](test/src/case-css.js)
* json: [test/src/case-json.js](test/src/case-json.js)
* svg: [test/src/case-svg.js](test/src/case-svg.js)
* text: [test/src/case-text.js](test/src/case-text.js)
* mixed: [test/src/index.js](test/src/index.js)
## Benchmark
```sh
┌───────┬─────────────┬─────────┬──────────┬──────────┬──────────────┐
│ type  │ build mode  │ with lz │ duration │     size │ size reduced │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ css   │ development │ false   │ 1,411 ms │ 246.3 KB │            - │
│ css   │ development │ true    │   682 ms │  99.3 KB │       59.69% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ css   │ production  │ false   │   659 ms │ 229.8 KB │            - │
│ css   │ production  │ true    │   696 ms │  77.6 KB │       66.21% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ json  │ development │ false   │   161 ms │ 342.3 KB │            - │
│ json  │ development │ true    │   292 ms │ 165.9 KB │       51.53% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ json  │ production  │ false   │   346 ms │ 340.4 KB │            - │
│ json  │ production  │ true    │   469 ms │ 160.6 KB │       52.82% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ svg   │ development │ false   │   420 ms │ 576.6 KB │            - │
│ svg   │ development │ true    │   538 ms │ 267.0 KB │       53.69% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ svg   │ production  │ false   │   648 ms │ 570.1 KB │            - │
│ svg   │ production  │ true    │   562 ms │ 261.4 KB │       54.14% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ text  │ development │ false   │   130 ms │ 220.4 KB │            - │
│ text  │ development │ true    │   189 ms │ 101.0 KB │       54.17% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ text  │ production  │ false   │   317 ms │ 218.5 KB │            - │
│ text  │ production  │ true    │   381 ms │  95.7 KB │       56.21% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ mixed │ development │ false   │   964 ms │   1.3 MB │            - │
│ mixed │ development │ true    │   830 ms │ 613.7 KB │       55.54% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ mixed │ production  │ false   │ 1,271 ms │   1.3 MB │            - │
│ mixed │ production  │ true    │ 1,267 ms │ 589.2 KB │       56.59% │
└───────┴─────────────┴─────────┴──────────┴──────────┴──────────────┘
```
see detail [test/test.js](test/test.js)

## Changelogs

- 1.0.5
  - updated lz-utils

- 1.0.4
  - fixed issue for inline json

- 1.0.3
  - updated schema-utils to latest

- 1.0.2
  - added new option compressor for custom compression

- 1.0.1
  - added new feature for css-loader