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

## Options
|            Name             |    Type     | Default | Description            |
| :-------------------------: | :---------: | :-----: | :--------------------- |
| **[`esModule`](#esmodule)** | `{Boolean}` | `false` | Uses ES modules syntax |


## Compressed Benchmark
* test case: 523K
    * [index.js](test/src/index.js) 1K
    * [data.json](test/src/data.json) 518K
    * [text.txt](test/src/text.txt) 4K
* [normal build](test/webpack.normal.js) (uncompressed): 347K
* normal build + production (minify + uncompressed): 345K
* use [lz-loader](test/webpack.lz.js) (compressed): 168K
* use lz-loader + production (minify + compressed): 161K

## Changelogs

* 1.0.0