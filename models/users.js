import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
});

const User = mongoose.model("user", userSchema);

export default User;
