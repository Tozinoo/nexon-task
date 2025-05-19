import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true })
    name: string;

    @Prop()
    startDate?: Date;

    @Prop()
    endDate?: Date;

    @Prop({ enum: ['ACTIVE','INACTIVE'], default: 'INACTIVE' })
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;
}
export const EventSchema = SchemaFactory.createForClass(Event);