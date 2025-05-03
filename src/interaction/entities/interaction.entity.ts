export class Interaction {
    id : string;
    documentId : string;
    question: string;
    answer?: string;
    createdAt : Date;

    constructor(partial: Partial<Interaction>) {
        Object.assign(this, partial);
      }

}
