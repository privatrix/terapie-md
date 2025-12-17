-- Relax policies for blog-images bucket to debug/unblock
-- WARNING: This allows public uploads. Secure this later.

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;

-- Allow Public Upload (temporary)
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'blog-images' );
