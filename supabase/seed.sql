-- Seed data for the waitlist table
-- Uses ON CONFLICT to make the seed idempotent (safe to re-run)

insert into public.waitlist (email, company_name, use_case)
values
  ('maria.gomez@example.com', 'TechFlow', 'We want to integrate Acta API to automate compliance onboarding.'),
  ('juan.perez@startup.io', 'Startup.io', 'Looking to verify credentials of our freelancers through Acta.'),
  ('karla.smith@finpay.com', 'FinPay', 'Using Acta to validate identity of our vendors and treasury operators.'),
  ('andres.lopez@creatorshub.com', 'CreatorsHub', 'Need credential verification for creators and digital artists.'),
  ('laura.ramirez@example.org', null, 'I am testing Acta API for a side project with academic credentials.'),
  ('diego.martinez@securechain.dev', 'SecureChain', 'We want to build a trusted P2P verification flow.'),
  ('sofia.hernandez@eduverse.com', 'EduVerse', 'Using Acta to verify student certificates and micro-credentials.'),
  ('carlos.mena@testmail.dev', null, 'Exploring Acta for document verification in a personal project.')
on conflict (email) do nothing;
