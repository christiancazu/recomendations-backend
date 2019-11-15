import { Schema } from 'mongoose';

export const InterestsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    interests: {
      type: Object,
      required: true,
    }
  },
  { versionKey: false },
);

