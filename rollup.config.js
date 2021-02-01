import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const SOURCE_DIR_NAME = 'src';

export default {
  input: `${SOURCE_DIR_NAME}/index.ts`,
  output: {
    dir: 'build',
    format: 'es',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: SOURCE_DIR_NAME,
  },
  plugins: [typescript(), terser()],
};
