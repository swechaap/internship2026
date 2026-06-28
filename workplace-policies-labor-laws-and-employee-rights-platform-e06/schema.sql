-- ==========================================
-- WorkRights Hub — Supabase Schema v2
-- Multi-Tenant Complaint Management Platform
-- Drop & recreate in Supabase SQL Editor
-- ==========================================

-- ── 1. COMPANIES ─────────────────────────
CREATE TABLE IF NOT EXISTS public.companies (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code       text UNIQUE NOT NULL,
  name       text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "companies_select" ON public.companies;
CREATE POLICY "companies_select" ON public.companies FOR SELECT USING (true);


-- ── 2. PROFILES ──────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  updated_at    timestamptz,
  name          text,
  employee_id   text UNIQUE,
  company_id    uuid REFERENCES public.companies(id),
  role          text DEFAULT 'employee' CHECK (role IN ('employee','hr')),
  company       text DEFAULT 'Meridian Logistics Pvt. Ltd.',
  department    text DEFAULT 'Operations & Supply Chain',
  designation   text DEFAULT 'Senior Operations Associate',
  joining_date  text DEFAULT '14 March 2022',
  email         text,
  phone         text,
  location      text DEFAULT 'Pune, Maharashtra',
  avatar_url    text
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

-- Employees see own; HR sees all in same company
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (
  auth.uid() = id
  OR company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- ── 3. COMPLAINTS ─────────────────────────
CREATE TABLE IF NOT EXISTS public.complaints (
  id              text PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id      uuid REFERENCES public.companies(id),
  category        text NOT NULL,
  subject         text,
  "desc"          text NOT NULL,
  department      text,
  priority        text DEFAULT 'Medium',
  anonymous       boolean DEFAULT false,
  status          text DEFAULT 'Submitted',
  assigned_hr_id  uuid REFERENCES public.profiles(id),
  internal_notes  text,
  resolution_date text,
  last_updated    text,
  created_at      timestamptz DEFAULT now()
);
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "complaints_select" ON public.complaints;
DROP POLICY IF EXISTS "complaints_insert" ON public.complaints;
DROP POLICY IF EXISTS "complaints_update" ON public.complaints;
DROP POLICY IF EXISTS "complaints_delete" ON public.complaints;

-- Employees see their own; HR sees all in same company
CREATE POLICY "complaints_select" ON public.complaints FOR SELECT USING (
  company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
  AND (
    user_id = auth.uid()
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'hr'
  )
);
CREATE POLICY "complaints_insert" ON public.complaints FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "complaints_update" ON public.complaints FOR UPDATE USING (
  company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
  AND (
    user_id = auth.uid()
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'hr'
  )
);
CREATE POLICY "complaints_delete" ON public.complaints FOR DELETE USING (auth.uid() = user_id);


-- ── 4. COMPLAINT MESSAGES ─────────────────
CREATE TABLE IF NOT EXISTS public.complaint_messages (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id text NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  sender_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_role  text NOT NULL CHECK (sender_role IN ('employee','hr')),
  body         text NOT NULL,
  seen         boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE public.complaint_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select" ON public.complaint_messages;
DROP POLICY IF EXISTS "messages_insert" ON public.complaint_messages;
DROP POLICY IF EXISTS "messages_update" ON public.complaint_messages;

CREATE POLICY "messages_select" ON public.complaint_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.complaints c
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE c.id = complaint_messages.complaint_id
      AND c.company_id = p.company_id
      AND (c.user_id = auth.uid() OR p.role = 'hr')
  )
);
CREATE POLICY "messages_insert" ON public.complaint_messages FOR INSERT WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.complaints c
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE c.id = complaint_messages.complaint_id
      AND c.company_id = p.company_id
      AND (c.user_id = auth.uid() OR p.role = 'hr')
  )
);
CREATE POLICY "messages_update" ON public.complaint_messages FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.complaints c
    JOIN public.profiles p ON p.id = auth.uid()
    WHERE c.id = complaint_messages.complaint_id
      AND c.company_id = p.company_id
      AND p.role = 'hr'
  )
);


-- ── 5. COMPANY POLICIES ───────────────────
CREATE TABLE IF NOT EXISTS public.company_policies (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id   uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title        text NOT NULL,
  body         text NOT NULL,
  category     text DEFAULT 'General',
  published_by uuid REFERENCES public.profiles(id),
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
ALTER TABLE public.company_policies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cpolicies_select" ON public.company_policies;
DROP POLICY IF EXISTS "cpolicies_insert" ON public.company_policies;
DROP POLICY IF EXISTS "cpolicies_update" ON public.company_policies;
DROP POLICY IF EXISTS "cpolicies_delete" ON public.company_policies;

CREATE POLICY "cpolicies_select" ON public.company_policies FOR SELECT USING (
  company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "cpolicies_insert" ON public.company_policies FOR INSERT WITH CHECK (
  company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'hr'
);
CREATE POLICY "cpolicies_update" ON public.company_policies FOR UPDATE USING (
  company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'hr'
);
CREATE POLICY "cpolicies_delete" ON public.company_policies FOR DELETE USING (
  company_id = (SELECT company_id FROM public.profiles WHERE id = auth.uid())
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'hr'
);


-- ── 6. NOTIFICATIONS ──────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  icon       text NOT NULL,
  color      text NOT NULL,
  title      text NOT NULL,
  body       text NOT NULL,
  time       text NOT NULL,
  unread     boolean DEFAULT true,
  target     jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
DROP POLICY IF EXISTS "notifications_delete" ON public.notifications;
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete" ON public.notifications FOR DELETE USING (auth.uid() = user_id);


-- ── 7. LAWS ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.laws (
  id         text PRIMARY KEY,
  title      text NOT NULL,
  category   text NOT NULL,
  importance text NOT NULL,
  summary    text NOT NULL,
  protects   text NOT NULL,
  benefits   text[] NOT NULL,
  example    text NOT NULL
);
ALTER TABLE public.laws ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "laws_select" ON public.laws;
CREATE POLICY "laws_select" ON public.laws FOR SELECT USING (true);


-- ── 8. TRIGGER: Auto-create profile on signup ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_company_id uuid;
  v_role text;
BEGIN
  v_company_id := (new.raw_user_meta_data->>'company_id')::uuid;
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'employee');

  INSERT INTO public.profiles (id, name, email, employee_id, company_id, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New Employee'),
    new.email,
    'EMP-' || floor(10000 + random() * 89999)::text,
    v_company_id,
    v_role
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.notifications (id, user_id, icon, color, title, body, time, target)
  VALUES (
    'n-welcome-' || floor(10000 + random() * 89999)::text,
    new.id,
    'compass', 'teal',
    'Welcome to WorkRights Hub!',
    'Your account is ready. Explore your rights and raise complaints securely.',
    'Just now',
    '{"page":"home","type":"profile"}'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 9. SEED: Companies ────────────────────
INSERT INTO public.companies (id, code, name) VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'DEMO001', 'Demo Corporation'),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'TCS001',  'Tata Consultancy Services'),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'INF001',  'Infosys Limited'),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'WIP001',  'Wipro Technologies'),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'HCL001',  'HCL Technologies'),
  ('00000000-0000-0000-0000-000000000006'::uuid, 'WRH001',  'WorkRights Hub Inc.')
ON CONFLICT (code) DO NOTHING;


-- ── 10. SEED: Laws ────────────────────────
INSERT INTO public.laws (id, title, category, importance, summary, protects, benefits, example)
VALUES
  ('wages-act', 'Payment of Wages', 'Salary', 'High',
   'Sets out when wages must be paid and what can legally be deducted from them.',
   'Anyone earning wages below a defined threshold, across most industries.',
   ARRAY['Fixed wage payment timelines','A capped, defined list of legal deductions','The right to claim unpaid or delayed wages formally'],
   'An employer delays salary citing cash flow for three months — a formal wage claim can compel payment plus penalty.'),
  ('min-wage', 'Minimum Wage Law', 'Salary', 'High',
   'Establishes a floor below which no employer can pay, varying by region and skill category.',
   'All employees, including contract and part-time workers in covered sectors.',
   ARRAY['A guaranteed wage floor regardless of negotiation power','Periodic revision to track cost-of-living changes','Protection for piece-rate and contract workers too'],
   'A contract worker paid below the regional minimum can file a claim with back-pay owed for the shortfall period.'),
  ('maternity', 'Maternity Benefit Law', 'Leave', 'High',
   'Guarantees paid leave around childbirth along with protection from dismissal during this period.',
   'Pregnant employees and new mothers across eligible establishments.',
   ARRAY['Paid leave spanning weeks before and after delivery','Protection from termination during the protected period','Nursing breaks on return to work'],
   'An employee asked to resign upon announcing pregnancy can seek reinstatement — this is directly unlawful.'),
  ('safety-act', 'Occupational Safety and Health Law', 'Safety', 'High',
   'Requires employers to maintain safe working conditions and provide protective measures.',
   'Workers across factories, construction sites, and general workplaces.',
   ARRAY['Mandated safety equipment and training','Hazard reporting channels with employer obligation to act','Compensation pathways after workplace injury'],
   'A factory floor lacking required fire exits can be reported, triggering mandatory compliance.'),
  ('posh', 'Prevention of Sexual Harassment Law', 'Harassment', 'High',
   'Mandates an internal complaints committee and a defined process for harassment complaints at work.',
   'All employees regardless of gender, across organizations above a minimum size.',
   ARRAY['A legally mandated confidential internal committee','Time-bound investigation requirements','Protection from retaliation for the complainant'],
   'A company without an internal committee despite meeting the size threshold is already in violation.'),
  ('hours-act', 'Hours of Work Regulations', 'Hours', 'Medium',
   'Caps daily and weekly working hours and mandates rest intervals.',
   'Most categories of employees, with some role-based exceptions.',
   ARRAY['A daily hour cap with mandated breaks','A defined overtime threshold and pay multiplier','A guaranteed weekly rest day'],
   'An employee scheduled seven days a week for a month without a rest day is protected regardless of informal consent.'),
  ('equal-pay', 'Equal Remuneration Law', 'Equal Opportunity', 'Medium',
   'Prohibits pay discrimination between employees performing the same or similar work.',
   'Employees facing pay disparity tied to gender or other protected traits.',
   ARRAY['Right to equal pay for equal work regardless of gender','Grounds to formally request pay-parity review','Protection from retaliation for raising the issue'],
   'Two colleagues in identical roles with a 20% pay gap unrelated to performance can compel a documented review.'),
  ('gratuity', 'Gratuity and Severance Law', 'Benefits', 'Medium',
   'Mandates a lump-sum payment to employees who complete a minimum tenure, payable on exit.',
   'Employees who have completed the qualifying period of continuous service.',
   ARRAY['Guaranteed payout formula based on tenure and last wage','Protection even after resignation not just termination','A defined timeline for settlement after exit'],
   'An employee resigning after six qualifying years with no gratuity paid can claim it through a formal demand.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title, category = EXCLUDED.category,
  importance = EXCLUDED.importance, summary = EXCLUDED.summary,
  protects = EXCLUDED.protects, benefits = EXCLUDED.benefits,
  example = EXCLUDED.example;


-- ── HR ACCOUNT SETUP ──────────────────────
-- All sign-ups default to role = 'employee'.
-- To promote someone to HR, run:
--   UPDATE public.profiles SET role = 'hr' WHERE email = 'hr@example.com';
-- ─────────────────────────────────────────
