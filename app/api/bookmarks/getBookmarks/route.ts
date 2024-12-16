import { NextResponse } from 'next/server'

import { getBookmarks } from '../../../../lib/actions/bookmark.action';

export async function GET(req: Request) {
    try {
        const id = req.url.split('?id=')[1];
        if(!id) {
            return NextResponse.json({ error: 'ID not found' }, { status: 400 });
        }
        const bookmarks = await getBookmarks(id);
        return NextResponse.json(bookmarks, { status: 200 });
    } 
    catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}