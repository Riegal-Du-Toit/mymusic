# MyMusic

This is an early development foundation, not the completed application. It supports individual YouTube links, favourites and embedded video playback. Signed-out songs are stored locally; signed-in songs use Supabase. The two libraries remain separate and local songs are not uploaded automatically. Playlist management, SQLite, karaoke, local files and the other features in the brief are not yet implemented. Do not rely on this development version for irreplaceable data.

Install dependencies using `npm.cmd install`, build with `npm.cmd run build`, and launch with `npm.cmd start`.

Supabase: set `VITE_SUPABASE_URL` to the project URL and `VITE_SUPABASE_ANON_KEY` to a publishable or legacy anon key in `.env.local`, then rebuild. These values are embedded in the desktop application and must never contain a service-role or secret key. The connection check verifies access to the project's Auth health endpoint. Create the administrator in Supabase Auth and disable public signups in Supabase; the app itself has no registration. Existing user-scoped policies alone do not restrict access to one admin account.
