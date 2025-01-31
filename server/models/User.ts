import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  githubId?: string;
  googleId?: string;
  name?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  githubId: {
    type: String,
  },
  googleId: {
    type: String,
  },
  name: {
    type: String,
  },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;