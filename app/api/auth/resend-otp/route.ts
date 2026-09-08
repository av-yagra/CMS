import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import { sendOTP } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ message: 'Valid email is required' }, { status: 400 });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users');

        const now = new Date();
        
        // Generate OTP - ensure AUTH_SECRET is present
        const secret = process.env.AUTH_SECRET;
        if (!secret) {
            throw new Error('AUTH_SECRET is not configured. Cannot generate secure OTP.');
        }
        
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpHash = crypto.createHmac('sha256', secret).update(otp).digest('hex');
        const otpExpires = new Date(now.getTime() + 10 * 60 * 1000); // 10 mins
        const nextCooldown = new Date(now.getTime() + 60 * 1000); // 1 min cooldown

        // Atomically check cooldown and update to prevent race conditions
        // Only update if user exists, email not verified, and cooldown has passed
        const updateResult = await usersCollection.findOneAndUpdate(
            { 
                email: normalizedEmail,
                emailVerified: { $ne: true },
                $or: [
                    { emailVerificationResendCooldown: { $exists: false } },
                    { emailVerificationResendCooldown: { $lte: now } }
                ]
            },
            {
                $set: {
                    emailVerificationCodeHash: otpHash,
                    emailVerificationExpires: otpExpires,
                    emailVerificationAttempts: 0,
                    emailVerificationResendCooldown: nextCooldown
                }
            },
            { returnDocument: 'after' }
        );

        // Generic response whether user exists or not (don't leak user existence)
        if (!updateResult) {
            // Either user doesn't exist, already verified, or cooldown active
            return NextResponse.json({ message: 'If an account exists, a verification code has been sent.' }, { status: 200 });
        }

        await sendOTP(normalizedEmail, otp);

        return NextResponse.json({ message: 'If an account exists, a verification code has been sent.' }, { status: 200 });

    } catch (error) {
        console.error('Resend OTP API Error:', error);
        return NextResponse.json({ message: 'Internal server error occurred' }, { status: 500 });
    }
}
