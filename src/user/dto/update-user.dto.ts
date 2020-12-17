import { IsEmail, IsNotEmpty } from 'class-validator';

class UpdateUserDto {
  @IsNotEmpty() @IsEmail() email: string;
  firstName: string;
  lastName: string;
}

export default UpdateUserDto;
