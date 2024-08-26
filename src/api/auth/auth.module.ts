import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('SECRET'),
                signOptions: {
                    expiresIn: '100d',
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
