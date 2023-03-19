const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const {GenerateSW} = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

// TODO: Add and configure workbox plugins for a service worker and manifest file. DONE
// TODO: Add CSS loaders and babel to webpack. DONE

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
      new HtmlWebpackPlugin({     //will create index.html in /dist
        template: './index.html',
        title: 'html webpack plugin'
      }),
      new MiniCssExtractPlugin(),
      new WebpackPwaManifest({
        name: 'Just Another Text Editor',
        short_name: 'JATE',
        description: 'A simple note-taker',
        start_url: './',
        publicPath: './',
        // icons: [
        //   {
        //     src: path.resolve('')
        //   }
        // ]
      }),
      new GenerateSW(),    
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
