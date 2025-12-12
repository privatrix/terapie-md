"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, FileText, Trash2, Users, UserCog, ClipboardList, BarChart3, Mail, Briefcase, Building2, Phone, MapPin, CheckCircle2, XCircle, Eye, ExternalLink } from "lucide-react";
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

    const handleChangeUserRole = async (userId: string, newRole: 'client' | 'therapist' | 'business' | 'admin') => {
        setProcessingId(userId);
        const supabase = createClient();

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                // Mock behavior
                await new Promise(resolve => setTimeout(resolve, 1000));
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
                alert(`Role updated to ${newRole} (Demo Mode)`);
                return;
            }

            const { error } = await supabase
                .from('users')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            alert(`Rolul utilizatorului a fost actualizat la: ${newRole}`);
            fetchAllData();

        } catch (error: any) {
            console.error("Error updating user role:", error);
            alert(`Eroare la actualizarea rolului: ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    // ... (rest of the component)

    return (
        <div className="space-y-6">

            <div className="flex flex-row justify-between items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Panou Administrare</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">{user?.email}</span>
                    <Badge variant="outline">Admin</Badge>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DashboardStatsCard
                    title="Total Utilizatori"
                    value={stats.totalUsers}
                    icon={Users}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                />
                <DashboardStatsCard
                    title="Terapeuți"
                    value={stats.totalTherapists}
                    icon={UserCog}
                    iconColor="text-purple-600"
                    iconBgColor="bg-purple-100"
                />
                <DashboardStatsCard
                    title="Clienți"
                    value={stats.totalClients}
                    icon={Users}
                    iconColor="text-indigo-600"
                    iconBgColor="bg-indigo-100"
                />
                <DashboardStatsCard
                    title="Business"
                    value={stats.totalBusinesses}
                    icon={Briefcase}
                    iconColor="text-slate-600"
                    iconBgColor="bg-slate-100"
                />
                <DashboardStatsCard
                    title="Aplicații Pending"
                    value={stats.pendingApplications}
                    icon={ClipboardList}
                    iconColor="text-orange-600"
                    iconBgColor="bg-orange-100"
                />
                <DashboardStatsCard
                    title="Business Apps"
                    value={stats.pendingBusinessApps}
                    icon={Building2}
                    iconColor="text-amber-600"
                    iconBgColor="bg-amber-100"
                />
                <DashboardStatsCard
                    title="Mesaje Noi"
                    value={stats.newContactMessages}
                    icon={Mail}
                    iconColor="text-pink-600"
                    iconBgColor="bg-pink-100"
                />
            </div>

            <Tabs defaultValue="applications" className="w-full">
                <TabsList className="w-fit max-w-full justify-start h-auto p-1 bg-gray-100/80 border border-gray-200 rounded-full mb-6 gap-1 overflow-x-auto no-scrollbar flex-nowrap shrink-0">
                    <TabsTrigger value="applications" className="rounded-full px-4 py-2.5 min-w-fit data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all text-gray-500 hover:text-gray-700 hover:bg-white/50">
                        Aplicații
                        <span className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full ml-2">
                            {applications.length + businessApplications.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="therapists" className="rounded-full px-4 py-2.5 min-w-fit data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all text-gray-500 hover:text-gray-700 hover:bg-white/50">
                        Terapeuți
                        <span className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full ml-2">
                            {therapists.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="users" className="rounded-full px-4 py-2.5 min-w-fit data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all text-gray-500 hover:text-gray-700 hover:bg-white/50">
                        Utilizatori
                        <span className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full ml-2">
                            {users.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="contacts" className="rounded-full px-4 py-2.5 min-w-fit data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all text-gray-500 hover:text-gray-700 hover:bg-white/50">
                        Contact
                        <span className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full ml-2">
                            {contactSubmissions.length}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="business" className="rounded-full px-4 py-2.5 min-w-fit data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all text-gray-500 hover:text-gray-700 hover:bg-white/50">
                        Business
                        <span className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full ml-2">
                            {businesses.length}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                    <TabsContent value="applications" className="mt-0 space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Aplicații Recente</h2>
                        </div>

                        {applications.length === 0 && businessApplications.length === 0 ? (
                            <DashboardEmptyState
                                icon={ClipboardList}
                                title="Nu sunt aplicații noi"
                                description="Momentan nu există cereri de înscriere de la terapeuți sau business-uri."
                            />
                        ) : (
                            <div className="space-y-8">
                                {applications.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="h-6">Terapeuți</Badge>
                                            <span className="text-sm text-muted-foreground">{applications.length} cereri</span>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {applications.map((app) => (
                                                <Card key={app.id} className="group relative overflow-hidden transition-all hover:shadow-md border-gray-100">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-lg">{app.name}</h3>
                                                                <Badge variant="secondary" className="mt-1">{app.title}</Badge>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3 text-sm">
                                                        <div className="grid grid-cols-1 gap-1 text-muted-foreground">
                                                            <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {app.email}</div>
                                                            <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {app.phone}</div>
                                                            <div className="flex items-center gap-2"><Building2 className="h-3 w-3" /> {app.location}</div>
                                                        </div>
                                                        <div className="pt-3 flex gap-2">
                                                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 h-8" onClick={() => handleApprove(app)} disabled={!!processingId}>
                                                                <Check className="h-3.5 w-3.5 mr-1.5" /> Aprobă
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="flex-1 h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleReject(app.id)} disabled={!!processingId}>
                                                                <X className="h-3.5 w-3.5 mr-1.5" /> Respinge
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {businessApplications.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="h-6">Business</Badge>
                                            <span className="text-sm text-muted-foreground">{businessApplications.length} cereri</span>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {businessApplications.map((app) => (
                                                <Card key={app.id} className="group relative overflow-hidden transition-all hover:shadow-md border-gray-100">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <Link href={`/business/${app.id}`} className="hover:underline">
                                                                    <h3 className="font-bold text-lg text-primary">{app.company_name}</h3>
                                                                </Link>
                                                                <p className="text-xs text-muted-foreground">{app.contact_email}</p>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Business</Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3 text-sm">
                                                        <p className="text-muted-foreground line-clamp-2 text-xs">{app.description}</p>
                                                        <div className="pt-3 flex gap-2">
                                                            <Button size="sm" className="flex-1 h-8" onClick={() => handleApproveBusiness(app)} disabled={!!processingId}>
                                                                <Check className="h-3.5 w-3.5 mr-1.5" /> Aprobă
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="flex-1 h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRejectBusiness(app.id)} disabled={!!processingId}>
                                                                <X className="h-3.5 w-3.5 mr-1.5" /> Respinge
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="therapists" className="mt-0 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Terapeuți ({therapists.length})</h2>
                        </div>
                        {therapists.length === 0 ? (
                            <DashboardEmptyState
                                icon={Users}
                                title="Nu există terapeuți"
                                description="Niciun terapeut nu este înregistrat momentan."
                            />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {therapists.map((therapist) => (
                                    <div key={therapist.id} className="flex flex-col p-5 border rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all gap-4">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-gray-900">{therapist.name}</h3>
                                                {therapist.verified && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 h-5 text-[10px]">VERIFICAT</Badge>}
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium">{therapist.title}</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                                                <MapPin className="h-3 w-3" /> {therapist.location}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                                            <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" asChild>
                                                <Link href={`/terapeuti/${therapist.id}`} target="_blank">
                                                    Profil Public
                                                </Link>
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteTherapist(therapist.id)} disabled={!!processingId}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="users" className="mt-0 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Utilizatori ({users.length})</h2>
                        </div>
                        {users.length === 0 ? (
                            <DashboardEmptyState icon={Users} title="Nu există utilizatori" description="Platforma nu are utilizatori înregistrați." />
                        ) : (
                            <div className="space-y-2">
                                {users.map((u) => (
                                    <div key={u.id} className="flex flex-col md:flex-row justify-between items-center p-4 border rounded-2xl hover:bg-gray-50 transition-colors gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <UserCog className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <Link href={`/admin/users/${u.id}`} className="hover:underline hover:text-primary transition-colors">
                                                    <p className="font-bold text-gray-900">{u.email}</p>
                                                </Link>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>Înregistrat: {new Date(u.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className={`capitalize font-medium ${u.role === 'admin' ? 'text-purple-600' : u.role === 'therapist' ? 'text-blue-600' : u.role === 'business' ? 'text-orange-600' : 'text-gray-600'}`}>{u.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Select defaultValue={u.role} onValueChange={(value) => handleChangeUserRole(u.id, value as "client" | "therapist" | "business" | "admin")} disabled={!!processingId}>
                                                <SelectTrigger className="w-[130px] h-9 rounded-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="client">Client</SelectItem>
                                                    <SelectItem value="therapist">Terapeut</SelectItem>
                                                    <SelectItem value="business">Business</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button size="sm" variant="ghost" className="h-9 w-9 rounded-full text-gray-400 hover:text-red-500" onClick={() => handleDeleteUser(u.id)} disabled={!!processingId || u.role === "admin"}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="contacts" className="mt-0 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Contact ({contactSubmissions.length})</h2>
                        </div>
                        {contactSubmissions.length === 0 ? (
                            <DashboardEmptyState icon={Mail} title="Nu sunt mesaje" description="Nu există mesaje noi în formularul de contact." />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {contactSubmissions.map((contact) => (
                                    <div key={contact.id} className="p-6 border rounded-3xl bg-white hover:shadow-md transition-all space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg">{contact.name}</h4>
                                                <p className="text-sm text-gray-500">{contact.email}</p>
                                            </div>
                                            <Badge variant={contact.status === "new" ? "default" : contact.status === "in_progress" ? "secondary" : "outline"} className="rounded-full">
                                                {contact.status === "new" ? "Nou" : contact.status === "in_progress" ? "În lucru" : "Rezolvat"}
                                            </Badge>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl text-sm italic text-gray-700">
                                            "{contact.message}"
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            <EmailModal recipientName={contact.name} recipientEmail={contact.email} onSend={(s, m) => handleReply(contact.id, contact.name, contact.email, s, m)} trigger={
                                                <Button size="sm" variant="outline" className="flex-1 rounded-full text-xs">Răspunde</Button>
                                            } />
                                            {contact.status !== "resolved" && (
                                                <Button size="sm" className="rounded-full text-xs" onClick={() => handleUpdateContactStatus(contact.id, "resolved")} disabled={!!processingId}>Marchează Rezolvat</Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="business" className="mt-0 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Business ({businesses.length})</h2>
                        </div>
                        {businesses.length === 0 ? (
                            <DashboardEmptyState icon={Building2} title="Nu sunt business-uri" description="Niciun cont business înregistrat." />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {businesses.map((business) => (
                                    <div key={business.id} className="p-5 border rounded-2xl hover:bg-gray-50 transition-all flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                                            {business.logo_url ? (
                                                <img src={business.logo_url} alt={business.company_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <Building2 className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <Link href={`/business/${business.id}`} className="hover:underline">
                                                <h3 className="font-bold text-primary">{business.company_name}</h3>
                                            </Link>
                                            <p className="text-sm text-gray-500">{business.contact_email}</p>
                                            <p className="text-sm mt-1"><span className="font-medium">Locație:</span> {business.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </div >
            </Tabs >
        </div >
    );
}
