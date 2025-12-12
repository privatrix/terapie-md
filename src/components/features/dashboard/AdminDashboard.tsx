"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, FileText, Trash2, Users, UserCog, ClipboardList, BarChart3, Mail, Briefcase, Building2, Phone, MapPin, CheckCircle2, XCircle, Eye, ExternalLink } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardTabsList, DashboardTabsTrigger } from "@/components/dashboard/DashboardTabs";
import { EmailModal } from "@/components/features/admin/EmailModal";
import Link from "next/link"; // Ensure Link is imported
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner"; // Removed as not found

export function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTherapists: 0,
        totalClients: 0,
        totalBusinesses: 0,
        pendingApplications: 0,
        pendingBusinessApps: 0,
        newContactMessages: 0
    });
    const [applications, setApplications] = useState<any[]>([]); // Using any for recovery speed
    const [businessApplications, setBusinessApplications] = useState<any[]>([]);
    const [therapists, setTherapists] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const supabase = createClient();

    const fetchData = async () => {
        try {
            // Fetch Users with Profiles
            const { data: usersData, error: usersError } = await supabase.from('profiles').select('*');
            if (usersData) {
                setUsers(usersData);
                const roleCounts = usersData.reduce((acc: any, user: any) => {
                    acc[user.role] = (acc[user.role] || 0) + 1;
                    return acc;
                }, {});
                setStats(prev => ({
                    ...prev,
                    totalUsers: usersData.length,
                    totalTherapists: roleCounts.therapist || 0,
                    totalClients: roleCounts.client || 0,
                    totalBusinesses: roleCounts.business || 0
                }));
            }

            // Fetch Therapist Applications (Mock logic: Assuming is_verified=false means pending)
            // In a real app, we'd join with profiles. For now, we'll assume we can get them.
            // Simplified for restoration:
            const { data: apps } = await supabase.from('therapist_profiles').select('*, profiles(email, phone)').eq('is_verified', false);
            if (apps) {
                const formattedApps = apps.map(app => ({
                    ...app,
                    email: app.profiles?.email,
                    phone: app.profiles?.phone
                }));
                setApplications(formattedApps);
                setStats(prev => ({ ...prev, pendingApplications: formattedApps.length }));
            }

            // Fetch Business Applications
            const { data: bApps } = await supabase.from('business_profiles').select('*').eq('is_verified', false);
            if (bApps) {
                setBusinessApplications(bApps);
                setStats(prev => ({ ...prev, pendingBusinessApps: bApps.length }));
            }

            // Fetch Verified Therapists
            const { data: thers } = await supabase.from('therapist_profiles').select('*, profiles(*)').eq('is_verified', true);
            if (thers) setTherapists(thers);

            // Fetch Verified Businesses
            const { data: bus } = await supabase.from('business_profiles').select('*').eq('is_verified', true);
            if (bus) setBusinesses(bus);

            // Fetch Contacts
            const { data: contacts } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
            if (contacts) {
                setContactSubmissions(contacts);
                setStats(prev => ({ ...prev, newContactMessages: contacts.filter(c => c.status === 'new').length }));
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (app: any) => {
        setProcessingId(app.id);
        await supabase.from('therapist_profiles').update({ is_verified: true }).eq('id', app.id);
        await supabase.from('profiles').update({ role: 'therapist' }).eq('id', app.id); // Ensure role is set
        await fetchData();
        setProcessingId(null);
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        await supabase.from('therapist_profiles').delete().eq('id', id);
        await fetchData();
        setProcessingId(null);
    };

    const handleApproveBusiness = async (app: any) => {
        setProcessingId(app.id);
        await supabase.from('business_profiles').update({ is_verified: true }).eq('id', app.id);
        await supabase.from('profiles').update({ role: 'business' }).eq('id', app.owner_id); // Assuming owner_id exists
        await fetchData();
        setProcessingId(null);
    };

    const handleRejectBusiness = async (id: string) => {
        setProcessingId(id);
        await supabase.from('business_profiles').delete().eq('id', id);
        await fetchData();
        setProcessingId(null);
    };

    const handleDeleteTherapist = async (id: string) => {
        setProcessingId(id);
        await supabase.from('therapist_profiles').delete().eq('id', id);
        await fetchData();
        setProcessingId(null);
    };

    const handleDeleteUser = async (id: string) => {
        setProcessingId(id);
        // Delete profile (cascades usually)
        await supabase.from('profiles').delete().eq('id', id);
        await fetchData();
        setProcessingId(null);
    };

    const handleChangeUserRole = async (id: string, role: string) => {
        setProcessingId(id);
        await supabase.from('profiles').update({ role }).eq('id', id);
        await fetchData();
        setProcessingId(null);
    };

    const handleUpdateContactStatus = async (id: string, status: string) => {
        setProcessingId(id);
        await supabase.from('contact_submissions').update({ status }).eq('id', id);
        await fetchData();
        setProcessingId(null);
    };

    const handleReply = async (id: string, name: string, email: string, subject: string, message: string) => {
        // Mock email sending
        console.log(`Sending email to ${email}: ${subject} - ${message}`);
        await handleUpdateContactStatus(id, 'resolved');
        alert(`Răspuns trimis către ${name}`);
    };

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <DashboardStatsCard
                    title="Total Utilizatori"
                    value={stats.totalUsers}
                    icon={Users}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-50"
                />
                <DashboardStatsCard
                    title="Terapeuți"
                    value={stats.totalTherapists}
                    icon={UserCog}
                    iconColor="text-purple-600"
                    iconBgColor="bg-purple-50"
                />
                <DashboardStatsCard
                    title="Clienți"
                    value={stats.totalClients}
                    icon={Users}
                    iconColor="text-indigo-600"
                    iconBgColor="bg-indigo-50"
                />
                <DashboardStatsCard
                    title="Business"
                    value={stats.totalBusinesses}
                    icon={Briefcase}
                    iconColor="text-slate-600"
                    iconBgColor="bg-slate-50"
                />
                <DashboardStatsCard
                    title="Aplicații Pending"
                    value={stats.pendingApplications}
                    icon={ClipboardList}
                    iconColor="text-orange-600"
                    iconBgColor="bg-orange-50"
                />
                <DashboardStatsCard
                    title="Business Apps"
                    value={stats.pendingBusinessApps}
                    icon={Building2}
                    iconColor="text-amber-600"
                    iconBgColor="bg-amber-50"
                />
                <DashboardStatsCard
                    title="Mesaje Noi"
                    value={stats.newContactMessages}
                    icon={Mail}
                    iconColor="text-pink-600"
                    iconBgColor="bg-pink-50"
                />
            </div>

            <Tabs defaultValue="applications" className="w-full">
                <DashboardTabsList className="mb-6">
                    <DashboardTabsTrigger value="applications">
                        Aplicații
                        <span className="ml-2 bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full">
                            {applications.length + businessApplications.length}
                        </span>
                    </DashboardTabsTrigger>
                    <DashboardTabsTrigger value="therapists">
                        Terapeuți
                        <span className="ml-2 bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full">
                            {therapists.length}
                        </span>
                    </DashboardTabsTrigger>
                    <DashboardTabsTrigger value="users">
                        Utilizatori
                        <span className="ml-2 bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full">
                            {users.length}
                        </span>
                    </DashboardTabsTrigger>
                    <DashboardTabsTrigger value="contacts">
                        Contact
                        <span className="ml-2 bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full">
                            {contactSubmissions.length}
                        </span>
                    </DashboardTabsTrigger>
                    <DashboardTabsTrigger value="business">
                        Business
                        <span className="ml-2 bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full">
                            {businesses.length}
                        </span>
                    </DashboardTabsTrigger>
                </DashboardTabsList>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                    <TabsContent value="applications" className="mt-0 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
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
                                                <Card key={app.id} className="group relative overflow-hidden transition-all hover:shadow-md border-gray-100 bg-white rounded-2xl shadow-sm">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-lg text-gray-900">{app.name}</h3>
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                                    <div key={therapist.id} className="flex flex-col p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all gap-4">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-gray-900">{therapist.name}</h3>
                                                {therapist.verified && <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 h-5 text-[10px] border-blue-100">VERIFICAT</Badge>}
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium">{therapist.title}</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                                                <MapPin className="h-3 w-3" /> {therapist.location}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 border-t border-gray-50 mt-2">
                                            <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs hover:bg-gray-50" asChild>
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-2xl font-bold text-gray-900">Utilizatori ({users.length})</h2>
                        </div>
                        {users.length === 0 ? (
                            <DashboardEmptyState icon={Users} title="Nu există utilizatori" description="Platforma nu are utilizatori înregistrați." />
                        ) : (
                            <div className="space-y-3">
                                {users.map((u) => (
                                    <div key={u.id} className="flex flex-col md:flex-row justify-between items-center p-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
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
                                                <SelectTrigger className="w-[130px] h-9 rounded-full border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="client">Client</SelectItem>
                                                    <SelectItem value="therapist">Terapeut</SelectItem>
                                                    <SelectItem value="business">Business</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button size="sm" variant="ghost" className="h-9 w-9 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDeleteUser(u.id)} disabled={!!processingId || u.role === "admin"}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="contacts" className="mt-0 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-2xl font-bold text-gray-900">Contact ({contactSubmissions.length})</h2>
                        </div>
                        {contactSubmissions.length === 0 ? (
                            <DashboardEmptyState icon={Mail} title="Nu sunt mesaje" description="Nu există mesaje noi în formularul de contact." />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {contactSubmissions.map((contact) => (
                                    <div key={contact.id} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">{contact.name}</h4>
                                                <p className="text-sm text-gray-500">{contact.email}</p>
                                            </div>
                                            <Badge variant={contact.status === "new" ? "default" : contact.status === "in_progress" ? "secondary" : "outline"} className="rounded-full">
                                                {contact.status === "new" ? "Nou" : contact.status === "in_progress" ? "În lucru" : "Rezolvat"}
                                            </Badge>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl text-sm italic text-gray-700 border border-gray-100">
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-2xl font-bold text-gray-900">Business ({businesses.length})</h2>
                        </div>
                        {businesses.length === 0 ? (
                            <DashboardEmptyState icon={Building2} title="Nu sunt business-uri" description="Niciun cont business înregistrat." />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {businesses.map((business) => (
                                    <div key={business.id} className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
                                            {business.logo_url ? (
                                                <img src={business.logo_url} alt={business.company_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <Building2 className="h-6 w-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <Link href={`/business/${business.id}`} className="hover:underline">
                                                <h3 className="font-bold text-gray-900">{business.company_name}</h3>
                                            </Link>
                                            <p className="text-sm text-gray-500">{business.contact_email}</p>
                                            <p className="text-sm mt-1 text-gray-600"><span className="font-medium text-gray-900">Locație:</span> {business.location}</p>
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
