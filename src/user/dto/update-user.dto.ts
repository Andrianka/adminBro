import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'isEmail' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@mail.com',
    description: 'The email of the User',
  })
  email?: string;

  @IsOptional()
  @ApiProperty({
    example: 'firstName',
    description: 'The first name of the User',
  })
  firstName?: string;

  @IsOptional()
  @ApiProperty({
    example: 'lastName',
    description: 'The last name of the User',
  })
  lastName?: string;

  @IsOptional()
  photo?: any;
}

export default UpdateUserDto;
