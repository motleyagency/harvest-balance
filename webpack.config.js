/* eslint-disable import/no-extraneous-dependencies, semi, func-names, comma-dangle */

require("dotenv-extended").load();
const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const _ = require("lodash");
const parts = require("./webpack.parts");
const pkg = require("./package.json");

const TARGET = process.env.npm_lifecycle_event;
const ENABLE_POLLING = process.env.ENABLE_POLLING === "true";
const PATHS = {
  src: path.join(__dirname, "src"),
  style: [
    path.join(__dirname, "src", "main.scss"),
  ],
  assets: path.join(__dirname, "src", "assets"),
  dist: path.join(__dirname, "dist"),
  test: path.join(__dirname, "tests"),
};

process.env.BABEL_ENV = TARGET;

const common = merge(
  {
    // Entry accepts a path or an object of entries.
    // We"ll be using the latter form given it"s
    // convenient with more complex configurations.
    entry: {
      app: PATHS.src,
    },
    output: {
      path: PATHS.dist,
      publicPath: "/",
      filename: "[name].js",
    },
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        assets: PATHS.assets,
      },
    },
    devtool: "source-map",
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jquery: "jquery",
        "window.jQuery": "jquery",
        jQuery: "jquery",
        // bootstrap 4 tooltips require tether and look for it as "Tether"
        Tether: "tether",
      }),
    ],
  },
  parts.indexTemplate({
    title: "Harvest Balance",
    appMountId: "app",
  }),
  parts.loadJSX(PATHS.src),
  parts.lintJSX(PATHS.src)
);

let config;

// Detect how npm is run and branch based on that
switch (TARGET) {
case "build":
case "stats":
  config = merge(
    common,
    {
      devtool: "source-map",
      entry: {
        // style: PATHS.style
      },
      output: {
        // publicPath: ",
        path: PATHS.dist,
        filename: "[name].[chunkhash].js",
        chunkFilename: "[chunkhash].js",
      },
    },
    parts.clean(PATHS.dist),
    parts.setFreeVariable("process.env.NODE_ENV", "production"),
    parts.setFreeVariable("process.env.BACKEND_URL", process.env.BACKEND_URL),
    parts.setupAssets(PATHS.assets),
    parts.extractBundle({
      name: "vendor",
      // Take vendor packages from package.json"s "dependencies≤" object
      // I.e. make sure to install all other packages (not needed in production) as --dev.
      // However, since the dependencies also include packages needed for
      // the production server, we have to exclude them manually :(
      entries: _.difference(Object.keys(pkg.dependencies), [
        "bluebird",
        "cors",
        "dotenv-extended",
        "express",
        "harvest",
        "helmet",
      ]),
    }),
    parts.minify(),
    parts.extractCSS(PATHS.style)
  );
  break;
case "test":
case "test:tdd":
  // TODO: we don"t have tests yet
  config = merge(
    common,
    {
      devtool: "inline-source-map",
    },
    parts.loadIsparta(PATHS.src),
    parts.loadJSX(PATHS.test)
  );
  break;
default:
  config = merge(
    common,
    {
      devtool: "eval-source-map",
    },
    parts.setupCSS(PATHS.style),
    parts.setupAssets(PATHS.assets),
    // Set the backend url to the dev backend
    parts.setFreeVariable("process.env.BACKEND_URL", process.env.BACKEND_DEV_URL),
    parts.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: parseInt(process.env.DEV_PORT, 10),
      poll: ENABLE_POLLING,
    }),
    parts.enableReactPerformanceTools()
  );
}

module.exports = config;
