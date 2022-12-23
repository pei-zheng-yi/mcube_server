import { Injectable } from '@nestjs/common';
import { parseUserAgent } from './utils/ua.utils';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
