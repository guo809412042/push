const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const config = require('./index');

const base = process.cwd();
const env = process.env.BUILD_ENV || 'base';

module.exports = () => ({
  entry: {
    entry: path.resolve(base, 'src', 'entry.js'),
  },
  output: {
    publicPath: '',
    path: path.resolve(base, 'dist'),
    filename: 'bundle.[hash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        include: path.resolve(base, './src'),
        use: ['babel-loader'],
      },
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(base, './src'),
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules|antd\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules|antd\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
        ],
      },
      {
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(base, env === 'production' ? 'index.html' : 'index-dev.html'),
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
  devServer: {
    contentBase: path.resolve(base, 'dist'),
    compress: true,
    port: 3001,
    progress: true,
    open: false,
    host: '0.0.0.0',
    proxy: {
      // '/tool-issue/': {
      //   target: 'http://0.0.0.0',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/tool-issue/': '/',
      //   },
      // },
      '/': {
        target: 'http://vcm-qa.quvideo.vip',
        changeOrigin: true,
        pathRewrite: {
          '^/': '/',
        },
      },
    },
  },
});
