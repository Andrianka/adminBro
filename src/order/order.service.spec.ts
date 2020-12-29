import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import CreateOrderDto from './dto/create-order.dto';
import { User } from '../user/user.entity';

jest.mock('class-validator', () => ({
  validate: jest.fn(),
}));

describe('UserService', () => {
  let service: OrderService;

  const user = ({ id: 'userId', email: 'test@mail.com' } as unknown) as User;
  const products = [
    {
      id: 'productId',
      title: 'product title',
      description: '<p>description</p>',
      price: '10.00',
      quantity: 5,

      isAvailable: true,
      categories: [
        {
          id: 'cd76bf42-cbfd-445c-baf3-680708253dde',
          title: 'agd',
        },
      ],
    },
    {
      id: 'anotherProductId',
      title: 'product title',
      description: '<p>description</p>',
      price: '10.00',
      quantity: 5,
      isAvailable: true,
      categories: [
        {
          id: 'cd76bf42-cbfd-445c-baf3-680708253dde',
          title: 'agd',
        },
      ],
    },
  ];
  const mockOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#findAll', () => {
    it('should return list with all orders', async () => {
      const order1 = { id: 'thisId', userId: user.id, totalPrice: 10 };
      const order2 = { id: 'thisId2', userId: user.id, totalPrice: 12 };

      mockOrderRepository.find.mockReturnValueOnce([order1, order2]);

      const result = await service.findAll();

      expect(result).toEqual([order1, order2]);

      expect(mockOrderRepository.find).toHaveBeenCalled();
    });
  });

  describe('#findOne', () => {
    it('should return order', async () => {
      const order = { id: 'thisId', userId: user.id, totalPrice: 10 };

      mockOrderRepository.findOne.mockReturnValueOnce(order);

      const result = service.findOne(order.id);

      expect(result).resolves.toEqual(order);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith(order.id);
    });
  });

  describe('#create', () => {
    it('should create order', async () => {
      const order = { id: 'thisId', userId: user.id, totalPrice: 20 };
      const orderData = ({
        cartItems: [
          { productId: products[0].id, quantity: 1 },
          { productId: products[1].id, quantity: 1 },
        ],
      } as unknown) as CreateOrderDto;
      const { cartItems, ...createData } = orderData;

      jest
        .spyOn(service as any, 'setTotalPrice')
        .mockImplementation(() => order.totalPrice);
      mockOrderRepository.save.mockResolvedValue(order);

      const result = await service.create(orderData, user);

      expect(mockOrderRepository.save).toHaveBeenCalledWith({
        cartItems,
        totalPrice: order.totalPrice,
        user: user,
      });

      expect(result).toEqual(order);
    });
  });
});
