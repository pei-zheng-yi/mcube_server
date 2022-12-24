import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * 是否公开访问
 * 不设置均为授权访问，相当于传[true]
 * @param val {boolean} 是否公开
 * @default val 默认:true
 */
export const Public = (val = true) => SetMetadata(IS_PUBLIC_KEY, val);
