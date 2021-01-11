import { forwardRef, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      useFactory: async () => ({
        node: 'http://localhost:9200',
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
      }),
    }),
    forwardRef(() => ProductModule),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
// export class SearchModule implements OnModuleInit {
//   constructor(private searchService: SearchService) {}
//   onModuleInit() {
//     this.searchService.createIndex().then();
//   }
// }
export class SearchModule {}
