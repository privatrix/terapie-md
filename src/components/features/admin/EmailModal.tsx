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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";

interface EmailModalProps {
    recipientName: string;
    recipientEmail: string;
    onSend: (subject: string, message: string) => void;
    trigger?: React.ReactNode;
}

const EMAIL_TEMPLATES = {
    interview: {
        subject: "Invitație la interviu - Terapie.md",
        message: "Bună ziua,\n\nAm analizat aplicația dumneavoastră și am dori să programăm un scurt interviu online pentru a discuta mai multe detalii.\n\nVă rugăm să ne comunicați disponibilitatea dumneavoastră pentru săptămâna viitoare.\n\nCu respect,\nEchipa Terapie.md"
    },
    documents: {
        subject: "Solicitare documente suplimentare - Terapie.md",
        message: "Bună ziua,\n\nPentru a finaliza procesul de verificare, vă rugăm să ne trimiteți copii scanate ale următoarelor documente:\n\n- Diploma de licență/master\n- Atestatul de liberă practică\n\nMulțumim,\nEchipa Terapie.md"
    },
    welcome: {
        subject: "Bun venit pe Terapie.md!",
        message: "Felicitări! Aplicația dumneavoastră a fost aprobată.\n\nContul dumneavoastră de terapeut este acum activ. Vă puteți autentifica și completa profilul cu mai multe detalii.\n\nNe bucurăm să vă avem alături!\n\nEchipa Terapie.md"
    },
    rejection: {
        subject: "Actualizare privind aplicația Terapie.md",
        message: "Bună ziua,\n\nVă mulțumim pentru interesul acordat platformei noastre. Din păcate, în acest moment nu putem da curs aplicației dumneavoastră.\n\nVă dorim mult succes în continuare.\n\nCu respect,\nEchipa Terapie.md"
    }
};

export function EmailModal({ recipientName, recipientEmail, onSend, trigger }: EmailModalProps) {
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [template, setTemplate] = useState<string>("");

    const handleTemplateChange = (value: string) => {
        setTemplate(value);
        if (value && value in EMAIL_TEMPLATES) {
            const tmpl = EMAIL_TEMPLATES[value as keyof typeof EMAIL_TEMPLATES];
            setSubject(tmpl.subject);
            setMessage(tmpl.message.replace("{name}", recipientName));
        }
    };

    const handleSend = () => {
        onSend(subject, message);
        setOpen(false);
        setSubject("");
        setMessage("");
        setTemplate("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Trimite Email
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Trimite Email către {recipientName}</DialogTitle>
                    <DialogDescription>
                        Către: {recipientEmail}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Șablon</Label>
                        <Select value={template} onValueChange={handleTemplateChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Alege un șablon (opțional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="interview">Invitație Interviu</SelectItem>
                                <SelectItem value="documents">Solicitare Documente</SelectItem>
                                <SelectItem value="welcome">Aprobare & Bun Venit</SelectItem>
                                <SelectItem value="rejection">Respingere</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subiect</Label>
                        <input
                            id="subject"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subiectul emailului..."
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="message">Mesaj</Label>
                        <Textarea
                            id="message"
                            className="min-h-[150px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Scrie mesajul tău aici..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Anulează</Button>
                    <Button onClick={handleSend} disabled={!subject || !message}>
                        <Send className="h-4 w-4 mr-2" />
                        Trimite
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
