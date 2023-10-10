import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
