-- Create waitlist table
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  email text not null,
  therapist_id uuid references therapist_profiles(id),
  offer_id uuid references offers(id),
  business_id uuid,
  requested_date date,
  status text default 'pending', -- pending, notified, fulfilled, contacted
  created_at timestamptz default now()
);

-- Enable RLS
alter table waitlist enable row level security;

-- Policies

-- 1. Users can insert their own request
-- Note: 'user_id' might be null if we allow anonymous waitlist later, but for now we enforce auth user via API.
-- If user is authenticated, they can insert.
create policy "Users can insert own waitlist request"
  on waitlist for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- 2. Service role can do anything
create policy "Service role can manage waitlist"
  on waitlist for all
  using ( auth.role() = 'service_role' )
  with check ( auth.role() = 'service_role' );

-- 3. Users can view their own requests
create policy "Users can view own waitlist requests"
  on waitlist for select
  to authenticated
  using ( auth.uid() = user_id );

-- 4. Therapists can view requests assigned to them
create policy "Therapists can view assigned waitlist"
  on waitlist for select
  to authenticated
  using (
    therapist_id in (
      select id from therapist_profiles where user_id = auth.uid()
    )
  );

-- 5. Therapists can update status of requests assigned to them
create policy "Therapists can update assigned waitlist"
  on waitlist for update
  to authenticated
  using (
    therapist_id in (
      select id from therapist_profiles where user_id = auth.uid()
    )
  )
  with check (
    therapist_id in (
      select id from therapist_profiles where user_id = auth.uid()
    )
  );
