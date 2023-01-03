import { isProdMode } from './../app.environment';
import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform, Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // tslint:disable-next-line
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      disableErrorMessages: isProdMode,
    });
    if (errors.length > 0) {
      const errObj = {};
      errors.forEach((err) => {
        const { property, constraints } = err;
        errObj[property] = Object.values(constraints)[0];
      });
      throw new HttpException(
        { message: '请求参数校不合法！', error: isProdMode ? null : errObj },
        HttpStatus.BAD_REQUEST
      );
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
