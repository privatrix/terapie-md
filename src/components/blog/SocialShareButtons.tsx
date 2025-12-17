"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin } from "lucide-react";

interface SocialShareButtonsProps {
    title: string;
}

export function SocialShareButtons({ title }: SocialShareButtonsProps) {
    const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
        if (typeof window === 'undefined') return;

        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(title);

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                onClick={() => handleShare('facebook')}
                title="Share on Facebook"
            >
                <Facebook className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200"
                onClick={() => handleShare('twitter')}
                title="Share on Twitter"
            >
                <Twitter className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
                onClick={() => handleShare('linkedin')}
                title="Share on LinkedIn"
            >
                <Linkedin className="h-4 w-4" />
            </Button>
        </div>
    );
}
