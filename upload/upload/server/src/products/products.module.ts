import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

@Module({
  controllers: [ProductsController, ActivitiesController],
  providers: [ProductsService, ActivitiesService],
  exports: [ProductsService],
})
export class ProductsModule {}
