import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { CommentModule } from './api/comment/comment.module';
import { CategoryModule } from './api/category/category.module';
import { ItemModule } from './api/item/item.module';
import { InvoiceModule } from './api/invoice/invoice.module';
import { CartModule } from './api/cart/cart.module';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dest: './' + configService.get<string>('UPLOADS'),
            }),
        }),
        ServeStaticModule.forRootAsync({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                }),
            ],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => [
                {
                    rootPath: path.join(
                        __dirname,
                        '..',
                        configService.get<string>('UPLOADS'),
                    ),
                    serveRoot: `/${configService.get<string>('UPLOADS')}`,
                },
            ],
        }),
        UserModule,
        CommentModule,
        CategoryModule,
        ItemModule,
        InvoiceModule,
        CartModule,
        AuthModule,
    ],
})
export class AppModule {}
