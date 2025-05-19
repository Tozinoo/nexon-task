import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type UserEventConditionProgressDocument = UserEventConditionProgress & Document;

@Schema({ timestamps: { createdAt: false, updatedAt: true } })
export class UserEventConditionProgress {
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "Event", required: true })
    eventId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "EventCondition", required: true })
    conditionId: Types.ObjectId;

    @Prop({ default: 0 })
    progress?: number;

    @Prop({ default: false })
    completed?: boolean;
}

export const UserEventConditionProgressSchema = SchemaFactory.createForClass(UserEventConditionProgress);
