import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Request } from 'express';
import { UserPayload } from '../../utils/Payload';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtGuard } from './jwt.guard';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signIn')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
        return await this.authService.signIn(signInDto);
    }

    @Post('signUp')
    async signUp(
        @Body(new ValidationPipe()) signUpDto: SignUpDto,
        @Req() req: Request,
    ) {
        const port = process.env.PORT;
        const hostUrl = `${req.protocol}://${req.hostname}${port === '3000' ? ':' + port : ''}`;
        return await this.authService.signUp(signUpDto, hostUrl);
    }

    @ApiOkResponse({
        description: 'Generate new access token.',
    })
    @Post('refresh')
    async getAccessToken(@Body(new ValidationPipe()) authDto: TokenDto) {
        return await this.authService.refresh(authDto.refreshToken);
    }

    @ApiOkResponse({
        description: 'Checks verification email.',
    })
    @Get('verify')
    async verify(@Query('token') token: string) {
        return await this.authService.verifyUrl(token);
    }

    @ApiOkResponse({
        description:
            'will generate new verification url and send to user email.',
    })
    @UseGuards(JwtGuard)
    @Post('resend')
    async resendVerifyUrl(@Req() req: Request) {
        const user: UserPayload = req['user'];
        const port = process.env.PORT;
        const hostUrl = `${req.protocol}://${req.hostname}${port === '3000' ? ':' + port : ''}`;
        await this.authService.generateVerifyUrl(hostUrl, user.id);
        return 'Check your email.';
    }
}
