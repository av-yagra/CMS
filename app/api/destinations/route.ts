import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { BackendDestination } from '@/types/destination';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<BackendDestination>('destinations');

        const destinations = await collection.find({}).sort({ name: 1 }).toArray();

        const formattedDestinations = destinations.map(({ _id, slug, ...rest }) => ({
            id: slug,
            ...rest,
        }));

        return NextResponse.json({ destinations: formattedDestinations }, { status: 200 });
    } catch (error) {
        console.error('Public Destination GET Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
