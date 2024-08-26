import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Put,
    Req,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserPayload } from '../../utils/Payload';
import { Request } from 'express';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { CartInterceptor } from './cart.interceptor';

@UseInterceptors(CartInterceptor)
@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @ApiOkResponse({
        description: 'return cart includes item and user details.',
    })
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Get()
    async getCartByUserId(@Req() req: Request) {
        const user: UserPayload = req['user'];

        return await this.cartService.getCartByUserId(user.id);
    }

    @ApiOkResponse({
        description: 'return cart includes item and user details.',
    })
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Put()
    async updateCart(
        @Body(new ValidationPipe()) cartDto: UpdateCartDto,
        @Req() req: Request,
    ) {
        const user: UserPayload = req['user'];
        return await this.cartService.updateCart(cartDto, user.id);
    }
}
