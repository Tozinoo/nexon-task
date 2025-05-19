import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type EventConditionDocument = EventCondition & Document;

@Schema()
export class EventCondition {
    @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
    eventId: Types.ObjectId;

    @Prop({ required: true })
    name: string; 

    @Prop({ enum: ['=','>','<','>=','<='], default: '=' })
    operator: string;

    @Prop({ required: true })
    value: number;

    @Prop()
    description?: string;
}
export const EventConditionSchema = SchemaFactory.createForClass(EventCondition);