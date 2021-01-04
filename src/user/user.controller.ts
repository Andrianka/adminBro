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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserResponse } from './interfaces/user.interface';
import UpdateUserDto from './dto/update-user.dto';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';

import JwtAuthenticationGuard from '../auth/guards/jwtAuth.guard';
import { User } from './user.entity';

@ApiBearerAuth()
@ApiTags('users')
@Controller('user')
@UseGuards(JwtAuthenticationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: User,
  })
  public async getUsers(): Promise<UserResponse[]> {
    return this.userService.findAll();
  }

  @Get('profile')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  public async getUserProfile(
    @Req() req: RequestWithUser,
  ): Promise<UserResponse> {
    return this.userService.getProfile(req.user);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  public async getUser(@Param('id') id): Promise<UserResponse> {
    return this.userService.findOne(id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user' })
  public async update(
    @Body() userData: UpdateUserDto,
    @Req() req: RequestWithUser,
  ): Promise<UserResponse> {
    return this.userService.update(req.user, userData);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user' })
  public async delete(@Req() req: RequestWithUser): Promise<any> {
    return this.userService.delete(req.user);
  }
}
