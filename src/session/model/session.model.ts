/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session {
  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: true })
  sessionId: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
