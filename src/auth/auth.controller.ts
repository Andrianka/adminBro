import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import CredentialsDto from './dto/credentials.dto';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { LocalAuthGuard } from './guards/localAuth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: CredentialsDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return this.authService.login(request.user);
  }
}
