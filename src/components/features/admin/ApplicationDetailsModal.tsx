import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Mail, Phone, MapPin, Building2, Calendar, FileText, Send } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ApplicationDetailsModalProps {
    application: any;
    isOpen: boolean;
    onClose: () => void;
    onApprove: (app: any) => void;
    onReject: (id: string) => void;
    onRequestInfo: (app: any, message: string) => Promise<void>;
}

export function ApplicationDetailsModal({
    application,
    isOpen,
    onClose,
    onApprove,
    onReject,
    onRequestInfo
}: ApplicationDetailsModalProps) {
    const [isRequestingInfo, setIsRequestingInfo] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [sending, setSending] = useState(false);

    if (!application) return null;

    const handleSendRequest = async () => {
        if (!requestMessage.trim()) return;
        setSending(true);
        try {
            await onRequestInfo(application, requestMessage);
            setIsRequestingInfo(false);
            setRequestMessage("");
            // Don't close modal, just show success? Or close modal?
            // User might want to do other things.
        } catch (e) {
            console.error(e);
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 bg-gray-50 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl font-bold">{application.name}</DialogTitle>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="secondary">{application.title}</Badge>
                                {application.status === 'pending' && <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Review</Badge>}
                            </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                            Applied: {new Date(application.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-8">
                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>{application.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span>{application.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span>{application.location}</span>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" /> Professional Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Intervention Areas</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {application.specialties?.map((s: string) => (
                                            <Badge key={s} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">{s}</Badge>
                                        )) || <span className="text-sm text-gray-400">None</span>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Specializations</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {application.specializations?.map((s: string) => (
                                            <Badge key={s} variant="outline">{s}</Badge>
                                        )) || <span className="text-sm text-gray-400">None</span>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Medical Code</h4>
                                    <p className="font-mono bg-gray-100 px-2 py-1 rounded inline-block text-sm">{application.medical_code || "N/A"}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Price Range</h4>
                                    <p className="text-sm">{application.price_range || "Not specified"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" /> Bio
                            </h3>
                            <div className="bg-white border rounded-lg p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                                {application.bio}
                            </div>
                        </div>

                        {/* Education */}
                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" /> Education & Experience
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Education</h4>
                                    <div className="mt-2 space-y-2">
                                        {application.education?.map((edu: any, i: number) => (
                                            <div key={i} className="flex justify-between items-start text-sm border-l-2 border-slate-200 pl-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{edu.degree}</p>
                                                    <p className="text-gray-500">{edu.institution}</p>
                                                </div>
                                                <span className="text-gray-400 text-xs">{edu.year}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Experience</h4>
                                    <p className="text-sm">{application.experience_years} years</p>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" /> Availability
                            </h3>
                            <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100">{application.availability}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 border-t bg-gray-50 gap-2 sm:gap-0">
                    {isRequestingInfo ? (
                        <div className="w-full space-y-3">
                            <Textarea
                                placeholder="Type your message to the applicant requesting more information..."
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                className="min-h-[100px]"
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsRequestingInfo(false)}>Cancel</Button>
                                <Button onClick={handleSendRequest} disabled={sending} className="gap-2">
                                    {sending ? <span className="animate-spin">⏳</span> : <Send className="w-4 h-4" />}
                                    Send Request
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex w-full justify-between items-center">
                            <Button variant="outline" className="gap-2" onClick={() => setIsRequestingInfo(true)}>
                                <Mail className="w-4 h-4" /> Request Info
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="destructive" className="gap-2" onClick={() => onReject(application.id)}>
                                    <X className="w-4 h-4" /> Reject
                                </Button>
                                <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => onApprove(application)}>
                                    <Check className="w-4 h-4" /> Approve
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
