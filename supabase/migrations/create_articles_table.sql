-- Create articles table for the blog
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL, -- Markdown content
    image_url TEXT,
    author_name TEXT DEFAULT 'Echipa Terapie.md',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create Policy: Everyone can view articles
CREATE POLICY "Public articles are viewable by everyone" ON public.articles
    FOR SELECT USING (true);

-- Create Policy: Only admins/service role can insert/update/delete (Simplified for now as open/service-role managed)
CREATE POLICY "Service role manages articles" ON public.articles
    FOR ALL USING (auth.role() = 'service_role');

-- Seed Data (Professional Blog Content)
INSERT INTO public.articles (title, slug, excerpt, content, image_url, tags, published_at, author_name)
VALUES
(
    'Cum să alegi terapeutul potrivit pentru tine?',
    'cum-sa-alegi-terapeutul-potrivit',
    'Găsirea specialistului potrivit este primul pas spre vindecare. Află ce întrebări să pui și la ce să fii atent.',
    '# Cum să alegi terapeutul potrivit?\n\nAlegerea unui psihoterapeut este o decizie personală și importantă. Nu există un "cel mai bun" terapeut universal, ci doar cel mai potrivit pentru nevoile tale.\n\n## 1. Identifică nevoile tale\nÎnainte de a căuta, gândește-te la ce vrei să obții. Ești stresat de muncă? Ai probleme în relație? Te confrunți cu anxietate?\n\n## 2. Verifică specializarea\nUnii terapeuți sunt specializați în Terapie Cognitiv-Comportamentală (CBT), alții în Psihanaliză sau Terapie de Cuplu. Pe Terapie.md poți filtra rezultatele în funcție de aceste specializări.\n\n## 3. Chimia este esențială\nStudiile arată că relația terapeutică este cel mai important factor în succesul terapiei. E important să te simți ascultat și înțeles.',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80',
    ARRAY['Ghid', 'Psihoterapie', 'Wellness'],
    NOW(),
    'Dr. Elena Popescu'
),
(
    'Beneficiile terapiei online: Este la fel de eficientă?',
    'beneficiile-terapiei-online',
    'În era digitală, terapia online a devenit o normă. Descoperă avantajele și dezavantajele acestui format.',
    '# Terapia Online: O nouă perspectivă\n\nPandemia a accelerat adopția terapiei online, dar este ea eficientă? Răspunsul scurt este **DA**.\n\n## Avantaje\n- **Confort**: Discuți din propriul living.\n- **Accesibilitate**: Poți accesa specialiști din alte orașe.\n- **Anonimat**: Unii clienți se simt mai confortabil în spatele unui ecran.\n\n## Eficiență\nNumeroase studii indică faptul că terapia prin videoconferință are rezultate comparabile cu cea față în față pentru depresie și anxietate.',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80',
    ARRAY['Online', 'Tehnologie', 'Sănătate Mintală'],
    NOW() - INTERVAL '2 days',
    'Andrei Rusu'
),
(
    '5 Tehnici de reducere a anxietății în 5 minute',
    '5-tehnici-reducere-anxietate',
    'Simți că pierzi controlul? Încearcă aceste exerciții simple de respirație și grounding.',
    '# 5 Minute pentru liniște\n\nAnxietatea poate lovi oricând. Iată 3 tehnici rapide:\n\n### 1. Respirația 4-7-8\nInspiră 4 secunde, ține aerul 7 secunde, expiră 8 secunde. Repetă de 4 ori.\n\n### 2. Tehnica 5-4-3-2-1\nIdentifică:\n- 5 lucruri pe care le vezi\n- 4 lucruri pe care le poți atinge\n- 3 lucruri pe care le auzi\n- 2 lucruri pe care le poți mirosi\n- 1 lucru pe care îl poți gusta\n\n### 3. Scanare corporală\nÎnchide ochii și concentrează-te pe senzațiile din corpul tău, de la degete până la creștetul capului.',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80',
    ARRAY['Anxietate', 'Self-Help', 'Practic'],
    NOW() - INTERVAL '5 days',
    'Maria Ionescu'
)
ON CONFLICT (slug) DO NOTHING;
