import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'isEmail' })
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  firstName?: string;
  @IsOptional()
  lastName?: string;

  @IsOptional()
  photo?: any;

  @IsOptional()
  passwordResetToken: string;
}

export default UpdateUserDto;
