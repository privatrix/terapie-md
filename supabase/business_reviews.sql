-- Add business_id to reviews table
ALTER TABLE public.reviews
ADD COLUMN business_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE;

-- Add check constraint to ensure review is for either therapist OR business, but not both (or neither)
ALTER TABLE public.reviews
ADD CONSTRAINT reviews_target_check CHECK (
  (therapist_id IS NOT NULL AND business_id IS NULL) OR 
  (therapist_id IS NULL AND business_id IS NOT NULL)
);

-- Update unique constraint to include business_id
-- We need to drop the old unique constraint first. 
-- Note: The name of the constraint might vary, usually it's reviews_therapist_id_client_id_key
ALTER TABLE public.reviews
DROP CONSTRAINT IF EXISTS reviews_therapist_id_client_id_key;

CREATE UNIQUE INDEX idx_reviews_unique_therapist ON public.reviews(therapist_id, client_id) WHERE therapist_id IS NOT NULL;
CREATE UNIQUE INDEX idx_reviews_unique_business ON public.reviews(business_id, client_id) WHERE business_id IS NOT NULL;

-- Add rating columns to business_profiles
ALTER TABLE public.business_profiles
ADD COLUMN rating NUMERIC(3, 2) DEFAULT 0,
ADD COLUMN review_count INTEGER DEFAULT 0;

-- Function to update business rating
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.business_profiles
  SET 
    rating = (
      SELECT AVG(rating)::NUMERIC(3,2)
      FROM public.reviews
      WHERE business_id = NEW.business_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE business_id = NEW.business_id
    )
  WHERE id = NEW.business_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for business rating
CREATE TRIGGER update_rating_after_business_review
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW 
WHEN (NEW.business_id IS NOT NULL)
EXECUTE FUNCTION update_business_rating();

-- Update RLS for reviews to allow creation if business_id is present
-- The existing policy "Clients can create reviews" checks auth.uid() = client_id, which is fine.
-- But we might need to ensure they can only review if they have a booking? 
-- For therapists, we didn't enforce booking strictly in RLS, but in UI/API.
-- For businesses, we might want to allow reviews from anyone? Or just clients?
-- Current policy: "Clients can create reviews" -> auth.uid() = client_id. This is fine.
