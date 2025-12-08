"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => Promise<void>;
    therapistName?: string;
    businessName?: string;
}

export function ReviewModal({ isOpen, onClose, onSubmit, therapistName, businessName }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);
        try {
            await onSubmit(rating, comment);
            onClose();
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Lasă o recenzie</DialogTitle>
                    <DialogDescription>
                        Cum a fost experiența cu {businessName || therapistName}?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-colors"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`h-8 w-8 ${star <= (hoverRating || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <div className="text-center text-sm font-medium text-muted-foreground">
                        {rating > 0 ? (
                            rating === 5 ? "Excelent" :
                                rating === 4 ? "Foarte bine" :
                                    rating === 3 ? "Bine" :
                                        rating === 2 ? "Slăbuț" : "Nesatisfăcător"
                        ) : "Selectează o notă"}
                    </div>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Scrie câteva cuvinte despre experiența ta (opțional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Anulează
                    </Button>
                    <Button onClick={handleSubmit} disabled={rating === 0 || loading}>
                        {loading ? "Se trimite..." : "Trimite Recenzia"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
