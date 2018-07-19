import path from 'path';
import webpack from 'webpack';

export default (): webpack.Configuration => ({
  entry: {
    main: './src/browser.ts',
  },
  output: {
    path: path.join(__dirname, 'static/bundle/'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.join(__dirname, 'tsconfig.browser.json'),
        },
      },
    ],
  },
  devtool: 'source-map',
});
