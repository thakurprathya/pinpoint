import { NextResponse } from "next/server"

import { deleteBookmark } from "../../../../lib/actions/bookmark.action";

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;
        if (!userId) {
            return new NextResponse("Unauthorized: User ID is required", { status: 401 });
        }

        const { bookmarkId } = body;
        if (!bookmarkId) {
            return new NextResponse("Bookmark ID is required", { status: 400 });
        }

        const result = await deleteBookmark(bookmarkId);
        return NextResponse.json(result, { status: 200 });
    } 
    catch (error: any) {
        console.error("Error deleting bookmark:", error);
        return new NextResponse(error.message || "Internal Server Error", { 
            status: error.status || 500 
        });
    }
}