import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    link: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    favicon: { type: String, default: '' },
    tag: { type: String }
}, { timestamps: true });

const Bookmark = mongoose.models.Bookmark || mongoose.model("User", BookmarkSchema);
// mongoose.model("User", userSchema) will create the mongoose model, as first time there will be no exisiting schema, afterwards will fetch from mongoose.models.User
export default Bookmark;