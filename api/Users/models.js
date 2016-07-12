/* eslint-disable new-cap, prefer-arrow-callback */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true },
  firstname: String,
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['User', 'Company', 'CompanyAdmin', 'Admin'],
    default: 'User',
  },
});

UserSchema.pre('save', function presave(next) {
  this.updatedAt = new Date();

  if (!this.isModified('password')) return next();

  return bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);

    this.password = hash;
    return next();
  });
});

UserSchema.methods.comparePassword = function comparePassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, match) => {
      if (err) return reject(err);
      return match ? resolve(match) : reject('Passwords do not match');
    });
  });
};

export const UserModel = mongoose.model('users', UserSchema);