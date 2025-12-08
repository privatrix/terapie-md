-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('client', 'therapist', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE submission_status AS ENUM ('new', 'in_progress', 'resolved');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Therapist profiles table
CREATE TABLE public.therapist_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  location TEXT,
  price_range TEXT,
  languages TEXT[] DEFAULT '{}',
  education JSONB DEFAULT '[]',
  availability TEXT,
  image_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Offers table
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.therapist_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  validity TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id UUID REFERENCES public.therapist_profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(therapist_id, client_id)
);

-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status submission_status DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Therapist applications table
CREATE TABLE public.therapist_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  title TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  price_range TEXT NOT NULL,
  education JSONB DEFAULT '[]',
  experience_years TEXT NOT NULL,
  license_number TEXT NOT NULL,
  bio TEXT NOT NULL,
  availability TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_therapist_profiles_verified ON public.therapist_profiles(verified);
CREATE INDEX idx_therapist_profiles_user_id ON public.therapist_profiles(user_id);
CREATE INDEX idx_offers_active ON public.offers(active);
CREATE INDEX idx_bookings_therapist_id ON public.bookings(therapist_id);
CREATE INDEX idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX idx_reviews_therapist_id ON public.reviews(therapist_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can read their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Therapist Profiles: Public can view verified profiles
CREATE POLICY "Anyone can view verified therapist profiles" ON public.therapist_profiles
  FOR SELECT USING (verified = TRUE);

CREATE POLICY "Therapists can view own profile" ON public.therapist_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Therapists can update own profile" ON public.therapist_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Therapists can insert own profile" ON public.therapist_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Offers: Public can view active offers
CREATE POLICY "Anyone can view active offers" ON public.offers
  FOR SELECT USING (active = TRUE);

-- Bookings: Users can view their own bookings
CREATE POLICY "Clients can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Therapists can view bookings for themselves" ON public.bookings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.therapist_profiles WHERE id = therapist_id
    )
  );

CREATE POLICY "Clients can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients and therapists can update bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = client_id OR 
    auth.uid() IN (
      SELECT user_id FROM public.therapist_profiles WHERE id = therapist_id
    )
  );

-- Reviews: Public can view reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "Clients can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = client_id);

-- Contact Submissions: Anyone can insert
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT WITH CHECK (TRUE);

-- Therapist Applications: Anyone can submit, admins can view/update
CREATE POLICY "Anyone can submit therapist application" ON public.therapist_applications
  FOR INSERT WITH CHECK (TRUE);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapist_profiles_updated_at BEFORE UPDATE ON public.therapist_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update therapist rating after review
CREATE OR REPLACE FUNCTION update_therapist_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.therapist_profiles
  SET 
    rating = (
      SELECT AVG(rating)::NUMERIC(3,2)
      FROM public.reviews
      WHERE therapist_id = NEW.therapist_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE therapist_id = NEW.therapist_id
    )
  WHERE id = NEW.therapist_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_therapist_rating();
