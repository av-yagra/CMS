import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { withAuth } from '@/lib/auth-utils';
import { packages } from '@/lib/dummy-data';
import { Booking } from '@/types/booking';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { packageId, name, email, phone, nationality, travelers, expectedDate, details } = body;

        // Validation
        if (!packageId || typeof packageId !== 'string' || !packages.some(p => p.id === packageId)) {
            return NextResponse.json({ message: 'Valid packageId is required' }, { status: 400 });
        }
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ message: 'Name is required' }, { status: 400 });
        }
        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
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

        // Normalize email and text fields
        const cleanEmail = email.trim().toLowerCase();

        // Fetch session if user is logged in
        const session = await auth();
        const userId = session?.user?.id || null;

        const client = await clientPromise;
        const db = client.db();
        const bookingsCollection = db.collection<Booking>('bookings');

        // Duplicate-submission protection:
        // We prevent the exact same user/email from booking the identical package in the last 15 minutes
        // while their previous identical booking is still "Pending".
        // This is a lightweight mechanism to prevent rapid double-clicks on the front end.
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const duplicate = await bookingsCollection.findOne({
            email: cleanEmail,
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
            userId,
            name: name.trim(),
            email: cleanEmail,
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
