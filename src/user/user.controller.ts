import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ClassSerializerInterceptor,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './interfaces/user.interface';
import UpdateUserDto from './dto/update-user.dto';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';

import JwtAuthenticationGuard from '../auth/guards/jwtAuth.guard';

@Controller('user')
@UseGuards(JwtAuthenticationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public async getUsers(): Promise<UserResponse[]> {
    return this.userService.findAll();
  }

  @Get('profile')
  public async getUserProfile(
    @Req() req: RequestWithUser,
  ): Promise<UserResponse> {
    return this.userService.getProfile(req.user);
  }

  @Get(':id')
  public async getUser(@Param('id') id): Promise<UserResponse> {
    return this.userService.findOne(id);
  }

  @Patch()
  public async update(
    @Body() userData: UpdateUserDto,
    @Req() req: RequestWithUser,
  ): Promise<UserResponse> {
    return this.userService.update(req.user, userData);
  }

  @Delete()
  public async delete(@Req() req: RequestWithUser): Promise<any> {
    return this.userService.delete(req.user);
  }
}
