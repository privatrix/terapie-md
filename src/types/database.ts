// Database Types
export type UserRole = 'client' | 'therapist' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type SubmissionStatus = 'new' | 'in_progress' | 'resolved';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface TherapistProfile {
    id: string;
    user_id: string;
    name: string;
    title: string;
    bio?: string;
    specialties: string[];
    location: string;
    price_range: string;
    languages: string[];
    education: Array<{ degree: string; institution: string; year?: number }>;
    availability: string;
    image_url?: string;
    rating: number;
    review_count: number;
    verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface Offer {
    id: string;
    provider_id?: string;
    title: string;
    description: string;
    long_description?: string;
    price: number;
    original_price?: number;
    location: string;
    duration: string;
    tags: string[];
    image_url?: string;
    validity?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Booking {
    id: string;
    client_id: string;
    therapist_id: string;
    date: string;
    time: string;
    status: BookingStatus;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Review {
    id: string;
    therapist_id: string;
    client_id: string;
    rating: number;
    comment?: string;
    created_at: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: SubmissionStatus;
    created_at: string;
}

// Extended types with relations
export interface TherapistWithUser extends TherapistProfile {
    user: User;
}

export interface BookingWithDetails extends Booking {
    therapist: TherapistProfile;
    client: User;
}

export interface ReviewWithAuthor extends Review {
    client: {
        email: string;
    };
}
