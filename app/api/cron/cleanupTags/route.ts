import { NextResponse } from 'next/server'

import { cleanupTags } from '../../../../lib/cleanupTags';

export async function GET(req: Request) {
    try {
        await cleanupTags();  // Run the cleanup function
        return NextResponse.json(
            { message: 'Cleanup completed successfully.' }, 
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in cleanup API route:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}
