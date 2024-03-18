import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    type: String,
    description: 'album name',
    example: 'Korol i shut',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: Number,
    description: 'release year',
    example: 1996,
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    type: String,
    description: 'artist id',
    example: '0a35dd62-e09f-444b-a628-f4e7c6954f57',
  })
  @ValidateIf((obj) => obj.artistId !== null)
  @IsUUID()
  @IsString()
  artistId: string | null;
}
