
-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  page_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;

-- Enable RLS on the feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to insert feedback
CREATE POLICY "Anyone can insert feedback" ON public.feedback
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Create a policy to allow admins to read all feedback
CREATE POLICY "Admins can read all feedback" ON public.feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE role = 'admin'
  ));
