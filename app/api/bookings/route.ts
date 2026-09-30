import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { withAuth } from '@/lib/auth-utils';
import { Booking } from '@/types/booking';
import { AdminPackage } from '@/types/package';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { packageId, phone, nationality, travelers, expectedDate, details } = body;

        const client = await clientPromise;
        const db = client.db();

        // Validation
        if (!packageId || typeof packageId !== 'string') {
            return NextResponse.json({ message: 'Valid packageId is required' }, { status: 400 });
        }

        const packageExists = await db.collection<AdminPackage>('packages').findOne({ id: packageId });
        if (!packageExists) {
            return NextResponse.json({ message: 'Valid packageId is required' }, { status: 400 });
        }
        if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
            return NextResponse.json({ message: 'Phone is required' }, { status: 400 });
        }
        if (!nationality || typeof nationality !== 'string' || nationality.trim().length === 0) {
            return NextResponse.json({ message: 'Nationality is required' }, { status: 400 });
        }
        const parsedTravelers = Number(travelers);
        if (!Number.isInteger(parsedTravelers) || parsedTravelers < 1) {
            return NextResponse.json({ message: 'At least 1 traveler is required' }, { status: 400 });
        }

        // Date validation: ensure it's provided and is not a past date
        if (!expectedDate || typeof expectedDate !== 'string') {
            return NextResponse.json({ message: 'Expected date is required' }, { status: 400 });
        }
        const parsedDate = new Date(expectedDate);
        if (isNaN(parsedDate.getTime())) {
            return NextResponse.json({ message: 'Invalid date format' }, { status: 400 });
        }

        // Strip time from today to compare correctly
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (parsedDate < today) {
            return NextResponse.json({ message: 'Expected date must be in the future' }, { status: 400 });
        }

        // 1. HARD SECURITY GATES: Enforce authentication using the server session.
        // We do not trust any userId, email, or name provided by the client request.
        const session = await auth();

        if (!session || !session.user || !session.user.id || !session.user.email) {
            return NextResponse.json({ message: 'Unauthorized: You must be logged in to create a booking' }, { status: 401 });
        }

        // 2. Extracted trusted variables from the secure session exclusively
        const userId = session.user.id;
        const trustedEmail = session.user.email.trim().toLowerCase();
        // Fallback to "User" if name is missing from session, but it shouldn't be.
        const trustedName = (session.user.name || "User").trim();

        const bookingsCollection = db.collection<Booking>('bookings');

        // Duplicate-submission protection:
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const duplicate = await bookingsCollection.findOne({
            email: trustedEmail,
            packageId: packageId,
            status: "Pending",
            createdAt: { $gte: fifteenMinutesAgo }
        });

        if (duplicate) {
            return NextResponse.json(
                { message: 'You have recently submitted a booking for this package. Please wait before submitting again.' },
                { status: 409 }
            );
        }

        const now = new Date();

        // Construct safe object, omitting _id so Mongo driver auto-generates it
        const newBooking: Omit<Booking, '_id'> = {
            packageId,
            userId, // strict from session
            name: trustedName, // strict from session
            email: trustedEmail, // strict from session
            phone: phone.trim(),
            nationality: nationality.trim(),
            travelers: parsedTravelers,
            expectedDate,
            details: details && typeof details === 'string' ? details.trim() : undefined,
            status: "Pending", // strictly set by backend
            createdAt: now,
            updatedAt: now
        };

        const insertResult = await bookingsCollection.insertOne(newBooking as Booking);

        return NextResponse.json(
            { message: 'Booking created successfully', bookingId: insertResult.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Booking POST Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// GET route for admins to fetch all bookings natively sorted by newest
export const GET = withAuth(async () => {
    try {
        const client = await clientPromise;
        const db = client.db();
        const bookingsCollection = db.collection<Booking>('bookings');

        const bookings = await bookingsCollection.find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error) {
        console.error('Booking GET Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');
