-- Add specializations array column if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'therapist_profiles' and column_name = 'specializations') then
        alter table therapist_profiles add column specializations text[] default '{}';
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'therapist_profiles' and column_name = 'medical_code') then
        alter table therapist_profiles add column medical_code text;
    end if;
end $$;
