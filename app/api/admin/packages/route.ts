import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { withAuth } from '@/lib/auth-utils';
import { AdminPackage } from "@/types/package";

function validatePackage(body: any): string | null {
    if (!body.id || typeof body.id !== 'string' || body.id.trim() === '') return 'ID is required';
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') return 'Title is required';
    if (!body.destination || typeof body.destination !== 'string' || body.destination.trim() === '') return 'Destination is required';
    if (!body.duration || typeof body.duration !== 'string' || body.duration.trim() === '') return 'Duration is required';

    if (body.price === undefined || typeof body.price !== 'number' || isNaN(body.price)) return 'Price must be a valid number';

    if (!body.image || typeof body.image !== 'string' || body.image.trim() === '') return 'Image is required';
    if (!body.description || typeof body.description !== 'string' || body.description.trim() === '') return 'Description is required';

    if (!Array.isArray(body.highlights)) return 'Highlights must be an array';
    if (!Array.isArray(body.itinerary)) return 'Itinerary must be an array';
    if (!Array.isArray(body.includes)) return 'Includes must be an array';
    if (!Array.isArray(body.excludes)) return 'Excludes must be an array';

    return null;
}

export const GET = withAuth(async () => {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('packages');

        const packages = await collection.find({}).sort({ title: 1 }).toArray();

        const formattedPackages = packages.map(pkg => {
            const { _id, ...rest } = pkg;
            return rest;
        });

        return NextResponse.json({ packages: formattedPackages }, { status: 200 });
    } catch (error) {
        console.error('Packages GET Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();

        const validationError = validatePackage(body);
        if (validationError) {
            return NextResponse.json({ message: validationError }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('packages');

        // Prevent duplicate package IDs
        const existing = await collection.findOne({ id: body.id });
        if (existing) {
            return NextResponse.json({ message: 'A package with this ID already exists' }, { status: 409 });
        }

        const newPackage: AdminPackage = {
            id: body.id.trim(),
            title: body.title.trim(),
            destination: body.destination.trim(),
            duration: body.duration.trim(),
            price: Number(body.price),
            badge: body.badge || null,
            image: body.image.trim(),
            imagePosition: body.imagePosition,
            summary: body.summary,
            description: body.description.trim(),
            highlights: body.highlights,
            difficulty: body.difficulty,
            bestSeason: body.bestSeason,
            startingPoint: body.startingPoint,
            maxAltitude: body.maxAltitude,
            itinerary: body.itinerary,
            includes: body.includes,
            excludes: body.excludes,
        };

        const result = await collection.insertOne({
            ...newPackage,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json(
            { message: 'Package created successfully', packageId: newPackage.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Packages POST Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');

export const PUT = withAuth(async (req) => {
    try {
        const body = await req.json();

        const validationError = validatePackage(body);
        if (validationError) {
            return NextResponse.json({ message: validationError }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('packages');

        const { id, _id, ...updateFields } = body;

        const result = await collection.updateOne(
            { id: id },
            {
                $set: {
                    ...updateFields,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Package not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Package updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Packages PUT Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');

export const DELETE = withAuth(async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Package ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('packages');

        const result = await collection.deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Package not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Package deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Packages DELETE Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');
