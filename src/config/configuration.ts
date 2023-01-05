import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

import * as yaml from 'js-yaml';

const isProd = process.env.NODE_ENV === 'production';

const devConfig = 'config.dev.yaml';

const prodConfig = 'config.yaml';

export default () => {
  console.log(join(__dirname, devConfig));
  if (!existsSync(join(__dirname, devConfig)) && !existsSync(join(__dirname, prodConfig))) {
    throw new Error('缺少环境配置文件');
  }
  return yaml.load(readFileSync(join(__dirname, isProd ? prodConfig : devConfig), 'utf-8')) as Record<string, any>;
};
