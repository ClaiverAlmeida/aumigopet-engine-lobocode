import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './shared/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { CaslModule } from './shared/casl/casl.module';
import { ProductsModule } from './modules/products/products.module';

//javascript es7

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, PostsModule,ProductsModule, CaslModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

//vai ficar num modulo
