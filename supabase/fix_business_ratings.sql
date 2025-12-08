
-- Recalculate ratings and review counts for all businesses
UPDATE public.business_profiles bp
SET 
    rating = COALESCE((
        SELECT AVG(rating)::NUMERIC(3,2)
        FROM public.reviews r
        WHERE r.business_id = bp.id
    ), 0),
    review_count = (
        SELECT COUNT(*)
        FROM public.reviews r
        WHERE r.business_id = bp.id
    );

-- Ensure the trigger is correctly defined for businesses too
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.business_id IS NOT NULL THEN
      UPDATE public.business_profiles
      SET 
        rating = (
          SELECT COALESCE(AVG(rating)::NUMERIC(3,2), 0)
          FROM public.reviews
          WHERE business_id = NEW.business_id
        ),
        review_count = (
          SELECT COUNT(*)
          FROM public.reviews
          WHERE business_id = NEW.business_id
        )
      WHERE id = NEW.business_id;
  END IF;
  
  IF TG_OP = 'DELETE' AND OLD.business_id IS NOT NULL THEN
      UPDATE public.business_profiles
      SET 
        rating = (
          SELECT COALESCE(AVG(rating)::NUMERIC(3,2), 0)
          FROM public.reviews
          WHERE business_id = OLD.business_id
        ),
        review_count = (
          SELECT COUNT(*)
          FROM public.reviews
          WHERE business_id = OLD.business_id
        )
      WHERE id = OLD.business_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_business_rating_after_review ON public.reviews;

CREATE TRIGGER update_business_rating_after_review
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_business_rating();
