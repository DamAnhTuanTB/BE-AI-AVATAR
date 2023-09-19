/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

interface ListGenerate {
  used: boolean;
  priority: number;
  timePayment: Date;
  priceInfo: any;
}

@Schema()
export class User {
  @Prop({ required: false })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false, type: Object })
  userInfo: any;

  @Prop({ required: true, default: [] })
  listGenerate: ListGenerate[];

  @Prop({ required: true })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
