"use client";

import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
    title: string;
    text?: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: text || title,
                    url,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground transition-all duration-200"
            onClick={handleShare}
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-green-600 font-medium">Link Copiat!</span>
                </>
            ) : (
                <>
                    <Share2 className="h-4 w-4" />
                </>
            )}
        </Button>
    );
}
