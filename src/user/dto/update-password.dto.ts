import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    description: 'old password',
    example: 'oldPassword',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    type: String,
    description: 'new password',
    example: 'newPassword',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
