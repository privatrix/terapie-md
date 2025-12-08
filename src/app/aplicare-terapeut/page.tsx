"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, ArrowLeft, Upload } from "lucide-react";

type FormData = {
    // Personal Info
    name: string;
    email: string;
    phone: string;
    location: string;

    // Professional Info
    title: string;
    specialties: string[];
    languages: string[];
    price_range: string;

    // Qualifications
    education: Array<{ degree: string; institution: string; year: string }>;
    experience_years: string;
    license_number: string;

    // Profile
    bio: string;
    availability: string;

    // Files
    profile_image?: File;
    credentials?: File[];
};

const SPECIALTIES_OPTIONS = [
    "Anxietate",
    "Depresie",
    "Stres",
    "Relații",
    "Traumă",
    "Burnout",
    "Tulburări de somn",
    "Tulburări alimentare",
    "Dependențe",
    "Dezvoltare personală",
    "Consiliere de cuplu",
    "Adolescenți",
    "Copii",
    "PTSD",
    "OCD",
    "Fobii",
];

const LANGUAGES_OPTIONS = ["Română", "Rusă", "Engleză", "Franceză", "Italiană"];

export default function TherapistApplicationPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        specialties: [],
        languages: ["Română"],
        price_range: "",
        education: [{ degree: "", institution: "", year: "" }],
        experience_years: "",
        license_number: "",
        bio: "",
        availability: "",
    });

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: "specialties" | "languages", item: string) => {
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
                return !!(
                    formData.name &&
                    formData.email &&
                    formData.phone &&
                    formData.location
                );
            case 2:
                return !!(
                    formData.title &&
                    formData.specialties.length > 0 &&
                    formData.price_range
                );
            case 3:
                return !!(
                    formData.education.some((e) => e.degree && e.institution) &&
                    formData.license_number &&
                    formData.experience_years
                );
            case 4:
                return !!(formData.bio && formData.availability);
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setError("");
            setStep(step + 1);
        } else {
            setError("Te rugăm să completezi toate câmpurile obligatorii");
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        if (!validateStep(4)) {
            setError("Te rugăm să completezi toate câmpurile");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Check if Supabase is configured
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                // Simulate submission for demo
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setSubmitted(true);
                return;
            }

            const supabase = createClient();

            // First, create user account (they'll need to sign up separately or we link it)
            // For now, just submit the application to a pending_applications table
            const { error: submitError } = await supabase
                .from("therapist_applications")
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        location: formData.location,
                        title: formData.title,
                        specialties: formData.specialties,
                        languages: formData.languages,
                        price_range: formData.price_range,
                        education: formData.education,
                        experience_years: formData.experience_years,
                        license_number: formData.license_number,
                        bio: formData.bio,
                        availability: formData.availability,
                        status: "pending",
                    },
                ]);

            if (submitError) throw submitError;

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || "A apărut o eroare la trimiterea aplicației");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-2xl">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="font-heading text-3xl font-bold">Aplicație trimisă cu succes!</h1>
                    <p className="text-muted-foreground text-lg">
                        Mulțumim pentru aplicație, <strong>{formData.name}</strong>!
                    </p>
                    <div className="bg-muted/50 rounded-lg p-6 text-left space-y-3">
                        <h3 className="font-semibold">Ce urmează?</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>Echipa noastră va revizui aplicația ta în maximum 3-5 zile lucrătoare</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>Vom verifica credențialele și licența ta profesională</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>Vei primi un email de confirmare la <strong>{formData.email}</strong></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>După aprobare, vei primi instrucțiuni pentru crearea contului</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button asChild>
                            <a href="/">Înapoi la pagina principală</a>
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="/terapeuti">Vezi terapeuți</a>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
            <div className="mb-8 text-center space-y-2">
                <h1 className="font-heading text-3xl font-bold md:text-4xl">
                    Aplică ca Terapeut
                </h1>
                <p className="text-muted-foreground">
                    Completează formularul pentru a te alătura platformei Terapie.md
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center flex-1">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${s <= step
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 4 && (
                                <div
                                    className={`flex-1 h-1 mx-2 transition-colors ${s < step ? "bg-primary" : "bg-muted"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Date personale</span>
                    <span>Specializare</span>
                    <span>Calificări</span>
                    <span>Profil</span>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="rounded-xl border bg-card p-6 md:p-8 shadow-sm">
                {/* Step 1: Personal Information */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-heading text-2xl font-bold mb-1">Date Personale</h2>
                            <p className="text-sm text-muted-foreground">
                                Informații de bază despre tine
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nume complet *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateFormData("name", e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Dr. Ion Popescu"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateFormData("email", e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="email@exemplu.md"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefon *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateFormData("phone", e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="+373 69 123 456"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Locație *</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => updateFormData("location", e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Chișinău, Centru"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Professional Info */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-heading text-2xl font-bold mb-1">Informații Profesionale</h2>
                            <p className="text-sm text-muted-foreground">
                                Specializarea și serviciile tale
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Titlu profesional *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => updateFormData("title", e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Psiholog Clinician, Psihoterapeut, etc."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Specializări * (selectează minim 1)</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {SPECIALTIES_OPTIONS.map((specialty) => (
                                        <label
                                            key={specialty}
                                            className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted/50 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.specialties.includes(specialty)}
                                                onChange={() => toggleArrayItem("specialties", specialty)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">{specialty}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Limbi vorbite *</label>
                                <div className="flex flex-wrap gap-2">
                                    {LANGUAGES_OPTIONS.map((lang) => (
                                        <label
                                            key={lang}
                                            className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted/50 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.languages.includes(lang)}
                                                onChange={() => toggleArrayItem("languages", lang)}
                                                className="rounded"
                                            />
                                            <span className="text-sm">{lang}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Interval de prețuri *</label>
                                <input
                                    type="text"
                                    value={formData.price_range}
                                    onChange={(e) => updateFormData("price_range", e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="500 - 700 MDL"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Qualifications */}
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
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="Diplomă/Grad"
                                        />
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
                                                onChange={(e) => updateEducation(index, "year", e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                placeholder="An"
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
                                    <label className="text-sm font-medium">Număr licență *</label>
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
                                        onChange={(e) => updateFormData("experience_years", e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="ex: 5+ ani"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Profile Details */}
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
                                <textarea
                                    value={formData.availability}
                                    onChange={(e) => updateFormData("availability", e.target.value)}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="ex: Luni-Vineri, 09:00-17:00. Sesiuni online sau la cabinet."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
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
        </div>
    );
}
