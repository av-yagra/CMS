import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Simple minimal viable email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        let { name, email, phone, message } = body;

        // Strip input
        name = typeof name === 'string' ? name.trim() : '';
        email = typeof email === 'string' ? email.trim() : '';
        phone = typeof phone === 'string' ? phone.trim() : '';
        message = typeof message === 'string' ? message.trim() : '';

        // Validation
        if (!name) {
            return NextResponse.json({ message: 'Name is required' }, { status: 400 });
        }

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json({ message: 'Please provide a valid email format' }, { status: 400 });
        }

        if (!message) {
            return NextResponse.json({ message: 'Message is required' }, { status: 400 });
        }

        // Prepare Database Connection
        const client = await clientPromise;
        const db = client.db();
        const inquiriesCollection = db.collection('inquiries');

        const now = new Date();

        const newInquiry = {
            name,
            email,
            phone: phone || undefined, // keep undefined instead of empty string if not provided
            message,
            status: 'new',
            createdAt: now
        };

        // Execution
        const insertResult = await inquiriesCollection.insertOne(newInquiry);

        // Success Response
        return NextResponse.json(
            { message: 'Inquiry submitted successfully', inquiryId: insertResult.insertedId },
            { status: 201 }
        );

    } catch (error) {
        console.error('Contact POST Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
