import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, code } = body;

        if (!email || !code || typeof email !== 'string' || typeof code !== 'string') {
            return NextResponse.json({ message: 'Email and verification code are required' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email: normalizedEmail });

        if (!user) {
            // Return generic error to not expose user existence immediately? Actually, login requires email, usually 404 is fine here given it's part of registration flow, but let's be normal.
            return NextResponse.json({ message: 'User not found or code invalid' }, { status: 404 });
        }

        if (user.emailVerified) {
            return NextResponse.json({ message: 'Email already verified' }, { status: 400 });
        }

        if (!user.emailVerificationCodeHash || !user.emailVerificationExpires) {
            return NextResponse.json({ message: 'No verification code found. Please request a new one.' }, { status: 400 });
        }

        // Check expiration first (cheaper check)
        if (new Date() > new Date(user.emailVerificationExpires)) {
            return NextResponse.json({ message: 'Verification code expired. Please request a new one.' }, { status: 400 });
        }

        // Check attempts
        const maxAttempts = 5;
        if ((user.emailVerificationAttempts || 0) >= maxAttempts) {
            return NextResponse.json({ message: 'Too many failed attempts. Please request a new code.' }, { status: 429 });
        }

        // Verify code - ensure AUTH_SECRET is present
        const secret = process.env.AUTH_SECRET;
        if (!secret) {
            throw new Error('AUTH_SECRET is not configured. Cannot verify OTP.');
        }
        
        const codeHash = crypto.createHmac('sha256', secret).update(code).digest('hex');

        if (codeHash !== user.emailVerificationCodeHash) {
            // Atomically increment attempts to prevent race conditions
            await usersCollection.updateOne(
                { 
                    _id: user._id,
                    emailVerificationAttempts: { $lt: maxAttempts }
                },
                { $inc: { emailVerificationAttempts: 1 } }
            );
            
            // Check if we just hit the limit
            const updatedAttempts = (user.emailVerificationAttempts || 0) + 1;
            if (updatedAttempts >= maxAttempts) {
                return NextResponse.json({ message: 'Too many failed attempts. Please request a new code.' }, { status: 429 });
            }
            
            return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
        }

        // Success - clear verification fields
        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: { emailVerified: true },
                $unset: {
                    emailVerificationCodeHash: "",
                    emailVerificationExpires: "",
                    emailVerificationAttempts: "",
                    emailVerificationResendCooldown: ""
                }
            }
        );

        return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });

    } catch (error) {
        console.error('Verify Email API Error:', error);
        return NextResponse.json({ message: 'Internal server error occurred' }, { status: 500 });
    }
}
