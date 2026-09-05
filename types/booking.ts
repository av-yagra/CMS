import { ObjectId } from 'mongodb';

export interface Booking {
    _id?: ObjectId;
    packageId: string;
    userId?: string | null;
    name: string;
    email: string;
    phone: string;
    nationality: string;
    travelers: number;
    expectedDate: string; // stored as string e.g. YYYY-MM-DD to avoid timezone shift
    details?: string;
    status: "Pending" | "Confirmed" | "Cancelled";
    createdAt: Date;
    updatedAt: Date;
}
