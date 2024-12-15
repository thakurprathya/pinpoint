import Bookmark from "./models/bookmark.model";
import Tag from "./models/tag.model";

export const cleanupTags = async () => {
    try {
        const tags = await Tag.find();

        for(const tag of tags){
            const bookmarkCount = await Bookmark.countDocuments({ tags: tag._id });
            if(bookmarkCount === 0){
                tag.deleted = true;
                await tag.save();
            }
        }
    } 
    catch (error) {
        console.error('Error during tag cleanup:', error);
    }
};
