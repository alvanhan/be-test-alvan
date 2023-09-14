import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberDto {
    _id: string;
    code: string;

    @ApiProperty({
        description: 'Member name',
        example: 'Alvan Han',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
