import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import CredentialsDto from './dto/credentials.dto';
import tokenPayload from './interfaces/tokenPayload.interface';
import { AuthResponse } from './interfaces/authResponse.interface';

import { generateToken } from '../utils/generateToken';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  public async validateUser(email: string, new_password: string) {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(new_password, user.password);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await argon2.verify(
      hashedPassword,
      plainTextPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  login(user: User): AuthResponse {
    const accessToken = this.getAccessToken({
      id: user.id,
      email: user.email,
    });
    return { accessToken };
  }

  private getAccessToken(payload: tokenPayload): string {
    return this.jwtService.sign(payload);
  }

  async register(userData: CredentialsDto) {
    const checkUserExist = await this.userService.checkByEmail(userData.email);
    if (checkUserExist) {
      throw new HttpException(
        'User with that email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.userService.create(userData);
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    const token = generateToken(email);
    const user = await this.userService.getByEmail(email);
    if (user) {
      await this.userService.updatePasswordReset(user, token);

      const content = {
        user,
        url: 'url_to_change_password',
      };
      await this.mailService.send({
        emailTo: user.email,
        template: 'request-password-reset',
        content,
      });
    }
  }

  public async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<AuthResponse> {
    const user = await this.userService.updatePassword(token, newPassword);

    if (!user) {
      throw new NotFoundException(
        'Password was reset or customer does not exist',
      );
    }

    return this.login(user);
  }
}
