const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const CopyWebpackPublic = require('copy-webpack-plugin');
const helpers = require('./helpers');

var backendURI = "";

if (process.env.BACKEND_URI !== undefined && process.env.BACKEND_URI !== null && process.env.BACKEND_URI !== '') {
  backendURI = process.env.BACKEND_URI;
} else {

  if (process.env.APP_MODE === 'production') {
    backendURI += "https://";
  } else if (process.env.APP_MODE === 'debug' || process.env.APP_MODE === 'development') {
    backendURI += "http://";
  } else {
    console.log("Unknown APP MODE: " + process.env.APP_MODE);
    backendURI += "http://";
  }

  backendURI += process.env.BACKEND_HOST;
  backendURI += ":";
  backendURI += process.env.BACKEND_PORT;

  backendURI += process.env.BACKEND_PREFIX;

}

var projectTitle = process.env.PROJECT_TITLE;
var projectDescription = process.env.PROJECT_DESCRIPTION;

var allowRegistration = process.env.ALLOW_REGISTRATION === 'true';
var allowPasswordReset = process.env.ALLOW_PASSWORD_RESET === 'true';

var processEnv = {
  'apiUrl': JSON.stringify(backendURI + '/api'),
  'authApiUrl': JSON.stringify(backendURI + '/auth'),
  'projectTitle': JSON.stringify(projectTitle),
  'projectDescription': JSON.stringify(projectDescription),
  'allowRegistration': JSON.stringify(allowRegistration),
  'allowPasswordReset': JSON.stringify(allowPasswordReset),
}

let INJECT_KEY = 'INJECT_'
for (let key in process.env) {
  if (key.startsWith(INJECT_KEY)) {
    processEnv[key.substr(INJECT_KEY.length)] = JSON.stringify(process.env[key])
  }
}

module.exports = {
  entry: {
    'polyfills': '/rapydo/src/polyfills.ts',
    'vendor': '/rapydo/src/vendor.ts',
    'custom': '/app/frontend/custom.ts',
    'main': '/rapydo/src/main.ts'
  },

  // all vendors in a single package
  /*
  optimization: {
      splitChunks: {
          chunks: "all"
      }
  },
  */
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ["/modules/node_modules"],
    alias: {
      '@rapydo': '/rapydo/src/app',
      '@app': '/app/frontend/app'
    }
  },

  resolveLoader: {
    modules: ["/modules/node_modules"]
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.js$/,
        include: [helpers.root('src', 'app'), '/app/frontend/'],
        loader: 'script-loader'
      },
      {
        test: /\.css$/,
        include: ['/rapydo/src/css/', '/app/frontend/css/', '/modules/node_modules'],
        exclude: ['/modules/node_modules/@swimlane/ngx-datatable'],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // only enable hot in development
              hmr: process.env.NODE_ENV !== 'production',
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
            },
          },
          {
            loader: 'css-loader'
          },
          {
              loader: 'postcss-loader',
              options: {
                  ident: 'postcss',
                  plugins: function(loader){
                      return [
                          autoprefixer({remove: false, flexbox: true}),
                          cssnano({zindex: false})
                      ];
                  }
              }
          }
        ],
      },
      // Great guide here: https://www.freecodecamp.org/news/how-to-configure-webpack-4-with-angular-7-a-complete-guide-9a23c879f471/
      {
        test: /\.css$/,
        // include: [helpers.root('src', 'app'), '/app/frontend/app/'],
        // exclude: ['/rapydo/src/css/', '/app/frontend/css/'],
        //include: ['/rapydo/src/app', '/app/frontend/app/', '/modules/node_modules'],
        include: ['/rapydo/src/app', '/app/frontend/app/', '/modules/node_modules/@swimlane/ngx-datatable'],
        use: [
          {
            loader: 'to-string-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: function(loader){
                return [
                  autoprefixer({remove: false, flexbox: true}),
                  cssnano({zindex: false})
                ];
              }
            }
          }
         ]
      }
    ]
  },

  node: {
    // prevent webpack from injecting eval / new Function through global polyfill
    global: false
  },

  plugins: [
    // so that file hashes don't change unexpectedly
    new webpack.HashedModuleIdsPlugin(),
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /\@angular(\\|\/)core(\\|\/)fesm5/,
      helpers.root('/rapydo/src'), // location of your src
      {} // a map of your routes
    ),

    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),

    new HtmlWebpackPlugin({
      template: '/rapydo/src/index.html',
      inject: true,
      sourceMap: true,
      chunksSortMode: 'dependency'
    }),

    new webpack.DefinePlugin({
      'process.env': processEnv
    }),

    new CopyWebpackPublic(
      [
        { from: '/app/frontend/css', to: 'static/custom/css/'},
        { from: '/app/frontend/assets', to: 'static/assets/'},
        { from: '/rapydo/src/css', to: 'static/commons/css/'}
      ]
    )

  ]

};
