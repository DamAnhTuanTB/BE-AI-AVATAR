/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

export enum TypeSessionStatus {
  ACTIVE = 'active',
  ERROR = 'error',
  COMPLETE = 'complete',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}
@Schema()
export class Session {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true, type: Array })
  styles: string[];

  @Prop({ required: true })
  originFirstImage: string;

  @Prop({
    required: true,
    enum: TypeSessionStatus,
    default: TypeSessionStatus.ACTIVE,
  })
  status: TypeSessionStatus;

  @Prop({
    required: true,
    enum: Gender,
  })
  gender: Gender;

  @Prop({ required: false, type: Object })
  results: any;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
