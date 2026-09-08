import nodemailer from 'nodemailer';

const port = Number(process.env.EMAIL_SERVER_PORT) || 587;

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: port,
    secure: port === 465, // true for 465, false for other ports (like 587 for STARTTLS)
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export const sendOTP = async (to: string, otp: string) => {
    // Safely log configuration presence (NEVER the actual values)
    console.log('[EMAIL DIAGNOSTICS] Configuration Check:');
    console.log('- EMAIL_SERVER_HOST configured:', !!process.env.EMAIL_SERVER_HOST);
    console.log('- EMAIL_SERVER_PORT configured:', !!process.env.EMAIL_SERVER_PORT);
    console.log('- EMAIL_SERVER_USER configured:', !!process.env.EMAIL_SERVER_USER);
    console.log('- EMAIL_SERVER_PASSWORD configured:', !!process.env.EMAIL_SERVER_PASSWORD);
    console.log('- EMAIL_FROM configured:', !!process.env.EMAIL_FROM);

    // Unconditionally require email host so it throws a 500 when missing,
    // rolling back user creation, instead of falsely claiming success!
    if (!process.env.EMAIL_SERVER_HOST) {
        throw new Error('SMTP credentials are not configured. Cannot send OTP.');
    }

    try {
        console.log('[EMAIL DIAGNOSTICS] Verifying SMTP connection...');
        await transporter.verify();
        console.log('[EMAIL DIAGNOSTICS] SMTP connection verified successfully.');
    } catch (verifyError) {
        console.error('[EMAIL DIAGNOSTICS] SMTP verification failed. Check credentials/App Password:', verifyError);
        throw new Error('SMTP verification failed. Cannot send email.');
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
