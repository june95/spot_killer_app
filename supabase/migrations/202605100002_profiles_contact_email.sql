alter table public.profiles
add column contact_email text check (
  contact_email is null
  or (
    char_length(contact_email) <= 320
    and contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  )
);

create index profiles_contact_email_idx
on public.profiles (lower(contact_email))
where contact_email is not null;
