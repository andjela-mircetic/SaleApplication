import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.config';
import { Administrator } from 'src/entities/administrator.entity';
import { ArticleFeature } from 'src/entities/article-feature.entity';
import { ArticlePrice } from 'src/entities/article-price.entity';
import { Article } from 'src/entities/article.entity';
import { CartArticle } from 'src/entities/cart-article.entity';
import { Cart } from 'src/entities/cart.entity';
import { Category } from 'src/entities/category.entity';
import { Feature } from 'src/entities/feature.entity';
import { Order } from 'src/entities/order.entity';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/user.entity';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { AdministratorService } from './services/administrator/administrator.service';
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './controllers/api/category.controller';
import { ArticleService } from './services/article/article.service';
import { ArticleController } from './controllers/api/article.controller';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PhotoService } from './services/photo/photo.service';
import { FeatureService } from './services/feature/feature.service';
import { FeatureController } from './controllers/api/feature.controller';
import { UserService } from './services/user/user.service';
import { CartService } from './services/cart/cart.service';
import { UserCartController } from './controllers/api/user.cart.controller';
import { OrderService } from './services/order/order.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from 'config/mail.config';
import { OrderMailer } from './services/order/order.mailer.service';
import { AdministratorOrderController } from './controllers/api/administrator.order.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [ Administrator,
      ArticleFeature,ArticlePrice,Article,Cart,
       CartArticle, Category, Feature,
        Order, Photo, User ]
    }),
    TypeOrmModule.forFeature([Administrator,
    Category, Article, Order, User, 
    ArticlePrice, ArticleFeature, 
    Photo, Cart, Feature, CartArticle]),
    MailerModule.forRoot({
      transport: 'smtps://' + MailConfig.username +
       ':' + MailConfig.password + '@' + MailConfig.hostname,
       defaults:{
        from: MailConfig.senderEmail,
       }
    }),
  ],
  controllers: [AppController, 
    AdministratorController, 
    CategoryController, 
    ArticleController,
  AuthController,
FeatureController, 
UserCartController,
AdministratorOrderController],
    
  providers: [AdministratorService,
     CategoryService, 
     ArticleService,
    PhotoService,
  FeatureService, 
  UserService, 
  CartService, OrderService,
OrderMailer,],
  exports:[
    AdministratorService, UserService, 
  ]
})
export class AppModule  implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware)
    .exclude('auth/*')
    .forRoutes('api/*');
  }
}
