# lz-loader

A loader for webpack that allows importing assets (json/txt/svg/html/css ...) as a compressed string with [lz-string](https://github.com/pieroxy/lz-string)

## Install
```sh
npm install lz-loader -D
```

## add the loader to webpack config
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
see [test/webpack.lz.js](test/webpack.lz.js)

## Inline
```js
//inline loader
const str = require("lz-loader!./icons.svg");
```
see [https://webpack.js.org/concepts/loaders/#inline](https://webpack.js.org/concepts/loaders/#inline)

## Options
|            Name             |    Type     | Default | Description            |
| :-------------------------: | :---------: | :-----: | :--------------------- |
| **[`esModule`](#esmodule)** | `{Boolean}` | `false` | Uses ES modules syntax |


## Compressed Benchmark
* test case: 1182K
    * [index.js](test/src/index.js) 1K
    * [data.json](test/src/data.json) 518K
    * [icons.svg](test/src/icons.svg) 563K
    * [text.txt](test/src/text.txt) 100K
* [normal build](test/webpack.normal.js) (uncompressed): 1017K
* [lz build](test/webpack.lz.js) (compressed): 429K (58% saved)

## Changelogs

* 1.0.0