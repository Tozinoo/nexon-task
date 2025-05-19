import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true })
export class RefreshToken {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    tokenHash: string;

    @Prop({ required: true })
    issuedAt: Date;

    @Prop({ required: true })
    expiresAt: Date;

    @Prop({ default: false })
    revoked: boolean;

    @Prop({ type: Types.ObjectId, ref: 'RefreshToken' })
    replacedByToken?: Types.ObjectId;
}
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);