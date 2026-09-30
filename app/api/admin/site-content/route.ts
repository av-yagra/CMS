import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withAuth } from '@/lib/auth-utils';

export const GET = withAuth(async () => {
    try {
        const client = await clientPromise;
        const db = client.db();
        const document = await db.collection<any>('siteContent').findOne({ _id: "global" });

        if (document) {
            const { _id, ...content } = document;
            return NextResponse.json({ content }, { status: 200 });
        }

        return NextResponse.json({ content: null }, { status: 200 });
    } catch (error) {
        console.error('Admin Site Content GET Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');

export const PUT = withAuth(async (req) => {
    try {
        const body = await req.json();
        const { _id, createdAt, updatedAt, ...cleanBody } = body;

        const client = await clientPromise;
        const db = client.db();

        await db.collection<any>('siteContent').updateOne(
            { _id: "global" },
            {
                $set: { ...cleanBody, updatedAt: new Date() },
                $setOnInsert: { createdAt: new Date() }
            },
            { upsert: true }
        );

        return NextResponse.json({ message: 'Site content updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Admin Site Content PUT Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');
