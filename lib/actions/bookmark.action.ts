import { Types } from 'mongoose'

import { connectToDB } from "../mongoose";
import Bookmark from '../models/bookmark.model';
import Tag from '../models/tag.model';
import { extractFaviconAndDescription } from '../scrap';

export async function getBookmarks(userId: string) {
    try {
        await connectToDB();
        const objectId = new Types.ObjectId(userId);
        const bookmarks = await Bookmark.find({ user: objectId });
        return bookmarks;
    } 
    catch (error) {
        console.error("Error getting bookmarks:", error);
        throw error;
    }
}

export async function createBookmark(bookmarkData: {
    user: string;
    link: string;
    title: string;
    description?: string;
    favicon?: string;
    tags: string[];
}) {
    try {
        await connectToDB();
        
        // Processing each tag
        const tagIds = await Promise.all(bookmarkData.tags.map(async (tagName) => {
            let tag = await Tag.findOne({ name: tagName, user: new Types.ObjectId(bookmarkData.user) });
            
            if(!tag){
                tag = await Tag.create({
                    name: tagName,
                    user: new Types.ObjectId(bookmarkData.user)
                });
            } 
            else if (tag.deleted) {
                tag = await Tag.findByIdAndUpdate(
                    tag._id,
                    { deleted: false },
                    { new: true }
                );
            }
            if (!tag) throw new Error('Failed to create or update tag');
            return tag._id;
        }));

        const { favicon, description } = await extractFaviconAndDescription(bookmarkData.link);
        bookmarkData.favicon = favicon;
        bookmarkData.description = description;

        // Processing bookmark
        const newBookmark = await Bookmark.create({
            ...bookmarkData,
            user: new Types.ObjectId(bookmarkData.user),
            tags: tagIds
        });

        return newBookmark;
    } catch (error) {
        console.error("Error creating bookmark with tags:", error);
        throw error;
    }
}

export async function updateBookmark(
    bookmarkId: string,
    bookmarkData: {
        user: string;
        link: string;
        title: string;
        description?: string;
        favicon?: string;
        tags: string[];
    }
) {
    try {
        await connectToDB();

        const existingBookmark = await Bookmark.findById(bookmarkId);
        if (!existingBookmark) throw new Error("Bookmark not found");

        const tagIds = await Promise.all(bookmarkData.tags.map(async (tagName) => {
            let tag = await Tag.findOne({ name: tagName, user: new Types.ObjectId(bookmarkData.user) });
            
            if (!tag) {
                tag = await Tag.create({
                    name: tagName,
                    user: new Types.ObjectId(bookmarkData.user)
                });
            } else if (tag.deleted) {
                tag = await Tag.findByIdAndUpdate(
                    tag._id,
                    { deleted: false },
                    { new: true }
                );
            }
            if (!tag) throw new Error('Failed to create or update tag');
            return tag._id;
        }));

        // Handle old tags that are no longer used
        const oldTagIds = existingBookmark.tags;
        await Promise.all(oldTagIds.map(async (tagId: Types.ObjectId) => {
            if (!tagIds.includes(tagId)) {
                const bookmarksWithTag = await Bookmark.countDocuments({
                    _id: { $ne: existingBookmark._id },
                    tags: tagId
                });
                
                if (bookmarksWithTag === 0) {
                    await Tag.findOneAndUpdate(
                        { _id: tagId, deleted: false },
                        { deleted: true },
                        { new: true }
                    );
                }
            }
        }));

        const { favicon, description } = await extractFaviconAndDescription(bookmarkData.link);
        bookmarkData.favicon = favicon;
        bookmarkData.description = description;

        const updatedBookmark = await Bookmark.findByIdAndUpdate(
            bookmarkId,
            {
                ...bookmarkData,
                user: new Types.ObjectId(bookmarkData.user),
                tags: tagIds
            },
            { new: true }
        );

        return updatedBookmark;
    } catch (error) {
        console.error("Error updating bookmark:", error);
        throw error;
    }
}

export async function deleteBookmark(bookmarkId: string) {
    try {
        await connectToDB();
        
        const bookmark = await Bookmark.findById(new Types.ObjectId(bookmarkId));
        if(!bookmark) throw new Error("Bookmark not found");
        
        await Bookmark.findByIdAndDelete(bookmarkId);
        
       // marking tags deleted that are no longer referenced by any bookmarks
        await Promise.all(bookmark.tags.map(async (tagId: Types.ObjectId) => {
            // Exclude the current bookmark from the count
            const bookmarksWithTag = await Bookmark.countDocuments({
                _id: { $ne: bookmark._id },
                tags: tagId
            });
            
            if(bookmarksWithTag === 0){
                // Use findOneAndUpdate with optimistic locking
                await Tag.findOneAndUpdate(
                    { _id: tagId, deleted: false },
                    { deleted: true },
                    { new: true }
                );
            }
        }));

        return { success: true };
    } catch (error) {
        console.error("Error deleting bookmark:", error);
        throw error;
    }
}