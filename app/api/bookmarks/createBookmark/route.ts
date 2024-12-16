import { NextResponse } from "next/server"

import { createBookmark } from "../../../../lib/actions/bookmark.action";
import { getEncryptedItem } from "../../../../lib/encryption";

export async function POST(request: Request) {
    try {
        const user = getEncryptedItem('user');
        const userId = user?._id;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { link, title, tags } = body;

        if (!link || !tags) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const newBookmark = await createBookmark({
            user: userId,
            link,
            title: title || link,
            tags
        });

        return NextResponse.json(newBookmark, { status: 201 });
    } 
    catch (error: any) {
        console.error("Error creating bookmark:", error);
        return new NextResponse(error.message || "Internal Server Error", { 
            status: error.status || 500 
        });
    }
}