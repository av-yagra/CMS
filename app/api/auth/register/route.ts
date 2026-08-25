import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        // 1. Validation
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ message: 'Name is required' }, { status: 400 });
        }

        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?_\-]).{8,}$/;
        if (!password || typeof password !== 'string' || !passwordRegex.test(password)) {
            return NextResponse.json(
                { message: 'Password must contain: uppercase + lowercase + number + special character and be at least 8 characters' },
                { status: 400 }
            );
        }

        // 2. Normalization
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = name.trim();

        // 3. Database connection
        const client = await clientPromise;
        // We use the default database attached to the connection (consistent with NextAuth's MongoDB adapter)
        const db = client.db();
        const usersCollection = db.collection('users');

        // 4. Check whether the user already exists
        const existingUser = await usersCollection.findOne({ email: normalizedEmail });
        if (existingUser) {
            return NextResponse.json({ message: 'A user with this email already exists' }, { status: 409 });
        }

        // 5. Hash the password
        const passwordHash = await hashPassword(password);

        // 6. Create the user document securely
        const now = new Date();
        const newUser = {
            name: normalizedName,
            email: normalizedEmail,
            passwordHash,
            role: 'user', // strictly enforced by backend
            image: null,
            createdAt: now,
            updatedAt: now,
        };

        // 7. Insert the user into MongoDB
        await usersCollection.insertOne(newUser);

        // 8. Return successful response (Excluding the hash!)
        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration API Error:', error); // Log safely without leaking data to client
        return NextResponse.json({ message: 'Internal server error occurred' }, { status: 500 });
    }
}
