import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { SearchService } from '../search/search.service';
import { ProductElasticIndex } from '../search/search-index/product.elastic.index';
import { SearchServiceInterface } from '../search/interface/search.service.interface';
import { ProductSubscriber } from './subscribers/product.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [
    {
      provide: 'SearchServiceInterface',
      useClass: SearchService,
    },
    ProductElasticIndex,
    ProductSubscriber,
  ],
  controllers: [],
  exports: [],
})
export class ObserverModule {}
