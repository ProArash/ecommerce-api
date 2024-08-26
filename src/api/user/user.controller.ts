import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserPayload } from '../../utils/Payload';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOkResponse({
        description:
            'will return current user by given userId without population.',
    })
    @UseGuards(JwtGuard)
    @Get('profile')
    async getProfile(@Req() req: Request) {
        const user: UserPayload = req['user'];
        return await this.userService.getUserById(user.id);
    }

    @ApiOkResponse({
        description: 'will return user by given userId without population.',
    })
    @UseGuards(JwtGuard)
    @Get(':id')
    async getUserById(@Param('id') param: any) {
        return await this.userService.getUserById(param);
    }

    @ApiOkResponse({
        description:
            'will return user items by given userId without population.',
    })
    @UseGuards(JwtGuard)
    @Get(':id/items')
    async getUserItemsById(@Param('id') param: any) {
        return await this.userService.getUserItemsById(param);
    }

    @ApiOkResponse({
        description:
            'will return user invoices by given userId without population.',
    })
    @UseGuards(JwtGuard)
    @Get(':id/invoices')
    async getUserInvoicesById(@Param('id') param: any) {
        return await this.userService.getUserInvoicesById(param);
    }

    @ApiOkResponse({
        description:
            'will return user cart by given userId without population.',
    })
    @UseGuards(JwtGuard)
    @Get(':id/cart')
    async getUserCartById(@Param('id') param: any) {
        return await this.userService.getUserCartById(param);
    }

    @ApiOkResponse({
        description: 'will return user by given userId without population.',
    })
    @UseGuards(JwtGuard)
    @Get('users')
    async getUsers() {
        return await this.userService.getUsers();
    }
}
