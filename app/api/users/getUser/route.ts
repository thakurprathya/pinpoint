import { NextResponse } from 'next/server'

import { getUser } from '../../../../lib/actions/user.actions';

export async function GET(req: Request) {
    try {
        const clerkId = req.url.split('?id=')[1];
        if(!clerkId) {
            return NextResponse.json({ error: 'ID not found' }, { status: 400 });
        }

        const user = await getUser(clerkId);
        if(!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } 
    catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}