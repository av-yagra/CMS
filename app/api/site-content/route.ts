import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
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
        console.error('Public Site Content GET Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
