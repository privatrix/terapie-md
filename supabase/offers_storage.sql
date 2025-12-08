-- Create storage bucket for offers
INSERT INTO storage.buckets (id, name, public)
VALUES ('offers', 'offers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to offers
CREATE POLICY "Public read access offers"
ON storage.objects FOR SELECT
USING (bucket_id = 'offers');

-- Allow authenticated users (therapists/businesses) to upload offer images
-- We'll simplify and allow any authenticated user to upload to 'offers' bucket for now
CREATE POLICY "Authenticated users can upload offer images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'offers' AND
    auth.role() = 'authenticated'
);

-- Allow users to update/delete their own offer images (if they uploaded them)
-- This is tricky without folder structure enforcing ownership, but for now we can rely on file naming or just allow insert.
-- A better approach is to use a folder structure like `offers/user_id/filename` but the current OfferForm uses random filenames.
-- We will allow insert for now.
