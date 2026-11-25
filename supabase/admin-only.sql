-- Run after creating and confirming the administrator in Supabase Auth.
-- Existing ownership policies remain in force alongside these restrictions.
begin;
create policy "Only administrator can access tracks"
  on public.tracks as restrictive for all to authenticated
  using ((select auth.jwt() ->> 'email') = 'admin@out.com')
  with check ((select auth.jwt() ->> 'email') = 'admin@out.com');
create policy "Only administrator can access playlists"
  on public.playlists as restrictive for all to authenticated
  using ((select auth.jwt() ->> 'email') = 'admin@out.com')
  with check ((select auth.jwt() ->> 'email') = 'admin@out.com');
create policy "Only administrator can access playlist entries"
  on public.playlist_tracks as restrictive for all to authenticated
  using ((select auth.jwt() ->> 'email') = 'admin@out.com')
  with check ((select auth.jwt() ->> 'email') = 'admin@out.com');
commit;
