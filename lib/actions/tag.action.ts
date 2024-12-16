import { Types } from 'mongoose'

import { connectToDB } from "../mongoose";
import Tag from '../models/tag.model';

export async function getTags(userId: string) {
    try {
        await connectToDB();
        const objectId = new Types.ObjectId(userId);
        
        const tags = await Tag.find({
            user: objectId,
            deleted: false
        });
        return tags;
    } 
    catch (error) {
        console.error("Error getting tags:", error);
        throw error;
    }
}