import { Public } from '@app/src/decorators/auth.decorator';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userService.findOne(req.user.userId);
    if (!user) return null;
    const { password, ...userInfo } = user;
    return userInfo;
  }
}
