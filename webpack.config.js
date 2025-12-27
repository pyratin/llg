/** @type {import('webpack').Configuration} */

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const pathFragmentClient = 'client';

const pathSourceClient = path.join(process.cwd(), 'source', pathFragmentClient);

const regExpNodeModules = /node_modules/;

const exclude = [regExpNodeModules];

export default {
  entry: { bundle: [pathSourceClient] },
  output: {
    path: path.join(process.cwd(), 'target', pathFragmentClient),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(pathSourceClient, 'index.html')
    }),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }]
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  devServer: { hot: true, liveReload: true },
  resolve: { alias: { client: pathSourceClient } },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: regExpNodeModules,
          chunks: 'initial',
          name: 'vendor.bundle'
        }
      }
    }
  },
  stats: {
    warningsFilter: [
      /Sass @import rules are deprecated/,
      /Deprecation Warning.*sass-loader/,
      /Module Warning.*sass-loader/
    ]
  }
};
