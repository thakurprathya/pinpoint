import { NextResponse } from "next/server"

import { deleteBookmark } from "../../../../lib/actions/bookmark.action";
import { getEncryptedItem } from "../../../../lib/encryption";

export async function DELETE(request: Request) {
    try {
        const user = getEncryptedItem('user');
        const userId = user?._id;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const url = new URL(request.url);
        const bookmarkId = url.searchParams.get('id');
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