"use client";

import { useState, useRef } from 'react';
import { Upload, X, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile } from '@/lib/storage';

interface ImageUploadProps {
    currentImage?: string | null;
    onUpload: (file: File) => Promise<void>;
    onDelete?: () => Promise<void>;
    disabled?: boolean;
}

export function ImageUpload({ currentImage, onUpload, onDelete, disabled }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
            setError(validation.error!);
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        try {
            await onUpload(file);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Eroare la încărcarea imaginii');
            setPreview(currentImage || null);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;

        setUploading(true);
        try {
            await onDelete();
            setPreview(null);
            setError(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err: any) {
            setError(err.message || 'Eroare la ștergerea imaginii');
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-6">
                {/* Preview Circle */}
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-16 h-16 text-gray-400" />
                        )}
                    </div>

                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={triggerFileInput}
                            disabled={disabled || uploading}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {preview ? 'Schimbă Fotografia' : 'Adaugă Fotografie'}
                        </Button>

                        {preview && onDelete && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={disabled || uploading}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Șterge
                            </Button>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        JPG, PNG sau WebP. Maxim 5MB. Imaginea va fi redimensionată automat.
                    </p>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || uploading}
            />
        </div>
    );
}
