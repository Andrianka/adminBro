import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CredentialsDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'test@mail.com',
    description: 'The email of the User',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    example: 'password',
    description: 'The password of the User',
  })
  password: string;

  @IsString()
  @ApiProperty({
    example: 'lastName',
    description: 'The last name of the User',
  })
  firstName?: string;

  @IsString()
  @ApiProperty({
    example: 'lastName',
    description: 'The last name of the User',
  })
  lastName?: string;
}

export default CredentialsDto;
