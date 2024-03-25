import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({
    type: String,
    description: 'artist name',
    example: 'Vasiliy Pupkin',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: Boolean,
    description: 'If artist has a grammy',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
