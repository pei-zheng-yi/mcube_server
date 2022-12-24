import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

export type User = any;

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.find(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { userName: user.userName, sub: user.id };
    const token = this.jwtService.sign(payload);
    return {
      ...user,
      token,
    };
  }
}
