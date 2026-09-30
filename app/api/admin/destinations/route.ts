import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withAuth } from '@/lib/auth-utils';
import { BackendDestination } from '@/types/destination';

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export const GET = withAuth(async () => {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<BackendDestination>('destinations');

        const destinations = await collection.find({}).sort({ createdAt: -1 }).toArray();

        const formattedDestinations = destinations.map(dest => {
            const { _id, slug, ...rest } = dest;
            return {
                id: slug,
                ...rest
            };
        });

        return NextResponse.json({ destinations: formattedDestinations }, { status: 200 });
    } catch (error) {
        console.error('Destination GET Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const { name, country, image, imagePosition, description, highlights, bestTimeToVisit } = body;

        // Validation
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ message: 'Name is required' }, { status: 400 });
        }
        if (!country || typeof country !== 'string' || country.trim().length === 0) {
            return NextResponse.json({ message: 'Country is required' }, { status: 400 });
        }
        if (!image || typeof image !== 'string' || image.trim().length === 0) {
            return NextResponse.json({ message: 'Image is required' }, { status: 400 });
        }
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return NextResponse.json({ message: 'Description is required' }, { status: 400 });
        }
        if (!bestTimeToVisit || typeof bestTimeToVisit !== 'string' || bestTimeToVisit.trim().length === 0) {
            return NextResponse.json({ message: 'Best time to visit is required' }, { status: 400 });
        }
        if (!Array.isArray(highlights)) {
            return NextResponse.json({ message: 'Highlights must be an array of strings' }, { status: 400 });
        }
        for (const h of highlights) {
            if (typeof h !== 'string' || h.trim().length === 0) {
                return NextResponse.json({ message: 'Each highlight must be a non-empty string' }, { status: 400 });
            }
        }
        if (imagePosition !== undefined && typeof imagePosition !== 'string') {
            return NextResponse.json({ message: 'Image position must be a string' }, { status: 400 });
        }

        const slug = slugify(name);
        if (!slug) {
            return NextResponse.json({ message: 'Name produces an invalid slug' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<BackendDestination>('destinations');

        // Check for duplicate slug
        const existing = await collection.findOne({ slug });
        if (existing) {
            return NextResponse.json({ message: 'A destination with this name/slug already exists' }, { status: 409 });
        }

        const now = new Date();
        const newDestination: Omit<BackendDestination, '_id'> = {
            slug,
            name: name.trim(),
            country: country.trim(),
            image: image.trim(),
            imagePosition: imagePosition ? imagePosition.trim() : undefined,
            description: description.trim(),
            highlights: highlights.map(h => h.trim()),
            bestTimeToVisit: bestTimeToVisit.trim(),
            createdAt: now,
            updatedAt: now
        };

        const result = await collection.insertOne(newDestination as BackendDestination);

        return NextResponse.json(
            { message: 'Destination created successfully', destinationId: result.insertedId.toString() },
            { status: 201 }
        );
    } catch (error) {
        console.error('Destination POST Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');
