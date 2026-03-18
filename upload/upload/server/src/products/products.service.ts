import { Injectable, OnModuleInit } from '@nestjs/common';
import { Product, FindAllParams } from './types';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService implements OnModuleInit {
  private products: Product[] = [];
  private categories = ['全部', '编程', '机器人', '电子', '3D打印', '人工智能', '传感器', '航空航天'];
  private dataPath = path.join(__dirname, '../../data', 'products.json');

  onModuleInit() {
    this.loadProductsFromFile();
  }

  private loadProductsFromFile() {
    try {
      const filePath = this.dataPath;
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        this.products = JSON.parse(data);
        console.log(`成功加载 ${this.products.length} 个产品数据`);
      } else {
        console.warn('产品数据文件不存在，使用默认数据');
        this.products = this.getDefaultProducts();
        this.saveProductsToFile();
      }
    } catch (error) {
      console.error('加载产品数据失败:', error);
      this.products = this.getDefaultProducts();
    }
  }

  private saveProductsToFile() {
    try {
      const filePath = this.dataPath;
      const dataDir = path.dirname(filePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(this.products, null, 2), 'utf-8');
      console.log('产品数据已保存到文件');
    } catch (error) {
      console.error('保存产品数据失败:', error);
    }
  }

  private getDefaultProducts(): Product[] {
    return [
      {
        id: 1,
        name: '智能编程机器人项目',
        description: '适合8-12岁儿童的图形化编程机器人项目，支持Scratch编程，培养逻辑思维能力',
        category: '机器人',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
        ageRange: '8-12岁',
        tags: ['编程', '机器人', 'Scratch'],
        teacherName: '张老师',
        teacherPhone: '138****1234',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 2,
        name: '电子创客入门项目',
        description: '包含LED、传感器、按钮等电子元件，让孩子动手制作电子项目',
        category: '电子',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=400&fit=crop',
        ageRange: '10-15岁',
        tags: ['电子', '创客', 'STEM'],
        teacherName: '李老师',
        teacherPhone: '139****5678',
        createdAt: new Date('2024-01-02'),
      },
      {
        id: 3,
        name: '3D打印创意项目',
        description: '入门级3D打印项目，包含设计软件和基础教程',
        category: '3D打印',
        image: 'https://images.unsplash.com/photo-1535378437327-b7107adfb2f6?w=400&h=400&fit=crop',
        ageRange: '12-16岁',
        tags: ['3D打印', '设计', '创意'],
        teacherName: '王老师',
        teacherPhone: '136****9012',
        createdAt: new Date('2024-01-03'),
      },
      {
        id: 4,
        name: 'AI视觉识别项目',
        description: '基于人工智能的视觉识别项目，支持图像分类、物体检测',
        category: '人工智能',
        image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=400&fit=crop',
        ageRange: '13-18岁',
        tags: ['AI', '计算机视觉', '机器学习'],
        teacherName: '赵老师',
        teacherPhone: '135****3456',
        createdAt: new Date('2024-01-04'),
      },
    ];
  }

  async findAll(params: FindAllParams) {
    // 每次都重新从文件加载数据，确保与管理后台数据同步
    this.loadProductsFromFile();
    let filtered = [...this.products];

    if (params.category && params.category !== '全部') {
      filtered = filtered.filter((p) => p.category === params.category);
    }

    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword) ||
          p.tags.some((tag) => tag.toLowerCase().includes(keyword)),
      );
    }

    const total = filtered.length;
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const data = filtered.slice(start, end);

    return {
      code: 200,
      msg: 'success',
      data: {
        list: data,
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async findOne(id: number) {
    // 每次都重新从文件加载数据
    this.loadProductsFromFile();
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      return {
        code: 404,
        msg: 'Product not found',
        data: null,
      };
    }

    return {
      code: 200,
      msg: 'success',
      data: product,
    };
  }

  async getCategories() {
    return {
      code: 200,
      msg: 'success',
      data: this.categories,
    };
  }

  async getHotProducts() {
    const hotProducts = [...this.products]
      .slice(0, 10);

    return {
      code: 200,
      msg: 'success',
      data: hotProducts,
    };
  }

  // 获取活动列表
  async getActivities() {
    try {
      const dataPath = path.join(process.cwd(), 'data', 'activities.json');
      if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf-8');
        const activities = JSON.parse(data);
        return {
          code: 200,
          msg: 'success',
          data: activities,
        };
      } else {
        return {
          code: 200,
          msg: 'success',
          data: [],
        };
      }
    } catch (error) {
      console.error('读取活动数据失败:', error);
      return {
        code: 500,
        msg: '读取活动数据失败',
        data: [],
      };
    }
  }

  // 创建产品
  async create(productData: Omit<Product, 'id' | 'createdAt'>) {
    const newProduct: Product = {
      ...productData,
      id: Date.now(),
      createdAt: new Date(),
    };
    this.products.push(newProduct);
    this.saveProductsToFile();
    return {
      code: 200,
      msg: '创建成功',
      data: newProduct,
    };
  }

  // 更新产品
  async update(id: number, productData: Partial<Product>) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        code: 404,
        msg: 'Product not found',
        data: null,
      };
    }

    this.products[index] = {
      ...this.products[index],
      ...productData,
      id, // 确保ID不被修改
    };
    this.saveProductsToFile();
    return {
      code: 200,
      msg: '更新成功',
      data: this.products[index],
    };
  }

  // 删除产品
  async delete(id: number) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        code: 404,
        msg: 'Product not found',
        data: null,
      };
    }

    this.products.splice(index, 1);
    this.saveProductsToFile();
    return {
      code: 200,
      msg: '删除成功',
      data: { id },
    };
  }
}
