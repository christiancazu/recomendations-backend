import { Document } from 'mongoose';

export interface IPermission {
  readonly post: string[];
}

export interface IInterests extends Document {
  readonly userId: string;
  readonly interests: Object;
}
