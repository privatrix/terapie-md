"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
}

interface BookingChatProps {
    bookingId: string;
    currentUserId: string;
    otherUserName: string;
}

export function BookingChat({ bookingId, currentUserId, otherUserName }: BookingChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`booking_messages:${bookingId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'booking_messages',
                    filter: `booking_id=eq.${bookingId}`
                },
                (payload) => {
                    // Only add if not already present (to avoid duplicates from optimistic update)
                    const newMessage = payload.new as Message;
                    setMessages((prev) => {
                        if (prev.some(msg => msg.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                    scrollToBottom();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [bookingId]);

    const fetchMessages = async () => {
        try {
            console.log("Fetching messages for booking:", bookingId);
            const { data, error } = await supabase
                .from("booking_messages")
                .select("*")
                .eq("booking_id", bookingId)
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Supabase Error object:", error);
                console.error("Supabase Error message:", error.message);
                console.error("Supabase Error details:", error.details);
                throw error;
            }
            setMessages(data || []);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 100);
    };

    const markAsRead = async () => {
        try {
            await supabase.rpc('mark_messages_read', {
                p_booking_id: bookingId,
                p_user_id: currentUserId
            });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    useEffect(() => {
        markAsRead();
    }, [messages.length]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageContent = newMessage.trim();
        setNewMessage(""); // Clear input immediately
        setSending(true);

        // Optimistic update
        const optimisticId = `temp-${Date.now()}`;
        const optimisticMessage: Message = {
            id: optimisticId,
            sender_id: currentUserId,
            content: messageContent,
            created_at: new Date().toISOString()
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        scrollToBottom();

        try {
            const response = await fetch("/api/bookings/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId,
                    content: messageContent
                })
            });

            if (!response.ok) throw new Error("Failed to send message");

            const { message: data } = await response.json();

            // Replace optimistic message with real one
            setMessages((prev) => prev.map(msg =>
                msg.id === optimisticId ? data : msg
            ));
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Nu s-a putut trimite mesajul.");
            // Revert optimistic update
            setMessages((prev) => prev.filter(msg => msg.id !== optimisticId));
            setNewMessage(messageContent); // Restore content
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col h-[400px] border rounded-md">
            <div className="p-3 border-b bg-muted/50">
                <h3 className="font-medium text-sm">Chat cu {otherUserName}</h3>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                        Niciun mesaj încă. Începe conversația!
                    </p>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUserId;
                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-full",
                                    isMe ? "justify-end" : "justify-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                                        isMe
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}
                                >
                                    <p>{msg.content}</p>
                                    <p className={cn(
                                        "text-[10px] mt-1 opacity-70",
                                        isMe ? "text-primary-foreground" : "text-muted-foreground"
                                    )}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-3 border-t bg-background">
                <div className="flex gap-2">
                    <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Scrie un mesaj..."
                        className="min-h-[40px] max-h-[120px] resize-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                    >
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
