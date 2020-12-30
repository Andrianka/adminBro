import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { UserService } from './user.service';
import { User } from '../user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let hashPassword: jest.Mock;

  const mockValidate = validate as jest.Mock;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#findAll', () => {
    it('should return list of users', async () => {
      const user1 = { id: 'thisId', email: 'user@mail.com' };
      const user2 = { id: 'anotherId', email: 'user2@mail.com' };

      mockUserRepository.find.mockReturnValueOnce([user1, user2]);

      const result = await service.findAll();

      expect(result).toEqual([user1, user2]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it('should return empty list of users', async () => {
      mockUserRepository.find.mockReturnValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('#findOne', () => {
    it('should return user', async () => {
      const user = ({
        id: 'thisId',
        email: 'user@mail.com',
      } as unknown) as User;

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = service.findOne(user.id);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(user.id);
      await expect(result).resolves.toEqual(user);
    });

    it('should not return user', async () => {
      const wrongId = 'anotherId';

      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = service.findOne(wrongId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(wrongId);
      await expect(result).rejects.toThrow('User with this id does not exist');
    });
  });

  describe('#getProfile', () => {
    it('should return user', async () => {
      const user = ({
        id: 'thisId',
        email: 'user@mail.com',
      } as unknown) as User;

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = service.getProfile(user);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(user.id);
      await expect(result).resolves.toEqual(user);
    });
  });

  describe('#getByEmail', () => {
    it('should return user', async () => {
      const user1 = { id: 'thisId', email: 'user@mail.com' };

      mockUserRepository.findOne.mockReturnValueOnce(user1);

      const result = service.getByEmail(user1.email);

      await expect(result).resolves.toEqual(user1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: user1.email,
      });
    });

    it('should not return user', async () => {
      const wrongEmail = 'anotherEmail';

      mockUserRepository.findOne.mockReturnValueOnce(undefined);

      const result = service.getByEmail(wrongEmail);

      await expect(result).rejects.toThrow(
        'User with this email does not exist',
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: wrongEmail,
      });
    });
  });

  describe('#create', () => {
    it('should create user', async () => {
      const user = ({
        id: 1,
        email: 'user@mail.com',
        password: 'new_password_hash',
      } as unknown) as User;

      const userData = ({
        email: 'user@mail.com',
        password: 'new_password',
      } as unknown) as CreateUserDto;

      const hashPassword = jest
        .spyOn(service as any, 'hashPassword')
        .mockImplementation(() => user.password);

      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(userData);

      expect(result).toEqual(user);

      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...userData,
        password: user.password,
      });
    });
  });

  describe('#update', () => {
    it('should update user', async () => {
      const user = ({
        id: 1,
        email: 'user@mail.com',
        password: 'new_password_hash',
        firstName: 'first_name',
      } as unknown) as User;

      const updatedUser = ({
        id: 1,
        email: 'user@mail.com',
        password: 'new_password_hash',
        firstName: 'Changed',
      } as unknown) as User;

      const userData = ({
        email: 'user@mail.com',
        password: 'new_password',
        firstName: 'Changed',
      } as unknown) as UpdateUserDto;

      mockUserRepository.update.mockResolvedValue(updatedUser);

      jest.spyOn(service as any, 'findOne').mockImplementation(() => user);

      const result = await service.update(user, userData);

      expect(result).toEqual(user);

      expect(mockUserRepository.update).toHaveBeenCalledWith(user.id, userData);
    });
  });

  describe('#delete', () => {
    it('should return {deleted: true}', async () => {
      const user = ({
        id: 1,
        email: 'user@mail.com',
      } as unknown) as User;
      jest.spyOn(service as any, 'findOne').mockImplementation(() => user);
      mockUserRepository.delete.mockResolvedValue(null);

      const result = service.delete(user);

      await expect(result).resolves.toEqual(null);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(user.id);
    });
  });
});
