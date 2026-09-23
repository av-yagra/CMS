import { ObjectId } from 'mongodb';

export interface BackendDestination {
    _id?: ObjectId;
    slug: string;
    name: string;
    country: string;
    image: string;
    imagePosition?: string;
    description: string;
    highlights: string[];
    bestTimeToVisit: string;
    createdAt: Date;
    updatedAt: Date;
}
