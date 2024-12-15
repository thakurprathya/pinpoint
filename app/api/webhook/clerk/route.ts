import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

import { createUser, deleteUser, updateUser } from '../../../../lib/actions/user.actions';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if(!WEBHOOK_SECRET || !svix_id || !svix_timestamp || !svix_signature){
        return new Response('Error occured', { status: 400 })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    try {
        const evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent

        const { id } = evt.data;
        const eventType = evt.type;

        switch (eventType) {
            case 'user.created':
                const { email_addresses, username } = evt.data;
                if(email_addresses?.[0]?.email_address && username && id){
                    await createUser({
                        clerkId: id,
                        email: email_addresses[0].email_address,
                        username: username,
                    });
                    return new Response('User created', { status: 201 })
                }
                return new Response('Missing required user data', { status: 400 })

            case 'user.updated':
                const { email_addresses: updatedEmail, username: updatedUsername } = evt.data;
                if(updatedEmail?.[0]?.email_address && updatedUsername && id){
                    await updateUser({
                        clerkId: id,
                        email: updatedEmail[0].email_address,
                        username: updatedUsername,
                    });
                    return new Response('User updated', { status: 200 })
                }
                return new Response('Missing required user data', { status: 400 })

            case 'user.deleted':
                if(id){
                    await deleteUser(id);
                    return new Response('User deleted', { status: 200 })
                }
                return new Response('Missing user ID', { status: 400 })

            default:
                return new Response('Webhook received', { status: 200 })
        }
    } 
    catch (err) {
        console.log(err)
        return new Response('Error occured', { status: 400 })
    }
}

export async function GET() {
    return Response.json({ message: 'Testing Endpoint' })
}