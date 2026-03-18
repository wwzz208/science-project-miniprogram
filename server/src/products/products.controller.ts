import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findAll({
      category,
      keyword,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() productData: Omit<Product, 'id' | 'createdAt'>) {
    return this.productsService.create(productData);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() productData: Partial<Product>) {
    return this.productsService.update(id, productData);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }

  @Get('category/list')
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('recommend/hot')
  getHotProducts() {
    return this.productsService.getHotProducts();
  }

  // 获取活动列表
  @Get('activities')
  getActivities() {
    return this.productsService.getActivities();
  }
}
