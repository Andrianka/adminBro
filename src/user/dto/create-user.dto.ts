import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserInterface } from '../interfaces/create-user.interface';
import { ApiProperty } from '@nestjs/swagger';

class CreateUserDto implements CreateUserInterface {
  @ApiProperty({
    example: 'test@mail.com',
    description: 'The email of the User',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'firstName',
    description: 'The first name of the User',
  })
  firstName?: string;

  @ApiProperty({
    example: 'lastName',
    description: 'The last name of the User',
  })
  lastName?: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the User',
  })
  @IsNotEmpty()
  password: string;

  photo?: any;
}

export default CreateUserDto;
