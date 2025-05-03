import { IsOptional, IsString } from "class-validator";

export class CreateInteractionDto {

    @IsString()
    documentId: string;
    @IsString()
    question: string;
    
    @IsString()
    @IsOptional()
    answer?: string;
}
