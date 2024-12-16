import { NextResponse } from 'next/server'

import { getTags } from '../../../../lib/actions/tag.action';

export async function GET(req: Request) {
    try {
        const id = req.url.split('?id=')[1];
        console.log(id)
        if(!id) {
            return NextResponse.json({ error: 'ID not found' }, { status: 400 });
        }
        const tags = await getTags(id);
        return NextResponse.json(tags, { status: 200 });
    } 
    catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}