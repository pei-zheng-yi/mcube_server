import { IsEmail, IsMobilePhone, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '请填写账户名' })
  name: string;

  nickName?: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @IsMobilePhone('zh-CN')
  phone?: string;

  roles?: number[];

  @IsString({ message: '头像设置不正确' })
  avatar?: string;

  status?: number;
}
