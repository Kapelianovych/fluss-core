import fs from 'fs';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const SOURCE_DIR_NAME = 'src';

export default {
  input: fs
    .readdirSync(path.resolve(process.cwd(), SOURCE_DIR_NAME), {
      withFileTypes: true,
    })
    .filter((dirent) => !dirent.isDirectory() && dirent.name !== 'types.ts')
    .map((dirent) => `${SOURCE_DIR_NAME}/${dirent.name}`),
  output: {
    dir: 'build',
    format: 'es',
    preserveModules: true,
  },
  plugins: [typescript(), terser()],
};
