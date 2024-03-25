import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({
    type: String,
    description: 'track name',
    example: 'Jal net ruja',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'artist id',
    example: '0a35dd62-e09f-444b-a628-f4e7c6954f57',
  })
  @ValidateIf((obj) => obj.artistId !== null)
  @IsUUID()
  @IsString()
  artistId: string | null;

  @ApiProperty({
    type: String,
    description: 'albumId id',
    example: '0a35dd62-e09f-444b-a628-f4e7c6954f57',
  })
  @ValidateIf((obj) => obj.albumId !== null)
  @IsUUID()
  @IsString()
  albumId: string | null;

  @ApiProperty({
    type: Number,
    description: 'track duration',
    example: 60,
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
