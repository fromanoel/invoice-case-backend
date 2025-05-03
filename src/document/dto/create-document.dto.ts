import { IsOptional, IsString } from "class-validator";

export class CreateDocumentDto {

    @IsString()
    userId: string;

    @IsString()
    originalName: string;

    @IsString()
    filePath: string;

    @IsString()
    @IsOptional()
    extractedText? : string;
}
