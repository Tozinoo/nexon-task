import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
    @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
    eventId: Types.ObjectId;

    @Prop({ enum: ['POINT','ITEM','COUPON'], required: true })
    type: string;

    @Prop()
    itemCode?: number;

    @Prop()
    couponCode?: string;

    @Prop({ required: true })
    unitAmount: number;

    @Prop({ default: 0 })
    remainingStock?: number;

    @Prop({ default: 0 })
    totalStock?: number;
}
export const RewardSchema = SchemaFactory.createForClass(Reward);