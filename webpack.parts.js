/* eslint-disable import/no-extraneous-dependencies, semi, func-names */

const webpack = require("webpack")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const htmlTemplate = require("html-webpack-template")

exports.indexTemplate = function (options) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        template: htmlTemplate,
        title: options.title,
        appMountId: options.appMountId,
        inject: false,
      }),
    ],
  }
}

exports.loadJSX = function (include) {
  return {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include,
          use: [
            {
              loader: "babel-loader?cacheDirectory",
              options: {
                presets: ["react", "es2015"],
              },
            },
          ],
        },
      ],
    },
  }
}

exports.loadIsparta = function (include) {
  return {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          enforce: "pre",
          use: ["isparta-loader"],
          include,
        },
      ],
    },
  }
}

exports.lintJSX = function (include) {
  return {
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          enforce: "pre",
          use: ["eslint-loader"],
          include,
        },
      ],
    },
  }
}

exports.enableReactPerformanceTools = function () {
  return {
    module: {
      rules: [
        {
          test: require.resolve("react"),
          use: ["expose-loader?React"],
        },
      ],
    },
  }
}

exports.devServer = function (options) {
  const ret = {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: "errors-only",

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port, // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true,
      }),
    ],
  }

  if (options.poll) {
    ret.watchOptions = {
      // Delay the rebuild after the first change
      aggregateTimeout: 1000,
      // Poll using interval (in ms, accepts boolean too)
      poll: 2000,
    }
  }

  return ret
}

exports.devProxy = function (config) {
  return {
    devServer: {
      proxy: config,
    },
  }
};

exports.setupCSS = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [{
            loader: "style-loader",
          }, {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          }],
          include: paths,
        },
        {
          test: /\.scss$/,
          use: [{
            loader: "style-loader",
          }, {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          }],
          include: paths,
        },
      ],
    },
  }
}

exports.setupAssets = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.png$/,
          use: "url-loader?mimetype=image/png",
          include: paths,
        },
        {
          test: /\.jpe?g$/,
          use: "url-loader?mimetype=image/jpg",
          include: paths,
        },
      ],
    },
  }
}

exports.minify = function () {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ],
  }
}

/**
 * Make a key-value pair available for the application. The
 * key will be replaced with the value throughout the app
 * during compile.
 *
 * Example: "expose" an env variable, i.e. simulate that
 * `process.env` is available to the app, even though it's actually not:
 *
 * setFreeVariable("process.env.FOO", process.env.FOO)
 */
exports.setFreeVariable = function (key, value) {
  const env = {}
  env[key] = JSON.stringify(value)

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  }
}

exports.extractBundle = function (options) {
  const entry = {}
  entry[options.name] = options.entries

  return {
    // Define an entry point needed for splitting.
    entry,
    plugins: [
      // Extract bundle and manifest files. Manifest is
      // needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, "manifest"],

        // options.name modules only
        minChunks: Infinity,
      }),
    ],
  }
}

exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd(),
      }),
    ],
  }
}

exports.extractCSS = function (paths) {
  return {
    module: {
      rules: [
        // Extract CSS during build
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader",
          }),
          include: paths,
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader", "sass-loader"],
          }),
          include: paths,
        },
      ],
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin({
        filename: "[name].[chunkhash].css",
      }),
    ],
  }
}
