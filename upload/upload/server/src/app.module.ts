import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ProductsModule } from '@/products/products.module';
import { AiModule } from '@/ai/ai.module';
import { AdminModule } from '@/admin/admin.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    // 配置模块：加载环境变量
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), '..', '.env.local'),
    }),
    ProductsModule,
    AiModule,
    AdminModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
