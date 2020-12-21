import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserResponse } from './interfaces/user.interface';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';

import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async create(userData: CreateUserDto): Promise<UserResponse> {
    const newUser = this.userRepository.create(userData);
    newUser.password = await this.hashPassword(userData.password);
    return newUser.save();
  }

  public async update(
    userData: UpdateUserDto,
    currentUser: User,
  ): Promise<User> {
    await this.userRepository.update(currentUser.id, userData);
    const updatedUser = await this.findOne(currentUser.id);
    return updatedUser;
  }

  public async delete(currentUser: User): Promise<DeleteResult> {
    const user = await this.findOne(currentUser.id);
    if (user) {
      return await this.userRepository.delete(user.id);
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) return user;

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async checkByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) return user;

    return null;
  }

  private async hashPassword(passwordInPlaintext): Promise<string> {
    return await argon2.hash(passwordInPlaintext);
  }
}
