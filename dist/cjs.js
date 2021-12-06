const { validate } = require('schema-utils');
const compress = require('lz-utils/lib/compress.js');
const schema = require('./options.json');

const commonCompressor = require('./compressors/common.js');
const cssLoaderCompressor = require('./compressors/css-loader.js');

const defaultCompressors = {
    'common': commonCompressor,
    'css-loader': cssLoaderCompressor
};

const loaderApi = function(source) {

    //console.log('lz-loader start ...');
    const options = this.getOptions();
    //console.log(options);

    //fixing inline json issue 
    // Try to retrieve the factory used by the LoaderDependency type which should be the NormalModuleFactory.
    if (this._module.type === 'json') {
        const LoaderDependency = require('webpack/lib/dependencies/LoaderDependency');
        const factory = this._compilation.dependencyFactories.get(LoaderDependency);
        if (!factory) {
            throw new Error('Could not retrieve module factory for type LoaderDependency (json => javascript/auto)');
        }
        const requiredType = 'javascript/auto';
        this._module.type = requiredType;
        this._module.generator = factory.getGenerator(requiredType);
        this._module.parser = factory.getParser(requiredType);
    }

    validate(schema, options, {
        name: 'LZ Loader',
        baseDataPath: 'options'
    });
    
    const request = require.resolve('lz-utils/lib/decompress.js');
    const decompressPath = JSON.stringify(this.utils.contextify(this.context || this.rootContext, request));
    //console.log(decompressPath);

    let compressor = options.compressor || 'common';
    if (typeof compressor === 'string') {
        const compressorName = compressor;
        compressor = defaultCompressors[compressorName];
        if (!compressor) {
            console.log(`ERROR: Unknown compressor: ${compressorName}`);
        }
    }

    if (typeof compressor !== 'function') {
        console.log(`The compressor is invalid: ${compressor}, it will be replaced with default common function.`);
        compressor = defaultCompressors.common;
    }

    return compressor.call(this, source, compress, decompressPath, options);
};

module.exports = loaderApi;
