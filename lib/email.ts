import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export const sendOTP = async (to: string, otp: string) => {
    // Only attempt to send if email host is configured
    if (!process.env.EMAIL_SERVER_HOST) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('SMTP credentials are not configured in production. Cannot send OTP.');
        }
        // Never log the actual OTP - security risk even in development
        console.warn(`[DEV] EMAIL_SERVER_HOST not configured. Email to ${to} skipped. Check server logs if you need the OTP for testing.`);
        // In development, you could alternatively store OTPs in a dev-only database table for testing
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"MNA Venture CMS" <noreply@example.com>',
        to,
        subject: 'Your Email Verification Code',
        text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};
