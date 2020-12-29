import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

describe('UserService', () => {
  let service: ProductService;

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#findAll', () => {
    it('should return list with available=true products', async () => {
      const product = { id: 'thisId', available: true };
      const productNotAvailable = { id: 'thisId', available: false };

      mockProductRepository.find.mockReturnValueOnce([product]);

      const result = await service.findAll(true);

      expect(result).toEqual([product]);
      expect(mockProductRepository.find).toHaveBeenCalledWith({
        isAvailable: true,
      });
    });

    it('should return list with available=false products', async () => {
      const product = { id: 'thisId', available: true };
      const productNotAvailable = { id: 'thisId', available: false };

      mockProductRepository.find.mockReturnValueOnce([productNotAvailable]);

      const result = await service.findAll(false);

      expect(result).toEqual([productNotAvailable]);

      expect(mockProductRepository.find).toHaveBeenCalledWith({
        isAvailable: false,
      });
    });

    it('should return list with all products', async () => {
      const product = { id: 'thisId', available: true };
      const productNotAvailable = { id: 'thisId', available: false };

      mockProductRepository.find.mockReturnValueOnce([
        product,
        productNotAvailable,
      ]);

      const result = await service.findAll(null);

      expect(result).toEqual([product, productNotAvailable]);

      expect(mockProductRepository.find).toHaveBeenCalled();
    });
  });

  describe('#findOne', () => {
    it('should return product with available=null', async () => {
      const product = { id: 'thisId', available: true };

      mockProductRepository.findOne.mockReturnValueOnce(product);

      const result = service.findOne(product.id, null);

      expect(result).resolves.toEqual(product);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith(product.id);
    });

    it('should return product with available=true', async () => {
      const product = { id: 'thisId', available: true };

      mockProductRepository.findOne.mockReturnValueOnce(product);

      const result = service.findOne(product.id, true);

      expect(result).resolves.toEqual(product);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        id: product.id,
        isAvailable: true,
      });
    });

    it('should return product with available=false', async () => {
      const product = { id: 'thisId', available: false };

      mockProductRepository.findOne.mockReturnValueOnce(product);

      const result = service.findOne(product.id, false);

      expect(result).resolves.toEqual(product);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        id: product.id,
        isAvailable: false,
      });
    });

    it('should not return product with available=true', async () => {
      const wrongId = 'anotherId';

      mockProductRepository.findOne.mockReturnValueOnce(undefined);

      const result = service.findOne(wrongId, true);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        id: wrongId,
        isAvailable: true,
      });
      await expect(result).rejects.toThrow('Product not found');
    });

    it('should not return product with available=false', async () => {
      const wrongId = 'anotherId';

      mockProductRepository.findOne.mockReturnValueOnce(undefined);

      const result = service.findOne(wrongId, false);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        id: wrongId,
        isAvailable: false,
      });
      await expect(result).rejects.toThrow('Product not found');
    });

    it('should not return product with available=null', async () => {
      const wrongId = 'anotherId';

      mockProductRepository.findOne.mockReturnValueOnce(undefined);

      const result = service.findOne(wrongId, null);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith(wrongId);

      await expect(result).rejects.toThrow('Product not found');
    });
  });
});
