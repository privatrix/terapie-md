-- Make CUI nullable in business_applications table
ALTER TABLE public.business_applications ALTER COLUMN cui DROP NOT NULL;
