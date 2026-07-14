-- =============================================================================
-- Migration: 20260313000003_auth_hooks
-- Purpose  : Auto-create a profile row when a new auth user signs up.
--            Without this, profile rows must be created manually from the app —
--            a race condition waiting to happen.
--
-- Security: SECURITY DEFINER runs as the function owner (postgres), bypassing
--           RLS. This is correct here — we explicitly want to INSERT a profile
--           row regardless of RLS policies.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profile (uuid, email, nick_name, signup_type, status)
  VALUES (
    NEW.id,
    NEW.email,
    -- Default nick_name: everything before @ in the email.
    -- The user can update this later from their profile page.
    split_part(NEW.email, '@', 1),
    -- Detect signup provider from auth metadata
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    'active'
  )
  ON CONFLICT (uuid) DO NOTHING;  -- idempotent: re-trigger won't duplicate
  RETURN NEW;
END;
$$;

-- Attach to auth.users — fires after every new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
