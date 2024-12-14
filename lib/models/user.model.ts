import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
// mongoose.model("User", userSchema) will create the mongoose model, as first time there will be no exisiting schema, afterwards will fetch from mongoose.models.User
export default User;