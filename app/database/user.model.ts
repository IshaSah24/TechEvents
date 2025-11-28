import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { 
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 50 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: 'Please enter a valid email address',
      },
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
  },
  { 
    timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err : any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, (this as IUser).password);
};

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1 });

const User = models.User || model<IUser>('User', UserSchema);
export default User;
