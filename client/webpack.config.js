const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
// const { InjectManifest } = require('workbox-webpack-plugin'); //use GenerateSW instead?
const { GenerateSW } = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'html webpack plugin'
      }),
      new MiniCssExtractPlugin(),
      new WebpackPwaManifest({
        name: 'Just Another Text Editor',
        short_name: 'JATE',
        description: 'A simple PWA note-taker',
        start_url: './',
        publicPath: './',
        icons: [
          {
            src: path.resolve('./src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
      new GenerateSW({
        swSrc: './src/src.sw.js',
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
          urlPattern: /\.(?:css|html)$/,
          handler: 'CacheFirst',
          },
        ]
      }),
      // new InjectManifest({
      //   swSrc: './src-sw.js',
      //   swDest: 'service-worker.js',
      // }),
    ],

    module: { 
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
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
