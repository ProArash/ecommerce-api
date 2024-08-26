import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from '../auth/jwt.guard';
import { NewCommentDto } from './dto/new-comment.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @ApiCreatedResponse({
        description: 'will return comment object with related user.',
    })
    @UseGuards(JwtGuard)
    @Post()
    async newComment(@Body(new ValidationPipe()) cmDto: NewCommentDto) {
        return await this.commentService.newComment(cmDto);
    }

    @ApiOkResponse({
        description: 'will return comments by given itemId with related user.',
    })
    @UseGuards(JwtGuard)
    @Get(':id')
    async getCommentByItemId(@Param('id') params: any) {
        return await this.commentService.getCommentsByItemId(Number(params));
    }
}
