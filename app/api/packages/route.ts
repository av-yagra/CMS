import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('packages');

        const packages = await collection.find({}).sort({ title: 1 }).toArray();

        // Exclude internal _id
        const formattedPackages = packages.map(pkg => {
            const { _id, ...rest } = pkg;
            return rest;
        });

        return NextResponse.json({ packages: formattedPackages }, { status: 200 });
    } catch (error) {
        console.error('Public Packages GET Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
