import { NextResponse } from "next/server"
import { updateBookmark } from "../../../../lib/actions/bookmark.action";

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, bookmarkId } = body;
        
        if (!userId) {
            return new NextResponse("Unauthorized: User ID is required", { status: 401 });
        }

        if (!bookmarkId) {
            return new NextResponse("Bookmark ID is required", { status: 400 });
        }

        const { link, title, tags } = body;
        if (!link || !tags) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const updatedBookmark = await updateBookmark(bookmarkId, {
            user: userId,
            link,
            title: (!title || title.trim() === '') ? link : title,
            tags
        });

        return NextResponse.json(updatedBookmark, { status: 200 });
    } 
    catch (error: any) {
        console.error("Error updating bookmark:", error);
        return new NextResponse(error.message || "Internal Server Error", { 
            status: error.status || 500 
        });
    }
}