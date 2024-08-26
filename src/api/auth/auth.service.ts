import {
    ConflictException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async signIn(signDto: SignInDto): Promise<{ access_token: string }> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: signDto.email,
            },
        });
        if (user && (await compare(signDto.password, user.password))) {
            return {
                access_token: await this.jwtService.signAsync({ ...user }),
            };
        } else {
            throw new ForbiddenException('Invalid email or password.');
        }
    }

    async signUp(
        signDto: SignUpDto,
        hostUrl: string,
    ): Promise<{ access_token: string }> {
        let user = await this.prismaService.user.findUnique({
            where: {
                email: signDto.email,
            },
        });
        if (user) {
            throw new ConflictException('Email already exists.');
        }
        user = await this.prismaService.user.create({
            data: {
                password: await hash(signDto.password, 10),
                name: signDto.name,
                email: signDto.email,
                roles: ['USER'],
                cart: {
                    create: {},
                },
            },
        });

        await this.generateVerifyUrl(hostUrl, user.id);

        return {
            access_token: await this.jwtService.signAsync({ ...user }),
        };
    }

    async generateVerifyUrl(hostUrl: string, userId: number): Promise<string> {
        const token = await this.jwtService.signAsync(
            { userId },
            { expiresIn: '1m' },
        );
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });
        const url = `${hostUrl}/auth/verify?token=${token}`;
        await this.sendEmail(user.email, url);
        return url;
    }

    async sendEmail(email: string, message: string): Promise<string> {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            auth: {
                user: this.configService.get<string>('EMAIL_USERNAME'),
                pass: this.configService.get<string>('EMAIL_PASSWORD'),
            },
        });
        await transporter.sendMail({
            from: `Support! <hi@arashdev.top>`,
            to: email,
            subject: 'Verification email',
            text: message,
        });
        return 'email have been sent.';
    }

    async verifyUrl(token: string): Promise<{ message: string }> {
        try {
            const { userId } = await this.jwtService.verifyAsync(token);
            await this.prismaService.user.update({
                where: {
                    id: Number(userId),
                },
                data: {
                    status: 'VERIFIED',
                },
            });
        } catch (error) {
            console.log(error);
            throw new ForbiddenException('Invalid or expired url.');
        }
        return {
            message: 'Your email verified.',
        };
    }
}
