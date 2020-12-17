import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string, done: any): Promise<User> {
    try {
      return done(null, this.authService.validateUser(email, password));
    } catch (error) {
      return done(error);
    }
  }
}
