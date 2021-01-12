import { Module, OnModuleInit } from '@nestjs/common';

import { SearchService } from './search.service';

@Module({
  imports: [],
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
