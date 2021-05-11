const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')


module.exports = (env, argv)=> {
  const isProd = argv.mode === 'production'
  const isDev = !isProd

  const filename = (ext) =>
      isProd ?
          `[name].[contenthash].bundle.${ext}` : `[name].bundle.${ext}`


  console.log('Prod', isProd)
  console.log('Dev', isDev)

  const plugins = () =>{
    const base = [
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src', 'favicon.ico'),
            to: path.resolve(__dirname, 'dist')
          }
        ],
      }),
      new MiniCssExtractPlugin({
        filename: filename('css')
      }),
    ]
    if (isDev) {
      base.push(new ESLintPlugin())
    }
    return base
  }

  return {
    target: 'web',
    context: path.resolve(__dirname, './src'),

    entry: {
      main: ['@babel/polyfill', './app.js']
    },

    devServer: {
      contentBase: 'dist',
      open: true,
    },

    devtool: isDev ? 'inline-source-map': false,

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: filename('js'),
      clean: true,
    },

    resolve: {
      extensions: ['.js'],
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'core'),
      }

    },

    plugins: plugins(),

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            },
          },
        },
      ],
    },


  }
}
