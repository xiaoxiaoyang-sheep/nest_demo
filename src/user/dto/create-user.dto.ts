import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Roles } from "src/roles/roles.entity";


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    password: string;

    @IsOptional()
    roles?: Roles[] | number[];
}