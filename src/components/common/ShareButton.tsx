"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
    url?: string;
    title?: string;
    className?: string;
}

export function ShareButton({ url, title, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareUrl = url || window.location.href;
        const shareTitle = title || document.title;

        // Try native share API first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    url: shareUrl,
                });
                return;
            } catch (error) {
                console.log("Error sharing:", error);
            }
        }

        // Fallback to clipboard copy
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className={className}
            onClick={handleShare}
        >
            {copied ? (
                <>
                    <Check className="mr-2 h-4 w-4" />
                    Copiat!
                </>
            ) : (
                <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Distribuie
                </>
            )}
        </Button>
    );
}
