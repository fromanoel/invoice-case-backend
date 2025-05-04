import {
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsString()
    name: string;
  
    @IsString()
    username: string;
  
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //   message: 'password too weak',
    // })
    password: string;
  }