"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const supabase = createClient();
            const { error: submitError } = await supabase
                .from("contact_submissions")
                .insert([formData]);

            if (submitError) throw submitError;

            // Send email notification
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            setSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });

            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(err.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <h1 className="font-heading text-3xl font-bold md:text-5xl">Contactează-ne</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Suntem aici pentru a te ajuta. Scrie-ne dacă ai întrebări sau sugestii.
                </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <h2 className="font-heading text-2xl font-bold">Informații de Contact</h2>
                        <p className="text-muted-foreground">
                            Echipa noastră de suport este disponibilă de Luni până Vineri, între orele 09:00 - 18:00.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="font-medium">Email</div>
                                <div className="text-muted-foreground">suport@terapie.md</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="font-medium">Telefon</div>
                                <div className="text-muted-foreground">+37369269888</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    {success && (
                        <div className="mb-4 rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm text-primary">
                            Mesaj trimis cu succes! Îți vom răspunde curând.
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Nume</label>
                                <input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="Numele tău"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="email@exemplu.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">Subiect</label>
                            <input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Subiectul mesajului"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Mesaj</label>
                            <textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Scrie mesajul tău aici..."
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Se trimite..." : "Trimite Mesaj"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
