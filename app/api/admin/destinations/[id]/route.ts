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

export const PUT = withAuth(async (req, session, context) => {
    try {
        const params = await context.params;
        const slugId = params.id as string;

        const body = await req.json();
        const { name, country, image, imagePosition, description, highlights, bestTimeToVisit } = body;

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<BackendDestination>('destinations');

        const existingDest = await collection.findOne({ slug: slugId });
        if (!existingDest) {
            return NextResponse.json({ message: 'Destination not found' }, { status: 404 });
        }

        const updates: Partial<BackendDestination> = {
            updatedAt: new Date()
        };

        let newSlug = slugId;
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length === 0) {
                return NextResponse.json({ message: 'Name must be a valid string' }, { status: 400 });
            }
            updates.name = name.trim();
            newSlug = slugify(name);
            if (!newSlug) {
                return NextResponse.json({ message: 'Name produces an invalid slug' }, { status: 400 });
            }
            // If slug changed, check for duplicates
            if (newSlug !== slugId) {
                const duplicate = await collection.findOne({ slug: newSlug });
                if (duplicate) {
                    return NextResponse.json({ message: 'A destination with this name/slug already exists' }, { status: 409 });
                }
                updates.slug = newSlug;
            }
        }

        if (country !== undefined) {
            if (typeof country !== 'string' || country.trim().length === 0) {
                return NextResponse.json({ message: 'Country must be a valid string' }, { status: 400 });
            }
            updates.country = country.trim();
        }

        if (image !== undefined) {
            if (typeof image !== 'string' || image.trim().length === 0) {
                return NextResponse.json({ message: 'Image must be a valid string' }, { status: 400 });
            }
            updates.image = image.trim();
        }

        if (description !== undefined) {
            if (typeof description !== 'string' || description.trim().length === 0) {
                return NextResponse.json({ message: 'Description must be a valid string' }, { status: 400 });
            }
            updates.description = description.trim();
        }

        if (bestTimeToVisit !== undefined) {
            if (typeof bestTimeToVisit !== 'string' || bestTimeToVisit.trim().length === 0) {
                return NextResponse.json({ message: 'Best time to visit must be a valid string' }, { status: 400 });
            }
            updates.bestTimeToVisit = bestTimeToVisit.trim();
        }

        if (highlights !== undefined) {
            if (!Array.isArray(highlights)) {
                return NextResponse.json({ message: 'Highlights must be an array of strings' }, { status: 400 });
            }
            for (const h of highlights) {
                if (typeof h !== 'string' || h.trim().length === 0) {
                    return NextResponse.json({ message: 'Each highlight must be a non-empty string' }, { status: 400 });
                }
            }
            updates.highlights = highlights.map(h => h.trim());
        }

        if (imagePosition !== undefined) {
            if (typeof imagePosition !== 'string') {
                return NextResponse.json({ message: 'Image position must be a string' }, { status: 400 });
            }
            updates.imagePosition = imagePosition.trim() || undefined;
        }

        await collection.updateOne({ _id: existingDest._id }, { $set: updates });

        return NextResponse.json({ message: 'Destination updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Destination PUT Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');

export const DELETE = withAuth(async (req, session, context) => {
    try {
        const params = await context.params;
        const slugId = params.id as string;

        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<BackendDestination>('destinations');

        const result = await collection.deleteOne({ slug: slugId });
        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Destination not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Destination deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Destination DELETE Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');
