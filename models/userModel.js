import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: {
      type: String,
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "email already taken"],
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [4, "password should be greater than 6 digits"],
      select: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
  },
  { timestamps: true }
);

// password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// compare password hashing
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("Users", userSchema);

export default User;
