const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin=require('mini-css-extract-plugin')

module.exports = {
  mode:'production',
  entry: {
    vendor: [
            'jquery',
            'bootstrap/scss/custom.scss',
            path.resolve(__dirname,'./src/assets/fonticons/iconfont.css'),
            path.resolve(__dirname,'./src/assets/Animate.css'),
            path.resolve(__dirname,'./src/libraries/underscore/index.js'),
            path.resolve(__dirname,'./src/libraries/datepicker/xdate.js'),
            ],
  },
  output: {
    path: path.join(__dirname, './public'),
    filename: 'dll.[name].js',
    library: '[name]'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      
    }
  },
  module: {
    rules:[
      {
        test: /\.css$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.scss$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: 'fonts/[name].[ext]'
        }
      }
    ]
  },
  optimization:{
    minimizer:[
      new TerserPlugin({extractComments: false})
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
        $:'jquery',
        jQuery:'jquery',
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, './', '[name]-manifest.json'),
      name: '[name]',
      context: __dirname
    }),
    new MiniCssExtractPlugin({
      filename: "dll.[name].css",
    })
  ]
}