import { Document } from "src/document/entities/document.entity";

export class User {
  id: string;
  name: string;
  username: string;
  createdAt: Date;
  documents?: Document[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
