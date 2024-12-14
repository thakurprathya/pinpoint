import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function getUser(clerkId: string) {
    try {
        await connectToDB();
        const user = await User.findOne({ clerkId });
        return user;
    } 
    catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}

export async function createUser(userData: {
    clerkId: string;
    email: string;
    username: string;
}) {
    try {
        await connectToDB();
        const newUser = await User.create(userData);
        return newUser;
    } 
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

export async function updateUser(userData: {
        clerkId: string;
        email: string;
        username: string;
}) {
    try {
        await connectToDB();
        const updatedUser = await User.findOneAndUpdate(
            { clerkId: userData.clerkId },
            userData,
            { new: true } // tells mongoose to return updated object
        );
        return updatedUser;
    } 
    catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

export async function deleteUser(clerkId: string) {
    try {
        await connectToDB();
        const deletedUser = await User.findOneAndDelete({ clerkId });
        return deletedUser;
    } 
    catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}