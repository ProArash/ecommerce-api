import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NewCommentDto {
    @ApiProperty()
    @IsNotEmpty()
    text: string;

    @ApiProperty()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsNotEmpty()
    itemId: number;
}
