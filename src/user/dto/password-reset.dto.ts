import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail({}, { message: 'isEmail' })
  public email!: string;
}

export class PasswordResetDto {
  @IsNotEmpty({ message: 'isNotEmpty' })
  public token!: string;

  @IsNotEmpty({ message: 'isNotEmpty' })
  public newPassword!: string;
}
