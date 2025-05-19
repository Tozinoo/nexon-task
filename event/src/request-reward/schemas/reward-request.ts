import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type RewardRequestDocument = RewardRequest & Document;

@Schema({ timestamps: true })
export class RewardRequest {
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "Event", required: true })
    eventId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "Reward", required: true })
    rewardId: Types.ObjectId;

    @Prop({ required: true })
    requestedQuantity: number;

    @Prop({ required: true })
    requestedAt: Date;

    @Prop({ enum: ["PENDING", "APPROVED", "DENIED"], default: "PENDING" })
    status: string;

    @Prop()
    processedAt?: Date;

    @Prop()
    reason?: string;

    @Prop()
    receivedQuantity?: number;
}
export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);