import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

class CredentialsDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}

export default CredentialsDto;
