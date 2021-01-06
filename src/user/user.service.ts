import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserResponse } from './interfaces/user.interface';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';

import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  public async getProfile(currentUser: User): Promise<User> {
    const user = await this.userRepository.findOne(currentUser.id);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto): Promise<UserResponse> {
    const hashedPassword = await this.hashPassword(userData.password);
    const newUser = await this.userRepository.save({
      ...userData,
      password: hashedPassword,
    });
    const content = {
      user: userData,
    };
    await this.mailService.send({
      emailTo: newUser.email,
      template: 'user-register',
      content,
    });
    return newUser;
  }

  public async update(
    currentUser: User,
    userData: UpdateUserDto,
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

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (user) return user;

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async checkByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (user) return user;

    return null;
  }

  public async updatePassword(
    token: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { passwordReset: { token: token } },
    });
    user.password = await this.hashPassword(newPassword);
    user.passwordReset = { token: null, createdAt: null };
    return await user.save();
  }

  public async updatePasswordReset(user: User, token: string) {
    await this.userRepository.update(user.id, {
      passwordReset: {
        token: token,
        createdAt: new Date(Date.now()),
      },
    });
  }

  private async hashPassword(passwordInPlaintext): Promise<string> {
    return await argon2.hash(passwordInPlaintext);
  }
}
