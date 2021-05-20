/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const config = require('./index');
const pk = require('../package.json');

const base = process.cwd();
module.exports = {
  entry: {
    entry: path.resolve(base, 'src', 'entry.js'),
  },
  output: {
    publicPath: config.target,
    path: path.resolve(base, 'dist'),
    filename: 'bundle.[hash].js',
    library: pk.frontname,
    libraryTarget: 'window',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [{
      test: /\.(jsx|js)$/,
      exclude: /node_modules/,
      include: path.resolve(base, './src'),
      use: [
        'babel-loader',
        'cache-loader',
      ],
    },
    // {
    //   test: /\.(jsx|js)$/,
    //   include: path.resolve(base, './src'),
    //   enforce: 'pre',
    //   exclude: /node_modules/,
    //   loader: 'eslint-loader',
    //   options: {
    //     quiet: true,
    //   },
    // },
    {
      test: /\.css$/,
      exclude: /node_modules|antd\.css/,
      use: ['style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
      ],
    }, {
      test: /\.css$/,
      include: /node_modules|antd\.css/,
      use: ['style-loader',
        {
          loader: 'css-loader',
        },
      ],
    }, {
      test: /\.less$/,
      exclude: /node_modules|antd\.less/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
          },
        },
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          },
        },
      ],
    },
    {
      test: /\.less$/,
      include: /node_modules|antd\.less/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: 'less-loader',
          options: {
            modifyVars: {
              'primary-color': '#FF7F50',
              'link-color': '#FF7F50',
              'font-size-base': '13px',
            },
            javascriptEnabled: true,
          },
        },
      ],
    },
    {
      test: /\.(png|svg|jpg|jpeg)$/,
      exclude: /node_modules/,
      use: ['url-loader'],
    },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-intl)[\\/]/, // 缓存react模块
          name: 'react',
          chunks: 'all',
        },
        vendor: {
          test: /[\\/]node_modules[\\/](antd|g2|xlsx)[\\/]/, // 缓存react模块
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: false, // 文件缓存
        parallel: true, // 多线程
        sourceMap: false, // 不生成sourcemap
        terserOptions: {
          warnings: false,
          output: {
            comments: false, // 删除注释
          },
          compress: {
            warnings: false,
            evaluate: false,
            pure_funcs: ['console.log'],
          },
        },
        extractComments: false, // 删除注释
      }),
    ],
  },
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(), // 合并块
    new HtmlWebpackPlugin({
      template: path.resolve(base, 'index.html'),
      inject: true,
      oss: config.host,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(['dist/*'], {
      root: base,
    }),
    new WebpackBar(),
    // new BundleAnalyzerPlugin(),
  ],
};
