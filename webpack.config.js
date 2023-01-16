import path from 'path';

const config = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve('./prod'),
    filename: 'bundle.cjs',
    clean: true
  },
  resolve: {
    extensions: ['.js']
  },
  experiments: {
    topLevelAwait: true
  },
  target: 'node'
};

export default config;