import { createClient } from '@/lib/supabase/client';

/**
 * Resize and compress an image file
 */
export async function resizeImage(file: File, maxSize: number = 800): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > height && width > maxSize) {
                height = (height / width) * maxSize;
                width = maxSize;
            } else if (height > maxSize) {
                width = (width / height) * maxSize;
                height = maxSize;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to create blob'));
                }
            }, 'image/jpeg', 0.85);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Upload a profile photo to Supabase Storage
 */
export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
    const supabase = createClient();

    // Resize the image first
    const resizedBlob = await resizeImage(file);
    const resizedFile = new File([resizedBlob], 'avatar.jpg', { type: 'image/jpeg' });

    // Upload to Supabase Storage
    const filePath = `${userId}/avatar.jpg`;
    const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, resizedFile, {
            upsert: true, // Replace if exists
            contentType: 'image/jpeg'
        });

    if (error) throw error;

    // Get public URL with timestamp to prevent caching
    const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

    return `${publicUrl}?t=${Date.now()}`;
}

/**
 * Delete a profile photo from Supabase Storage
 */
export async function deleteProfilePhoto(userId: string): Promise<void> {
    const supabase = createClient();

    const filePath = `${userId}/avatar.jpg`;
    const { error } = await supabase.storage
        .from('profile-photos')
        .remove([filePath]);

    if (error) throw error;
}

/**
 * Update therapist profile with new photo URL
 */
export async function updateTherapistPhoto(userId: string, photoUrl: string | null): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
        .from('therapist_profiles')
        .update({ photo_url: photoUrl })
        .eq('user_id', userId);

    if (error) throw error;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Format invalid. Folosiți JPG, PNG sau WebP.'
        };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'Fișier prea mare. Maxim 5MB.'
        };
    }

    return { valid: true };
}
