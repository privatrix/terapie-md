
-- Recalculate ratings and review counts for all therapists
UPDATE public.therapist_profiles tp
SET 
    rating = COALESCE((
        SELECT AVG(rating)::NUMERIC(3,2)
        FROM public.reviews r
        WHERE r.therapist_id = tp.id
    ), 0),
    review_count = (
        SELECT COUNT(*)
        FROM public.reviews r
        WHERE r.therapist_id = tp.id
    );

-- Ensure the trigger is correctly defined (re-applying just in case)
CREATE OR REPLACE FUNCTION update_therapist_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.therapist_id IS NOT NULL THEN
      UPDATE public.therapist_profiles
      SET 
        rating = (
          SELECT COALESCE(AVG(rating)::NUMERIC(3,2), 0)
          FROM public.reviews
          WHERE therapist_id = NEW.therapist_id
        ),
        review_count = (
          SELECT COUNT(*)
          FROM public.reviews
          WHERE therapist_id = NEW.therapist_id
        )
      WHERE id = NEW.therapist_id;
  END IF;
  
  IF TG_OP = 'DELETE' AND OLD.therapist_id IS NOT NULL THEN
      UPDATE public.therapist_profiles
      SET 
        rating = (
          SELECT COALESCE(AVG(rating)::NUMERIC(3,2), 0)
          FROM public.reviews
          WHERE therapist_id = OLD.therapist_id
        ),
        review_count = (
          SELECT COUNT(*)
          FROM public.reviews
          WHERE therapist_id = OLD.therapist_id
        )
      WHERE id = OLD.therapist_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_rating_after_review ON public.reviews;

CREATE TRIGGER update_rating_after_review
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_therapist_rating();
