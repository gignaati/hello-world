import path from 'node:path';

import type { Configuration } from 'webpack';

import { plugins } from './webpack.plugins';
import { rules } from './webpack.rules';

rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: false,
      },
    },
    { loader: 'postcss-loader' },
  ],
});

rules.push({
  test: /\.(png|jpe?g|gif|svg|ico)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'assets/[hash][ext][query]',
  },
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@electron': path.resolve(__dirname, 'src/electron'),
      '@renderer': path.resolve(__dirname, 'src/renderer'),
    },
  },
};
