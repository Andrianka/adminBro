import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import CredentialsDto from './dto/credentials.dto';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { LocalAuthGuard } from './guards/localAuth.guard';
import {
  PasswordResetDto,
  RequestPasswordResetDto,
} from '../user/dto/password-reset.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
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

  @Post('password/request-reset')
  public async requestPasswordReset(
    @Body() { email }: RequestPasswordResetDto,
  ): Promise<void> {
    return this.authService.requestPasswordReset(email);
  }

  @Put('password')
  public async resetPassword(@Body() { newPassword, token }: PasswordResetDto) {
    return this.authService.resetPassword(token, newPassword);
  }
}
