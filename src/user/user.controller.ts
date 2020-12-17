import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './interfaces/user.interface';
import UpdateUserDto from './dto/update-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public async getUsers(): Promise<UserResponse[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  public async getUser(@Param('id') id): Promise<UserResponse> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @Param('id') id,
    @Body() userData: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.userService.update(id, userData);
  }

  @Delete(':id')
  public async delete(@Param('id') id): Promise<any> {
    return this.userService.delete(id);
  }
}
