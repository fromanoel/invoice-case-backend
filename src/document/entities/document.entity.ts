import { Interaction } from "src/interaction/entities/interaction.entity";

export class Document {

    id: string;
    userId: string;
    originalName: string;
    filePath: string;
    extractedText?: string;
    createdAt: Date;
    updatedAt: Date;

    interactions?: Interaction[];


    constructor(partial: Partial<Document>) {
        Object.assign(this, partial);
    }
}
