import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

export type User = {
  userId: number;
  userName: string;
  password: string;
  age: number;
};

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}
  async validateUser(username: string, password: string): Promise<Partial<User> | null> {
    const user = await this.userService.findOneByName(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>) {
    const payload = { userName: user.userName, sub: user.userId };
    const token = this.jwtService.sign(payload);
    return {
      data: {
        ...user,
        token,
      },
      message: '登录成功！',
    };
  }
}
