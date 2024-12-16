import { NextResponse } from "next/server"

import { createBookmark } from "../../../../lib/actions/bookmark.action";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;
        if (!userId) {
            return new NextResponse("Unauthorized: User ID is required", { status: 401 });
        }

        const { link, title, tags } = body;
        if (!link || !tags) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const newBookmark = await createBookmark({
            user: userId,
            link,
            title: (!title || title.trim() === '') ? link : title,
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