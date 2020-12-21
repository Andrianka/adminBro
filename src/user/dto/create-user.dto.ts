import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserInterface } from '../interfaces/create-user.interface';

class CreateUserDto implements CreateUserInterface {
  @IsNotEmpty() @IsEmail() email: string;
  firstName?: string;
  lastName?: string;
  @IsNotEmpty() password: string;
  photo?: any;
}

export default CreateUserDto;
