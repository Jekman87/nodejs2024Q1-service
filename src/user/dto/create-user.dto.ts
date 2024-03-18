import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'login',
    example: 'Evgeny',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    type: String,
    description: 'password',
    example: 'myPassword',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
