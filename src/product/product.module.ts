import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SearchModule } from '../search/search.module';
import { SearchService } from '../search/search.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'SearchServiceInterface',
      useClass: SearchService,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
