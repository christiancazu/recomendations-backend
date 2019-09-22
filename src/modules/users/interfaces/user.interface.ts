import { Document } from 'mongoose';

export interface IPermission {
  readonly post: string[];
}

export interface IUser extends Document {
  readonly names?: string;
  readonly surnames?: string;
  readonly email?: string;
  readonly status?: string;
  readonly role?: string;
  readonly permissions?: IPermission;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
