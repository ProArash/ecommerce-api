import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCartDto {
    @ApiProperty()
    @IsNotEmpty()
    itemId: number;
}
