import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;
export enum Role {
USER = "USER",
OPERATOR = "OPERATOR",
AUDITOR = "AUDITOR",
ADMIN = "ADMIN",
}

export class Character {
  charId: string;
  name: string;
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ type: String, enum: Role, default: Role.USER })
    role: Role;

    @Prop({ type: { charId: String, name: String } })
    mainCharacter?: Character;

    @Prop({ type: [{ charId: String, name: String }], default: [] })
    characters: Character;
}
export const UserSchema = SchemaFactory.createForClass(User);