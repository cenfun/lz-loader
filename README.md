# lz-loader

A loader for webpack that allows importing assets (json/txt/svg/html/css ...) as a compressed string with [lz-string](https://github.com/pieroxy/lz-string)

## Install
```sh
npm install lz-loader -D
```

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

## Inline
```js
//inline loader
const str = require("!!lz-loader!./icons.svg");
```
see [https://webpack.js.org/concepts/loaders/#inline](https://webpack.js.org/concepts/loaders/#inline)

## Compress for css-loader before insert by style-loader
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
                    cssLoader: true
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

## Options
| Name        |    Type     | Default | Description            |
| :---------: | :---------: | :-----: | :--------------------- |
| esModule    | `{Boolean}` | `false` | Uses ES modules syntax |
| cssLoader   | `{Boolean}` | `false` | Uses for css-loader    |

## Compressed Benchmark
* css: [test/src/case-css.js](test/src/case-css.js)
* json: [test/src/case-json.js](test/src/case-json.js)
* svg: [test/src/case-svg.js](test/src/case-svg.js)
* text: [test/src/case-text.js](test/src/case-text.js)
* mixed: [test/src/index.js](test/src/index.js)
```sh
┌───────┬─────────────┬─────────┬──────────┬──────────┬──────────────┐
│ type  │ build mode  │ with lz │ duration │     size │ size reduced │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ css   │ development │ false   │ 1,537 ms │ 240.7 KB │            - │
│ css   │ development │ true    │   343 ms │  92.5 KB │       61.59% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ css   │ production  │ false   │   609 ms │ 229.3 KB │            - │
│ css   │ production  │ true    │   547 ms │  77.2 KB │       66.34% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ json  │ development │ false   │   108 ms │ 342.2 KB │            - │
│ json  │ development │ true    │   237 ms │ 165.8 KB │       51.56% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ json  │ production  │ false   │   274 ms │ 340.4 KB │            - │
│ json  │ production  │ true    │   418 ms │ 160.6 KB │       52.82% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ svg   │ development │ false   │   290 ms │ 576.5 KB │            - │
│ svg   │ development │ true    │   298 ms │ 266.8 KB │       53.71% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ svg   │ production  │ false   │   477 ms │ 570.1 KB │            - │
│ svg   │ production  │ true    │   488 ms │ 261.4 KB │       54.14% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ text  │ development │ false   │   108 ms │ 220.3 KB │            - │
│ text  │ development │ true    │   176 ms │ 100.8 KB │       54.23% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ text  │ production  │ false   │   265 ms │ 218.5 KB │            - │
│ text  │ production  │ true    │   379 ms │  95.7 KB │       56.21% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ mixed │ development │ false   │   845 ms │   1.3 MB │            - │
│ mixed │ development │ true    │   741 ms │ 606.7 KB │       55.87% │
├───────┼─────────────┼─────────┼──────────┼──────────┼──────────────┤
│ mixed │ production  │ false   │ 1,103 ms │   1.3 MB │            - │
│ mixed │ production  │ true    │   971 ms │ 588.8 KB │       56.61% │
└───────┴─────────────┴─────────┴──────────┴──────────┴──────────────┘
```

## Changelogs

* 1.0.1
    * added new feature for css-loader