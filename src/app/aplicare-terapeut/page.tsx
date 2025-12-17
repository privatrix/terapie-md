"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CITIES, THERAPIST_APPROACHES, THERAPIST_SPECIALIZATIONS, THERAPIST_SPECIALTIES } from "@/lib/constants";

type FormData = {
    // Personal Info
    name: string;
    email: string;
    phone: string;
    location: string;

    // Professional Info
    specializations: string[];
    intervention_areas: string[];
    therapeutic_approaches: string[];
    languages: string[];
    priceMin: string;
    priceMax: string;
    medical_code?: string;

    // Qualifications
    education: Array<{ degree: string; institution: string; year: string }>;
    experience_years: string;
    license_number: string;
    bio: string;
    availability: string;
    profile_image?: File;
    credentials?: File[];
};

const LANGUAGES_OPTIONS = ["Română", "Rusă", "Engleză", "Franceză", "Italiană"];

const EDUCATION_LEVELS = [
    "Licență",
    "Master",
    "Doctorat",
    "Rezidențiat",
    "Formare în Psihoterapie",
    "Cursuri de Specializare",
    "Altul"
];

export default function TherapistApplicationPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [authChecking, setAuthChecking] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setAuthChecking(false);
            }
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
            setAuthChecking(false);
        });

        // Load draft
        const savedDraft = localStorage.getItem("therapist_application_draft");
        const savedSchedule = localStorage.getItem("therapist_application_schedule");

        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setFormData(parsed);
                if (savedSchedule) {
                    setSchedule(JSON.parse(savedSchedule));
                }
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
        return () => subscription.unsubscribe();
    }, []);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        location: "",
        specializations: [],
        intervention_areas: [],
        therapeutic_approaches: [],
        medical_code: "",
        languages: ["Română"],
        priceMin: "",
        priceMax: "",
        education: [{ degree: "", institution: "", year: "" }],
        experience_years: "",
        license_number: "",
        bio: "",
        availability: "",
    });

    const [schedule, setSchedule] = useState([
        { day: "Luni", active: true, start: "09:00", end: "17:00" },
        { day: "Marți", active: true, start: "09:00", end: "17:00" },
        { day: "Miercuri", active: true, start: "09:00", end: "17:00" },
        { day: "Joi", active: true, start: "09:00", end: "17:00" },
        { day: "Vineri", active: true, start: "09:00", end: "17:00" },
        { day: "Sâmbătă", active: false, start: "10:00", end: "14:00" },
        { day: "Duminică", active: false, start: "10:00", end: "14:00" },
    ]);

    useEffect(() => {
        const availabilityString = schedule
            .filter(d => d.active)
            .map(d => `${d.day}: ${d.start}-${d.end}`)
            .join("; ");
        updateFormData("availability", availabilityString);
    }, [schedule]);

    const updateSchedule = (index: number, field: string, value: any) => {
        const newSchedule = [...schedule];
        // @ts-ignore
        newSchedule[index][field] = value;
        setSchedule(newSchedule);
    };

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: "specializations" | "intervention_areas" | "languages" | "therapeutic_approaches", item: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].includes(item)
                ? prev[field].filter((i) => i !== item)
                : [...prev[field], item],
        }));
    };

    const addEducation = () => {
        setFormData((prev) => ({
            ...prev,
            education: [...prev.education, { degree: "", institution: "", year: "" }],
        }));
    };

    const updateEducation = (index: number, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            ),
        }));
    };

    const removeEducation = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index),
        }));
    };

    const validateStep = (currentStep: number): boolean => {
        switch (currentStep) {
            case 1:
                return !!(formData.name && formData.email && formData.phone && formData.location);
            case 2:
                const isPsychiatrist = formData.specializations.includes("Psihiatru");
                return !!(
                    formData.specializations.length > 0 &&
                    formData.intervention_areas.length > 0 &&
                    formData.therapeutic_approaches.length > 0 &&
                    formData.priceMin &&
                    formData.priceMax &&
                    (!isPsychiatrist || formData.medical_code)
                );
            case 3:
                return !!(formData.education.some((e) => e.degree && e.institution) && formData.experience_years);
            case 4:
                return !!(formData.bio && formData.availability);
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(step)) setStep(step + 1);
        else setError("Te rugăm să completezi toate câmpurile obligatorii");
    };
    const prevStep = () => setStep(step - 1);

    const submitApplication = async (currentUser: any) => {
        setLoading(true);
        setError("");
        try {
            const supabase = createClient();
            const allSpecialties = [...formData.intervention_areas, ...formData.therapeutic_approaches];
            const { error: submitError } = await supabase.from("therapist_applications").insert([{
                user_id: currentUser?.id || null,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                title: formData.specializations.join(", "),
                specialties: allSpecialties,
                specializations: formData.specializations,
                medical_code: formData.medical_code,
                languages: formData.languages,
                price_range: `${formData.priceMin} - ${formData.priceMax} MDL`,
                education: formData.education,
                experience_years: formData.experience_years,
                license_number: formData.license_number,
                bio: formData.bio,
                availability: formData.availability,
                status: "pending",
            }]);
            if (submitError) throw submitError;
            localStorage.removeItem("therapist_application_draft");
            localStorage.removeItem("therapist_application_schedule");
            localStorage.removeItem("therapist_application_pending");
            setSubmitted(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Eroare la trimitere");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) {
            setError("Te rugăm să completezi toate câmpurile");
            return;
        }
        submitApplication(user);
    };

    useEffect(() => {
        const isPending = localStorage.getItem("therapist_application_pending");
        if (!authChecking && user && isPending && formData.name) {
            submitApplication(user);
        }
    }, [authChecking, user, formData]);

    if (authChecking) {
        return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-2xl">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center"><CheckCircle className="w-10 h-10" /></div>
                    <h1 className="font-heading text-3xl font-bold">Aplicație trimisă cu succes!</h1>
                    <p className="text-muted-foreground text-lg">Mulțumim, <strong>{formData.name}</strong>!</p>
                    <div className="flex justify-center pt-4"><Button asChild><a href="/">Înapoi</a></Button></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
            <div className="mb-8 text-center space-y-2">
                <h1 className="font-heading text-3xl font-bold md:text-4xl">Aplică ca Terapeut</h1>
                <p className="text-muted-foreground">Completează formularul pentru a te alătura platformei Terapie.md</p>
            </div>
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</div>
                            {s < 4 && <div className={`flex-1 h-1 mx-2 transition-colors ${s < step ? "bg-primary" : "bg-muted"}`} />}
                        </div>
                    ))}
                </div>
            </div>
            {error && <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">{error}</div>}

            <div className="rounded-xl border bg-card p-6 md:p-8 shadow-sm">

                {step === 1 && (
                    <div className="space-y-6">
                        <div><h2 className="font-heading text-2xl font-bold mb-1">Date Personale</h2></div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nume complet *</label>
                                <input type="text" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email *</label>
                                <input type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefon *</label>
                                <input type="tel" value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Locație *</label>
                                <Select value={formData.location} onValueChange={(value) => updateFormData("location", value)}>
                                    <SelectTrigger><SelectValue placeholder="Selectează" /></SelectTrigger>
                                    <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div><h2 className="font-heading text-2xl font-bold mb-1">Informații Profesionale</h2></div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Calificare Profesională *</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {THERAPIST_SPECIALIZATIONS.map((role) => (
                                        <label key={role} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer border-input hover:bg-muted/50`}>
                                            <input type="checkbox" checked={formData.specializations.includes(role)} onChange={() => toggleArrayItem("specializations", role)} className="w-4 h-4" />
                                            <span className="text-sm font-medium">{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {formData.specializations.includes("Psihiatru") && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cod Parafă Medicală *</label>
                                    <input type="text" value={formData.medical_code || ""} onChange={(e) => updateFormData("medical_code", e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Arii de intervenție (Probleme tratate) *</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {THERAPIST_SPECIALTIES.map((item) => (
                                        <label key={item} className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted/50">
                                            <input type="checkbox" checked={formData.intervention_areas.includes(item)} onChange={() => toggleArrayItem("intervention_areas", item)} className="rounded" />
                                            <span className="text-sm">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Abordare Terapeutică (Metode) *</label>
                                <p className="text-xs text-muted-foreground mb-2">Selectați cel puțin o metodă de lucru.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {THERAPIST_APPROACHES.map((item) => (
                                        <label
                                            key={item}
                                            className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${formData.therapeutic_approaches.includes(item) ? "bg-primary/5 border-primary" : "hover:bg-muted/50"}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.therapeutic_approaches.includes(item)}
                                                onChange={() => toggleArrayItem("therapeutic_approaches", item)}
                                                className="rounded text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Limbi vorbite *</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {LANGUAGES_OPTIONS.map((lang) => (
                                        <label key={lang} className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted/50">
                                            <input type="checkbox" checked={formData.languages.includes(lang)} onChange={() => toggleArrayItem("languages", lang)} className="rounded" />
                                            <span className="text-sm">{lang}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Preț per ședință (MDL) *</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="number"
                                            value={formData.priceMin}
                                            onChange={(e) => updateFormData("priceMin", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="Min (ex: 400)"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            value={formData.priceMax}
                                            onChange={(e) => updateFormData("priceMax", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="Max (ex: 600)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-heading text-2xl font-bold mb-1">Calificări și Experiență</h2>
                            <p className="text-sm text-muted-foreground">
                                Educația și credențialele tale profesionale
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Educație *</label>
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="grid gap-3 md:grid-cols-3 p-4 border rounded-lg">
                                        <Select
                                            value={edu.degree}
                                            onValueChange={(value) => updateEducation(index, "degree", value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Diplomă/Grad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EDUCATION_LEVELS.map((level) => (
                                                    <SelectItem key={level} value={level}>
                                                        {level}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="Instituție"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={edu.year}
                                                onChange={(e) => updateEducation(index, "year", e.target.value.replace(/[^0-9]/g, ""))}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                placeholder="An"
                                                maxLength={4}
                                            />
                                            {formData.education.length > 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => removeEducation(index)}
                                                >
                                                    ×
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={addEducation}>
                                    + Adaugă educație
                                </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Număr licență (Opțional)</label>
                                    <input
                                        type="text"
                                        value={formData.license_number}
                                        onChange={(e) => updateFormData("license_number", e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Nr. licență profesională"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ani de experiență *</label>
                                    <input
                                        type="text"
                                        value={formData.experience_years}
                                        onChange={(e) => updateFormData("experience_years", e.target.value.replace(/[^0-9]/g, ""))}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="ex: 5"
                                        maxLength={2}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-heading text-2xl font-bold mb-1">Profil și Disponibilitate</h2>
                            <p className="text-sm text-muted-foreground">
                                Informații care vor fi afișate pe profilul tău public
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Biografie *</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => updateFormData("bio", e.target.value)}
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Scrie o scurtă descriere despre tine, abordarea ta terapeutică și experiența ta..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum 100 carattere. Aceasta va fi afișată pe profilul tău public.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Disponibilitate *</label>
                                <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                                    {schedule.map((day, index) => (
                                        <div key={day.day} className="flex items-center justify-between py-2 border-b last:border-0 border-border/50">
                                            <div className="flex items-center space-x-3">
                                                <Switch
                                                    checked={day.active}
                                                    onCheckedChange={(checked) => updateSchedule(index, "active", checked)}
                                                />
                                                <span className={`text-sm ${day.active ? "font-medium" : "text-muted-foreground"}`}>
                                                    {day.day}
                                                </span>
                                            </div>
                                            {day.active ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={day.start}
                                                        onChange={(e) => updateSchedule(index, "start", e.target.value)}
                                                        className="h-8 rounded border border-input bg-background px-2 text-xs"
                                                    />
                                                    <span className="text-muted-foreground">-</span>
                                                    <input
                                                        type="time"
                                                        value={day.end}
                                                        onChange={(e) => updateSchedule(index, "end", e.target.value)}
                                                        className="h-8 rounded border border-input bg-background px-2 text-xs"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Indisponibil</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Acest progran va fi afișat pe profilul tău. Poți modifica aceste ore ulterior din dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-6 mt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={step === 1}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Înapoi
                    </Button>

                    {step < 4 ? (
                        <Button onClick={nextStep} className="gap-2">
                            Continuă
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="gap-2">
                            {loading ? "Se trimite..." : "Trimite aplicația"}
                            <CheckCircle className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div >
    );
}
