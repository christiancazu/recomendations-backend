import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { RoleUser } from '../enums/role-user.enum';
import { PermissionUser } from '../enums/permission-user.enum';
import { StatusUser } from '../enums/status.user.enum';

export const UserSchema = new Schema({
  names: {
    type: String,
    required: true,
    trim: true,
  },
  surnames: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: Object.values(StatusUser),
    default: StatusUser.ACTIVE,
  },
  roles: {
    type: [
      {
        type: String,
        enum: Object.values(RoleUser),
      },
    ],
    enum: Object.values(RoleUser),
    default: RoleUser.USER,
  },
  permissions: {
    post: {
      type: [
        {
          type: String,
          enum: Object.values(PermissionUser),
        },
      ],
      default: [...Object.values(PermissionUser)],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed: string = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
