import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, unique: true }, 
}, { timestamps: true });

const Tag = mongoose.model('Tag', TagSchema);
// mongoose.model("Tag", TagSchema) will create the mongoose model, as first time there will be no exisiting schema, afterwards will fetch from mongoose.models.Tag
module.exports = Tag;
