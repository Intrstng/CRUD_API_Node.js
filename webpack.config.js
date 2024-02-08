const webpack = require('webpack');
const path = require('path');


module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const config = {
    entry: env.entry,
    mode: isProduction ? 'production' : 'development',
    target: "node",
    // watch: !isProduction,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.ts(x)?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js'
      ]
    }
  };
  return config;
}






// const webpack = require('webpack');
// const path = require('path');
//
// module.exports = (env, options) => {
//   const isProduction = options.mode === 'production';
//
//   const config = {
//     entry: './src/index.ts',
//     output: {
//       path: path.resolve(__dirname, 'dist'), // path path.join(__dirname, 'dist'),
//       filename: 'bundle.js'
//     },
//     mode: isProduction ? 'production' : 'development',
//     devtool: /* isProduction ? 'none' :  */'source-map',
//     watch: !isProduction,
//     module: {
//       rules: [
//         {
//           test: /\.ts(x)?$/,
//           loader: 'ts-loader',
//           exclude: /node_modules/
//         }
//       ]
//     },
//     resolve: {
//       extensions: [
//         '.tsx',
//         '.ts',
//         '.js'
//       ]
//     }
//   };
//   return config;
// }