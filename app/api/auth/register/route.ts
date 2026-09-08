import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword } from '@/lib/password';
import crypto from 'crypto';
import { sendOTP } from '@/lib/email';

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
        const db = client.db();
        const usersCollection = db.collection('users');

        // 4. Check whether the user already exists
        const existingUser = await usersCollection.findOne({ email: normalizedEmail });
        if (existingUser) {
            return NextResponse.json({ message: 'A user with this email already exists' }, { status: 409 });
        }

        // 5. Hash the password
        const passwordHash = await hashPassword(password);

        // 6. Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        
        // Ensure AUTH_SECRET is present - fail securely if missing
        const secret = process.env.AUTH_SECRET;
        if (!secret) {
            throw new Error('AUTH_SECRET is not configured. Cannot generate secure OTP.');
        }
        
        const otpHash = crypto.createHmac('sha256', secret).update(otp).digest('hex');
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // 7. Create the user document securely
        const now = new Date();
        const newUser = {
            name: normalizedName,
            email: normalizedEmail,
            passwordHash,
            role: 'user', // strictly enforced by backend
            image: null,
            emailVerified: false,
            emailVerificationCodeHash: otpHash,
            emailVerificationExpires: otpExpires,
            emailVerificationAttempts: 0,
            createdAt: now,
            updatedAt: now,
        };

        // 8. Insert the user into MongoDB
        const insertResult = await usersCollection.insertOne(newUser);

        // 9. Send OTP to the user
        try {
            await sendOTP(normalizedEmail, otp);
        } catch (emailError) {
            // Rollback user creation if we cannot securely deliver the OTP
            await usersCollection.deleteOne({ _id: insertResult.insertedId });
            console.error('Email sending failed, rolled back user creation:', emailError);
            return NextResponse.json(
                { message: 'Failed to send verification email. Please try again later.' },
                { status: 500 }
            );
        }

        // 10. Return successful response (Excluding the hash!)
        return NextResponse.json(
            {
                message: 'User registered successfully. Please verify your email.',
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
