const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: 'main.bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({     //will create index.html in /dist
        template: './index.html',
        title: 'html webpack plugin'
      }),
      // new MiniCssExtractPlugin(),
      new WebpackPwaManifest(),
      new WorkboxPlugin(),
      new WorkboxPlugin.GenerateSW(), //call workbox generator fxn for registering service worker
      new InjectManifest({
        swSrc: './src/src-sw.js',
        swDest: 'service-worker.js',
      }),
      
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env']}
          }
        }
      ],
    },
  };
};
