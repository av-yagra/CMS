import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { withAuth, RouteContext } from '@/lib/auth-utils';
import { Session } from 'next-auth';
import { Booking } from '@/types/booking';

export const GET = withAuth(async (_req: Request, _session: Session, context: RouteContext) => {
    try {
        const params = await context.params;
        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid booking ID format' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const bookingsCollection = db.collection<Booking>('bookings');

        const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });

        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ booking }, { status: 200 });
    } catch (error) {
        console.error('Booking [id] GET Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');

export const PATCH = withAuth(async (req: Request, _session: Session, context: RouteContext) => {
    try {
        const params = await context.params;
        const id = Array.isArray(params.id) ? params.id[0] : params.id;

        if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid booking ID format' }, { status: 400 });
        }

        const body = await req.json();
        const { status } = body;

        const allowedStatuses = ["Pending", "Confirmed", "Cancelled"];
        if (!status || !allowedStatuses.includes(status)) {
            return NextResponse.json(
                { message: 'Invalid status. Allowed values: Pending, Confirmed, Cancelled' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const bookingsCollection = db.collection<Booking>('bookings');

        const updateResult = await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status,
                    updatedAt: new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        const updatedBooking = await bookingsCollection.findOne({ _id: new ObjectId(id) });

        return NextResponse.json({ message: 'Booking updated successfully', booking: updatedBooking }, { status: 200 });
    } catch (error) {
        console.error('Booking [id] PATCH Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}, 'admin');
