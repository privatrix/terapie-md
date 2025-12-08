"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, FileText, Trash2, Users, UserCog, ClipboardList, BarChart3, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { EmailModal } from "@/components/features/admin/EmailModal";
import Link from "next/link";
import { ExternalLink, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminDashboard({ user }: { user: any }) {
    const [applications, setApplications] = useState<any[]>([]);
    const [businessApplications, setBusinessApplications] = useState<any[]>([]);
    const [therapists, setTherapists] = useState<any[]>([]);
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTherapists: 0,
        totalClients: 0,
        totalBusinesses: 0,
        pendingApplications: 0,
        newContactMessages: 0,
        pendingBusinessApps: 0,
    });
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const supabase = createClient();

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
            // Mock data for demo
            setApplications([
                {
                    id: "1",
                    name: "Dr. Maria Ionescu",
                    email: "maria@example.com",
                    status: "pending",
                    title: "Psihoterapeut",
                    bio: "Specialist cu 5 ani experiență în terapia de cuplu.",
                    specialties: ["Anxietate", "Terapie de cuplu"],
                    price_range: "400-600 MDL",
                    experience_years: 5,
                    license_number: "RO123456",
                    availability: "Luni-Vineri",
                    location: "Chișinău",
                    phone: "+373 69 000 000",
                    created_at: new Date().toISOString()
                }
            ]);
            setTherapists([
                { id: "1", name: "Dr. Elena Popescu", email: "elena@example.com", verified: true, title: "Psihoterapeut Integrativ", location: "Chișinău", created_at: new Date().toISOString() }
            ]);
            setUsers([
                { id: "1", email: "user@example.com", role: "client", created_at: new Date().toISOString() }
            ]);
            setContactSubmissions([
                { id: "1", name: "Ion Popescu", email: "ion@example.com", subject: "Întrebare despre servicii", message: "Aș dori să știu mai multe despre...", status: "new", created_at: new Date().toISOString() },
                { id: "2", name: "Maria Rusu", email: "maria@example.com", subject: "Solicitare programare", message: "Doresc să programez o consultație...", status: "in_progress", created_at: new Date(Date.now() - 86400000).toISOString() }
            ]);
            setBusinessApplications([
                { id: "1", company_name: "Lotus Wellness SPA", cui: "1234567", contact_email: "contact@lotus.md", contact_phone: "+37369123456", location: "Chișinău", status: "pending", created_at: new Date().toISOString() }
            ]);
            setBusinesses([
                { id: "1", company_name: "Active Business", location: "Chișinău", verified: true, created_at: new Date().toISOString() }
            ]);
            setStats({ totalUsers: 3, totalTherapists: 1, totalClients: 1, totalBusinesses: 1, pendingApplications: 1, newContactMessages: 1, pendingBusinessApps: 1 });
            setLoading(false);
            return;
        }

        try {
            // Fetch pending applications
            const { data: appsData } = await supabase
                .from("therapist_applications")
                .select("*")
                .eq("status", "pending")
                .order("created_at", { ascending: false });

            // Fetch all therapists
            const { data: therapistsData } = await supabase
                .from("therapist_profiles")
                .select("*")
                .order("created_at", { ascending: false });

            // Fetch all businesses
            const { data: businessesData } = await supabase
                .from("business_profiles")
                .select("*")
                .order("created_at", { ascending: false });

            // Fetch all users
            const { data: usersData } = await supabase
                .from("users")
                .select("*")
                .order("created_at", { ascending: false });

            // Fetch contact submissions
            const { data: contactData } = await supabase
                .from("contact_submissions")
                .select("*")
                .order("created_at", { ascending: false });

            // Fetch business applications
            const { data: businessAppsData } = await supabase
                .from("business_applications")
                .select("*")
                .eq("status", "pending")
                .order("created_at", { ascending: false });

            setApplications(appsData || []);
            setBusinessApplications(businessAppsData || []);
            setTherapists(therapistsData || []);
            setBusinesses(businessesData || []);
            setUsers(usersData || []);
            setContactSubmissions(contactData || []);

            // Calculate stats
            const totalUsers = usersData?.length || 0;
            const totalTherapists = usersData?.filter(u => u.role === "therapist").length || 0;
            const totalClients = usersData?.filter(u => u.role === "client").length || 0;
            const totalBusinesses = businessesData?.length || 0;
            const pendingApplications = appsData?.length || 0;
            const newContactMessages = contactData?.filter(c => c.status === "new").length || 0;
            const pendingBusinessApps = businessAppsData?.length || 0;

            setStats({
                totalUsers,
                totalTherapists,
                totalClients,
                totalBusinesses,
                pendingApplications,
                newContactMessages,
                pendingBusinessApps,
            });
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateContactStatus = async (id: string, status: string) => {
        const supabase = createClient();

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                // Mock data handling
                setContactSubmissions(prev =>
                    prev.map(c => c.id === id ? { ...c, status } : c)
                );
                return;
            }

            const { error } = await supabase
                .from("contact_submissions")
                .update({ status })
                .eq("id", id);

            if (error) throw error;

            // Update local state
            setContactSubmissions(prev =>
                prev.map(c => c.id === id ? { ...c, status } : c)
            );

            // Update stats if status changed to/from 'new'
            fetchAllData();

        } catch (error) {
            console.error("Error updating contact status:", error);
            alert("Eroare la actualizarea statusului mesajului");
        }
    };

    const handleApproveBusiness = async (app: any) => {
        setProcessingId(app.id);
        const supabase = createClient();

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                // Mock data
                setBusinessApplications((prev) => prev.filter(a => a.id !== app.id));
                alert("Aplicație business aprobată! (Demo)");
                setProcessingId(null);
                return;
            }

            // Import password generator dynamically (client-side)
            const { generateTempPassword } = await import('@/lib/generate-password');
            const tempPassword = generateTempPassword();

            // 1. Create Supabase Auth User via API route
            const userResponse = await fetch('/api/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: app.contact_email,
                    password: tempPassword,
                    name: app.company_name,
                    type: 'business'
                })
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.error || 'Failed to create user');
            }

            const { user: newUser, isExisting } = await userResponse.json();
            if (!newUser) throw new Error("Utilizator nu a fost creat");

            // 2. Create Business Profile (only if not exists, but insert will fail if unique constraint violated, so maybe upsert or check?)
            // Since we fixed RLS, we can try to insert. If it fails with unique constraint, it means profile exists.

            // Let's check if profile exists first to avoid error
            const { data: existingProfile } = await supabase
                .from("business_profiles")
                .select("id")
                .eq("user_id", newUser.id)
                .single();

            if (!existingProfile) {
                const { error: profileError } = await supabase
                    .from("business_profiles")
                    .insert({
                        user_id: newUser.id,
                        company_name: app.company_name,
                        cui: app.cui,
                        description: app.description,
                        website: app.website,
                        location: app.location,
                        contact_email: app.contact_email,
                        contact_phone: app.contact_phone,
                        verified: true
                    });

                if (profileError) throw profileError;
            }

            // 3. Update users table with business role
            const { error: roleError } = await supabase
                .from("users")
                .update({ role: 'business' })
                .eq("id", newUser.id);

            if (roleError) console.warn("Role update warning:", roleError);

            // 4. Update Application Status
            const { error: appError } = await supabase
                .from("business_applications")
                .update({ status: "approved", reviewed_at: new Date().toISOString() })
                .eq("id", app.id);

            if (appError) throw appError;

            // 5. Send Approval Email
            try {
                const emailResponse = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'approval',
                        data: {
                            name: app.company_name,
                            email: app.contact_email,
                            tempPassword: tempPassword,
                            type: 'business',
                            loginUrl: `${window.location.origin}/login`
                        }
                    })
                });

                if (!emailResponse.ok) {
                    console.error("Email sending failed:", await emailResponse.text());
                }
            } catch (emailError) {
                console.error("Email error:", emailError);
            }

            alert(`Aplicație business aprobată cu succes!\n\nCont creat pentru: ${app.contact_email}\nParolă temporară: ${tempPassword}\n\nEmail trimis!`);
            fetchAllData();

        } catch (error: any) {
            console.error("Error approving business:", error);
            alert(`Eroare la aprobarea aplicației: ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleRejectBusiness = async (id: string) => {
        if (!confirm("Sigur doriți să respingeți această aplicație?")) return;

        const supabase = createClient();

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                setBusinessApplications((prev) => prev.filter(a => a.id !== id));
                alert("Aplicație respinsă! (Demo)");
                return;
            }

            const { error } = await supabase
                .from("business_applications")
                .update({ status: "rejected", reviewed_at: new Date().toISOString() })
                .eq("id", id);

            if (error) throw error;

            alert("Aplicație respinsă");
            fetchAllData();

        } catch (error) {
            console.error("Error rejecting business:", error);
            alert("Eroare la respingerea aplicației");
        }
    };


    const handleSendEmail = async (appId: string, recipientName: string, recipientEmail: string, subject: string, message: string) => {
        setProcessingId(appId);
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'reply',
                    data: {
                        name: recipientName,
                        email: recipientEmail,
                        subject: subject,
                        message: message
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send email');
            }

            alert(`Email trimis cu succes către ${recipientName}!`);
        } catch (error: any) {
            console.error("Error sending email:", error);
            alert(`Eroare la trimiterea emailului: ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReply = async (contactId: string, recipientName: string, recipientEmail: string, subject: string, message: string) => {
        setProcessingId(contactId);
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'reply',
                    data: {
                        name: recipientName,
                        email: recipientEmail,
                        subject: subject,
                        message: message
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to send email');
            }

            // Update status to 'resolved' (or 'replied' if you had that status)
            await handleUpdateContactStatus(contactId, 'resolved');

            alert(`Răspuns trimis cu succes către ${recipientName}!`);
        } catch (error: any) {
            console.error("Error sending reply:", error);
            alert(`Eroare la trimiterea emailului: ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleApprove = async (app: any) => {
        setProcessingId(app.id);
        const supabase = createClient();

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                // Mock behavior
                await new Promise(resolve => setTimeout(resolve, 1000));
                setApplications(prev => prev.filter(a => a.id !== app.id));
                setTherapists(prev => [...prev, {
                    id: Math.random().toString(),
                    name: app.name,
                    email: app.email,
                    verified: true,
                    title: app.title,
                    location: app.location,
                    created_at: new Date().toISOString()
                }]);
                alert("Aplicație aprobată cu succes! (Demo Mode)\n\nÎn producție:\n- Cont creat automat\n- Email trimis cu parola temporară");
                setProcessingId(null);
                return;
            }

            // Import password generator dynamically (client-side)
            const { generateTempPassword } = await import('@/lib/generate-password');
            const tempPassword = generateTempPassword();

            // 1. Create Supabase Auth User via API route (server-side with service role)
            const userResponse = await fetch('/api/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: app.email,
                    password: tempPassword,
                    name: app.name,
                    type: 'therapist'
                })
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(errorData.error || 'Failed to create user');
            }

            const { user: newUser } = await userResponse.json();
            if (!newUser) throw new Error("Utilizator nu a fost creat");

            // 2. Create Therapist Profile
            const { error: profileError } = await supabase
                .from("therapist_profiles")
                .insert({
                    user_id: newUser.id,
                    name: app.name,
                    title: app.title,
                    bio: app.bio,
                    specialties: app.specialties,
                    location: app.location,
                    price_range: app.price_range,
                    languages: app.languages,
                    education: app.education,
                    availability: app.availability,
                    verified: true
                });

            if (profileError) throw profileError;

            // 3. Update users table with therapist role
            const { error: roleError } = await supabase
                .from("users")
                .update({ role: 'therapist' })
                .eq("id", newUser.id);

            if (roleError) console.warn("Role update warning:", roleError);

            // 4. Update Application Status
            const { error: appError } = await supabase
                .from("therapist_applications")
                .update({
                    status: "approved",
                    reviewed_at: new Date().toISOString(),
                })
                .eq("id", app.id);

            if (appError) throw appError;

            // 5. Send Approval Email
            try {
                const emailResponse = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'approval',
                        data: {
                            name: app.name,
                            email: app.email,
                            tempPassword: tempPassword,
                            type: 'terapeut',
                            loginUrl: `${window.location.origin}/login`
                        }
                    })
                });

                if (!emailResponse.ok) {
                    console.error("Email sending failed:", await emailResponse.text());
                }
            } catch (emailError) {
                console.error("Email error:", emailError);
            }

            alert(`Aplicație aprobată cu succes!\n\nCont creat pentru: ${app.email}\nParolă temporară: ${tempPassword}\n\n${process.env.RESEND_API_KEY ? 'Email trimis!' : 'Adaugă RESEND_API_KEY pentru email automat'}`);
            fetchAllData();

        } catch (error: any) {
            console.error("Error approving application:", error);
            alert(`Eroare la aprobarea aplicației:\n${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        const supabase = createClient();

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                // Mock behavior
                await new Promise(resolve => setTimeout(resolve, 1000));
                setApplications(prev => prev.filter(a => a.id !== id));
                alert("Aplicație respinsă! (Demo)");
                setProcessingId(null);
                return;
            }

            const { error } = await supabase
                .from("therapist_applications")
                .update({
                    status: "rejected",
                    reviewed_at: new Date().toISOString()
                })
                .eq("id", id);

            if (error) throw error;
            fetchAllData();
        } catch (error) {
            console.error("Error rejecting:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeleteTherapist = async (id: string) => {
        console.log("Attempting to delete therapist with ID:", id);
        if (!confirm(`Sigur vrei să ștergi acest terapeut (ID: ${id})? Această acțiune nu poate fi anulată.`)) {
            return;
        }

        setProcessingId(id);
        const supabase = createClient();

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                console.log("Demo mode: Removing therapist from local state");
                await new Promise(resolve => setTimeout(resolve, 1000));
                setTherapists(prev => prev.filter(t => t.id !== id));
                alert("Terapeut șters cu succes! (Mod Demo)");
                setProcessingId(null);
                return;
            }

            const { error, count } = await supabase
                .from("therapist_profiles")
                .delete({ count: 'exact' })
                .eq("id", id);

            if (error) {
                alert(`Eroare Supabase: ${error.message} (Code: ${error.code})`);
                throw error;
            }

            if (count === 0) {
                alert("Atenție: Niciun rând nu a fost șters. Verificați ID-ul sau permisiunile.");
            } else {
                alert(`Terapeut șters cu succes! (Șterse: ${count})`);
            }

            fetchAllData();
        } catch (error: any) {
            console.error("Error deleting therapist:", error);
            // Alert is already handled above for Supabase errors
            if (!error.code) {
                alert(`A apărut o eroare neașteptată: ${error.message || error}`);
            }
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm(`Sigur vrei să ștergi acest utilizator (ID: ${id})? Această acțiune este ireversibilă.`)) {
            return;
        }

        setProcessingId(id);

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                // Mock behavior
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUsers(prev => prev.filter(u => u.id !== id));
                alert("Utilizator șters cu succes! (Demo Mode)");
                return;
            }

            const response = await fetch("/api/admin/users/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete user");
            }

            alert("Utilizator șters cu succes!");
            fetchAllData();

        } catch (error: any) {
            console.error("Error deleting user:", error);
            alert(`Eroare la ștergerea utilizatorului: ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    // ... (rest of the component)

    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Panou Administrare</h2>
                <Badge variant="outline">Admin</Badge>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Utilizatori</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Terapeuți</CardTitle>
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTherapists}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clienți</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aplicații Pending</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingApplications}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mesaje Noi</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.newContactMessages}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Business Apps</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingBusinessApps}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for different admin sections */}
            <Tabs defaultValue="applications" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="applications">
                        Aplicații ({applications.length + businessApplications.length})
                    </TabsTrigger>
                    <TabsTrigger value="therapists">
                        Terapeuți ({therapists.length})
                    </TabsTrigger>
                    <TabsTrigger value="users">
                        Utilizatori ({users.length})
                    </TabsTrigger>
                    <TabsTrigger value="contacts">
                        Contact ({contactSubmissions.length})
                    </TabsTrigger>
                    <TabsTrigger value="business">
                        Business ({businesses.length})
                    </TabsTrigger>
                </TabsList>

                {/* Applications Tab */}
                <TabsContent value="applications" className="space-y-8">
                    {/* Therapist Applications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aplicații Terapeuți ({applications.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {applications.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">Nu sunt aplicații noi de la terapeuți.</p>
                            ) : (
                                <div className="space-y-4">
                                    {applications.map((app) => (
                                        <div key={app.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg gap-4 bg-card hover:bg-accent/5 transition-colors">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg">{app.name}</h3>
                                                    <Badge>{app.title}</Badge>
                                                    <Badge variant="outline" className="text-xs">Pending</Badge>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-muted-foreground">
                                                    <p>📧 {app.email}</p>
                                                    <p>📱 {app.phone}</p>
                                                    <p>📍 {app.location}</p>
                                                    <p>📅 {new Date(app.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                                                {/* View Details Dialog */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="w-full justify-start">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Vezi Detalii
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-xl">Aplicație: {app.name}</DialogTitle>
                                                            <DialogDescription>
                                                                Depusă la: {new Date(app.created_at).toLocaleString()}
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="space-y-6 py-4">
                                                            {/* Personal Info Section */}
                                                            <div className="space-y-3">
                                                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground border-b pb-1">Informații Personale</h4>
                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div><span className="font-medium">Email:</span> {app.email}</div>
                                                                    <div><span className="font-medium">Telefon:</span> {app.phone}</div>
                                                                    <div><span className="font-medium">Locație:</span> {app.location}</div>
                                                                </div>
                                                            </div>

                                                            {/* Professional Info Section */}
                                                            <div className="space-y-3">
                                                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground border-b pb-1">Detalii Profesionale</h4>
                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div><span className="font-medium">Titlu:</span> {app.title}</div>
                                                                    <div><span className="font-medium">Experiență:</span> {app.experience_years} ani</div>
                                                                    <div><span className="font-medium">Licență:</span> {app.license_number}</div>
                                                                    <div><span className="font-medium">Preț:</span> {app.price_range}</div>
                                                                </div>

                                                                <div className="space-y-1">
                                                                    <span className="font-medium text-sm">Specializări:</span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {app.specialties?.map((s: string) => (
                                                                            <Badge key={s} variant="secondary">{s}</Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-1">
                                                                    <span className="font-medium text-sm">Bio:</span>
                                                                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{app.bio}</p>
                                                                </div>
                                                            </div>

                                                            {/* Actions in Dialog */}
                                                            <div className="flex flex-col gap-3 pt-4 border-t">
                                                                <EmailModal
                                                                    recipientName={app.name}
                                                                    recipientEmail={app.email}
                                                                    onSend={(s, m) => handleSendEmail(app.id, app.name, app.email, s, m)}
                                                                    trigger={
                                                                        <Button variant="outline" className="w-full">
                                                                            <Mail className="h-4 w-4 mr-2" />
                                                                            Contactează Aplicant (Email)
                                                                        </Button>
                                                                    }
                                                                />
                                                                <div className="flex gap-3">
                                                                    <Button
                                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                                        onClick={() => handleApprove(app)}
                                                                        disabled={!!processingId}
                                                                    >
                                                                        <Check className="h-4 w-4 mr-2" />
                                                                        Aprobă Aplicația
                                                                    </Button>
                                                                    <Button
                                                                        className="flex-1"
                                                                        variant="destructive"
                                                                        onClick={() => handleReject(app.id)}
                                                                        disabled={!!processingId}
                                                                    >
                                                                        <X className="h-4 w-4 mr-2" />
                                                                        Respinge
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* Quick Actions */}
                                                <EmailModal
                                                    recipientName={app.name}
                                                    recipientEmail={app.email}
                                                    onSend={(s, m) => handleSendEmail(app.id, app.name, app.email, s, m)}
                                                />

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApprove(app)}
                                                        disabled={!!processingId}
                                                        title="Aprobă"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="flex-1"
                                                        onClick={() => handleReject(app.id)}
                                                        disabled={!!processingId}
                                                        title="Respinge"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Business Applications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aplicații Business Wellness ({businessApplications.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {businessApplications.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">Nu există aplicații business noi.</p>
                            ) : (
                                <div className="space-y-4">
                                    {businessApplications.map((app) => (
                                        <div key={app.id} className="p-6 border rounded-lg space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-2">{app.company_name}</h3>
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <p><span className="font-medium">Email:</span> {app.contact_email}</p>
                                                        <p><span className="font-medium">Telefon:</span> {app.contact_phone}</p>
                                                        <p><span className="font-medium">Locație:</span> {app.location}</p>
                                                        {app.website && <p><span className="font-medium">Website:</span> {app.website}</p>}
                                                        {app.description && (
                                                            <p className="mt-2"><span className="font-medium">Descriere:</span> {app.description}</p>
                                                        )}
                                                        <p className="text-xs pt-2">
                                                            Aplicat: {new Date(app.created_at).toLocaleDateString('ro-RO', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">{app.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <EmailModal
                                                    recipientName={app.company_name}
                                                    recipientEmail={app.contact_email}
                                                    onSend={(s, m) => handleSendEmail(app.id, app.company_name, app.contact_email, s, m)}
                                                    trigger={
                                                        <Button size="sm" variant="outline" disabled={!!processingId}>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Cere Informații
                                                        </Button>
                                                    }
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => handleApproveBusiness(app)}
                                                    disabled={!!processingId}
                                                >
                                                    {processingId === app.id ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Se procesează...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="mr-2 h-4 w-4" />
                                                            Aprobă
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleRejectBusiness(app.id)}
                                                    disabled={!!processingId}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Respinge
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Therapists Tab */}
                <TabsContent value="therapists" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Toți Terapeuții</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {therapists.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">Nu există terapeuți înregistrați.</p>
                            ) : (
                                <div className="space-y-4">
                                    {therapists.map((therapist) => (
                                        <div key={therapist.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg gap-4 items-center">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{therapist.name}</h3>
                                                    {therapist.verified && <Badge variant="secondary">Verificat</Badge>}
                                                    <span className="text-xs text-muted-foreground font-mono bg-gray-100 px-1 rounded">ID: {therapist.id}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{therapist.title}</p>
                                                <p className="text-sm">Locație: {therapist.location}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/terapeuti/${therapist.id}`} target="_blank">
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        Vezi Profil Public
                                                    </Link>
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeleteTherapist(therapist.id)}
                                                    disabled={!!processingId}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gestionare Utilizatori</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {users.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">Nu există utilizatori.</p>
                            ) : (
                                <div className="space-y-4">
                                    {users.map((u) => (
                                        <div key={u.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg gap-4">
                                            <div className="space-y-1">
                                                <p className="font-medium">{u.email}</p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={u.role === "admin" ? "default" : u.role === "therapist" ? "secondary" : "outline"}>
                                                        {u.role}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        Înregistrat: {new Date(u.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Select
                                                    defaultValue={u.role}
                                                    onValueChange={(value) => handleChangeUserRole(u.id, value as "client" | "therapist" | "admin")}
                                                    disabled={!!processingId}
                                                >
                                                    <SelectTrigger className="w-[130px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="client">Client</SelectItem>
                                                        <SelectItem value="therapist">Terapeut</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    disabled={!!processingId || u.role === "admin"}
                                                    title="Șterge Utilizator"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Messages Tab */}
                <TabsContent value="contacts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mesaje din Formular de Contact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {contactSubmissions.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">Nu există mesaje de contact</p>
                            ) : (
                                <div className="space-y-4">
                                    {contactSubmissions.map((contact) => (
                                        <div key={contact.id} className="p-4 border rounded-lg space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold">{contact.name}</h4>
                                                        <Badge variant={
                                                            contact.status === "new" ? "default" :
                                                                contact.status === "in_progress" ? "secondary" :
                                                                    "outline"
                                                        }>
                                                            {contact.status === "new" ? "Nou" :
                                                                contact.status === "in_progress" ? "În Progres" :
                                                                    "Rezolvat"}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-1">{contact.email}</p>
                                                    <p className="text-sm font-medium text-primary mb-2">{contact.subject}</p>
                                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                                                        {contact.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        Primit: {new Date(contact.created_at).toLocaleDateString('ro-RO', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-2">
                                                <EmailModal
                                                    recipientName={contact.name}
                                                    recipientEmail={contact.email}
                                                    onSend={(s, m) => handleReply(contact.id, contact.name, contact.email, s, m)}
                                                    trigger={
                                                        <Button size="sm" variant="outline" disabled={!!processingId}>
                                                            <Mail className="h-4 w-4 mr-2" />
                                                            Răspunde
                                                        </Button>
                                                    }
                                                />
                                                {contact.status !== "in_progress" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleUpdateContactStatus(contact.id, "in_progress")}
                                                        disabled={!!processingId}
                                                    >
                                                        Marchează În Progres
                                                    </Button>
                                                )}
                                                {contact.status !== "resolved" && (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => handleUpdateContactStatus(contact.id, "resolved")}
                                                        disabled={!!processingId}
                                                    >
                                                        <Check className="h-4 w-4 mr-2" />
                                                        Marchează Rezolvat
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Business Profiles Tab */}
                <TabsContent value="business" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Business-uri Aprobate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {businesses.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">Nu există business-uri aprobate.</p>
                            ) : (
                                <div className="space-y-4">
                                    {businesses.map((business) => (
                                        <div key={business.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg gap-4 items-center">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{business.company_name}</h3>
                                                    {business.verified && <Badge variant="secondary">Verificat</Badge>}
                                                    <span className="text-xs text-muted-foreground font-mono bg-gray-100 px-1 rounded">ID: {business.id}</span>
                                                </div>
                                                <p className="text-sm">Locație: {business.location}</p>
                                                <p className="text-sm text-muted-foreground">{business.contact_email}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {/* Add actions if needed, e.g. delete */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
