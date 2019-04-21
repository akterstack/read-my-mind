/*
 * README
 * This is a fake webpack config for IntelliJ to detect "webui/src" alias as "@"
 * */
const webpackMerge = require("webpack-merge");
const vueWebpack = require("@vue/cli-service/webpack.config");

module.exports = webpackMerge({}, vueWebpack);
