-- Create the business-logos bucket
insert into storage.buckets (id, name, public)
values ('business-logos', 'business-logos', true);

-- Allow public access to view files
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'business-logos' );

-- Allow authenticated users to upload files
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'business-logos' and auth.role() = 'authenticated' );

-- Allow users to update their own files (optional, but good for overwrites if filenames match)
create policy "Authenticated users can update own files"
  on storage.objects for update
  using ( bucket_id = 'business-logos' and auth.uid() = owner )
  with check ( bucket_id = 'business-logos' and auth.uid() = owner );

-- Allow users to delete their own files
create policy "Authenticated users can delete own files"
  on storage.objects for delete
  using ( bucket_id = 'business-logos' and auth.uid() = owner );
