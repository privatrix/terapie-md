"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ArrowLeft,
    User,
    Mail,
    Calendar,
    CreditCard,
    Activity,
    Shield,
    Ban,
    KeyRound,
    Trash2,
    RefreshCcw,
    Lock,
    Unlock,
    MessageSquare,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AdminUserDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>({
        totalBookings: 0,
        totalSpend: 0,
        reviewscount: 0,
        lastActive: "N/A"
    });
    const [bookings, setBookings] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminNote, setAdminNote] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            const supabase = createClient();

            try {
                // 1. Verify Admin Status (Mock or Actual)
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push("/auth/login");
                    return;
                }

                // 2. Fetch User Data
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (userError || !userData) {
                    console.error("Error fetching user:", userError);
                    alert("User not found or access denied.");
                    return;
                }
                setUser(userData);

                // 2.1 Fetch Business Profile if user is business
                if (userData.role === 'business') {
                    const { data: businessData } = await supabase
                        .from("business_profiles")
                        .select("*")
                        .eq("user_id", id)
                        .single();

                    if (businessData) {
                        setUser((prev: any) => ({ ...prev, business_profile: businessData }));
                    }
                }

                // 3. Fetch Bookings (Active & History)
                const { data: bookingsData } = await supabase
                    .from("bookings")
                    .select("*, therapist:therapist_profiles(name), business:business_profiles(company_name)")
                    .eq("client_id", id)
                    .order("created_at", { ascending: false });

                setBookings(bookingsData || []);

                // Calculate Stats
                const totalSpend = bookingsData?.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0) || 0;
                const completedBookings = bookingsData?.filter(b => b.status === 'completed').length || 0;

                // 4. Fetch Reviews
                const { data: reviewsData } = await supabase
                    .from("reviews")
                    .select("*")
                    .eq("client_id", id);

                setReviews(reviewsData || []);

                setStats({
                    totalBookings: bookingsData?.length || 0,
                    completedBookings,
                    totalSpend,
                    reviewsCount: reviewsData?.length || 0,
                    lastActive: bookingsData?.[0]?.created_at ? new Date(bookingsData[0].created_at).toLocaleDateString() : "Never"
                });

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    const handleAction = async (action: string) => {
        if (!confirm(`Are you sure you want to perform: ${action}?`)) return;
        setProcessing(true);
        // Mock actions for now - properly implementing these requires Edge Functions usually
        setTimeout(() => {
            alert(`Action '${action}' executed successfully (Simulation).`);
            setProcessing(false);
        }, 1000);
    };

    const handleRoleChange = async (newRole: string) => {
        if (!confirm(`Change user role to ${newRole}? This has significant security implications.`)) return;
        setProcessing(true);
        const supabase = createClient();

        try {
            const { error } = await supabase.from('users').update({ role: newRole }).eq('id', id);
            if (error) throw error;
            setUser({ ...user, role: newRole });
            alert("Role updated successfully.");
        } catch (error: any) {
            alert(`Error updating role: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <div className="p-8">User not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Administrare Utilizator</h1>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                </div>

                {/* Hero Card */}
                <div className="overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 relative">

                    <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-gray-50 shadow-xl shrink-0">
                            <AvatarImage src={user.business_profile?.logo_url || user.avatar_url} />
                            <AvatarFallback className="text-xl md:text-2xl bg-primary/10 text-primary font-bold">
                                {(user.business_profile?.company_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left space-y-4 w-full">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 break-all">
                                    {user.business_profile?.company_name || user.email}
                                </h2>
                                {user.business_profile?.company_name && (
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                )}
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                                    <Badge variant="outline" className={`text-sm px-3 py-1 uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        user.role === 'therapist' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            user.role === 'business' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.role}
                                    </Badge>
                                    <Badge variant="secondary" className="text-sm px-3 py-1 font-normal bg-gray-100 text-gray-600">
                                        Joined: {new Date(user.created_at).toLocaleDateString()}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 pt-2">
                                <div className="p-3 md:p-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-center md:text-left hover:bg-gray-50 transition-colors">
                                    <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Total Cheltuit</div>
                                    <div className="text-xl md:text-2xl font-black text-gray-900">{stats.totalSpend} <span className="text-sm font-normal text-muted-foreground">MDL</span></div>
                                </div>
                                <div className="p-3 md:p-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-center md:text-left hover:bg-gray-50 transition-colors">
                                    <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Bookings</div>
                                    <div className="text-xl md:text-2xl font-black text-gray-900">{stats.totalBookings}</div>
                                </div>
                                <div className="p-3 md:p-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-center md:text-left hover:bg-gray-50 transition-colors">
                                    <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Recenzii</div>
                                    <div className="text-xl md:text-2xl font-black text-gray-900">{stats.reviewsCount}</div>
                                </div>
                                <div className="p-3 md:p-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-center md:text-left hover:bg-gray-50 transition-colors">
                                    <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Ultima Activitate</div>
                                    <div className="text-lg md:text-xl font-bold text-gray-900">{stats.lastActive}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs & Tools */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Data */}
                    <div className="lg:col-span-2 space-y-8">
                        <Tabs defaultValue="activity" className="w-full">
                            <TabsList className="w-fit max-w-full justify-start h-auto p-1 bg-gray-100/80 border border-gray-200 rounded-full mb-6 gap-1 overflow-x-auto no-scrollbar flex-nowrap shrink-0">
                                <TabsTrigger value="activity" className="rounded-full px-4 py-2.5 min-w-fit data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all text-gray-500 hover:text-gray-700 hover:bg-white/50">Activitate</TabsTrigger>
                                <TabsTrigger value="details" className="rounded-full px-4 py-2.5 min-w-fit data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all text-gray-500 hover:text-gray-700 hover:bg-white/50">Detalii Cont</TabsTrigger>
                            </TabsList>

                            <TabsContent value="activity">
                                <Card className="border-none shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Istoric Rezervări</CardTitle>
                                        <CardDescription>Toate programările efectuate de acest utilizator.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {bookings.length === 0 ? (
                                            <div className="text-center py-12 text-muted-foreground">Nu există rezervări.</div>
                                        ) : (
                                            <div className="space-y-4">
                                                {bookings.map((booking) => (
                                                    <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                                    'bg-blue-100 text-blue-600'
                                                                }`}>
                                                                <Calendar className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {booking.therapist?.name || booking.business?.company_name || 'Provider'}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {new Date(booking.date).toLocaleDateString()} at {booking.time} • {booking.price} MDL
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge variant={
                                                            booking.status === 'completed' ? 'default' :
                                                                booking.status === 'cancelled' ? 'destructive' : 'outline'
                                                        }>
                                                            {booking.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="details">
                                <Card className="border-none shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Raw Data</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-xl overflow-x-auto text-xs">
                                            {JSON.stringify(user, null, 2)}
                                        </pre>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column: Admin Tools */}
                    <div className="space-y-6">
                        <Card className="border-red-100 bg-red-50/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-700">
                                    <Shield className="h-5 w-5" />
                                    Security Zone
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-red-900">Force Role Change</label>
                                    <Select defaultValue={user.role} onValueChange={handleRoleChange} disabled={processing}>
                                        <SelectTrigger className="bg-white border-red-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="client">Client</SelectItem>
                                            <SelectItem value="therapist">Terapeut</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100 border-red-200 bg-white"
                                    onClick={() => handleAction("Reset Password")}
                                    disabled={processing}
                                >
                                    <KeyRound className="h-4 w-4 mr-2" />
                                    Send Password Reset
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100 border-red-200 bg-white"
                                    onClick={() => handleAction("Sign Out User")}
                                    disabled={processing}
                                >
                                    <LogOutIcon className="h-4 w-4 mr-2" />
                                    Force Sign Out
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Admin Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Private notes about this user..."
                                    className="min-h-[100px] resize-none"
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                />
                                <Button className="w-full" size="sm" onClick={() => handleAction("Save Notes")} disabled={processing}>
                                    Save Note
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="pt-8 text-center text-xs text-muted-foreground">
                            <div className="flex justify-center gap-4 opacity-50">
                                <span>ID: {user.id}</span>
                                <span>•</span>
                                <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LogOutIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    )
}
