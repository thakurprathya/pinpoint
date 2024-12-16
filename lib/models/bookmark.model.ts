import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    favicon: { type: String, default: '' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true }]
}, { timestamps: true });

const Bookmark = mongoose.models.Bookmark || mongoose.model("User", BookmarkSchema);
// mongoose.model("Bookmark", BookmarkSchema) will create the mongoose model, as first time there will be no exisiting schema, afterwards will fetch from mongoose.models.Bookmark
export default Bookmark;