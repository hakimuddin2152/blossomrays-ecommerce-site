-- Migration 007: Allow authenticated users to insert their own profile row.
--
-- The handle_new_user trigger (SECURITY DEFINER) creates the profile at signup,
-- but if a user account pre-dates the trigger the row is missing.  Without an
-- INSERT policy the client-side upsert silently succeeds with 0 rows written,
-- showing a false "success" message.  This policy lets the authenticated client
-- upsert their own row when it is absent.

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
