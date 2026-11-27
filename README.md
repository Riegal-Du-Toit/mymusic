# MyMusic

MyMusic is an early development application for personal music and karaoke management. Supabase is the intended persistent storage for the signed-in administrator's library and profiles; SQLite is no longer a project requirement. Signed-out songs are held separately in browser local storage and are not uploaded automatically. The application is intended for a single screen; a second-monitor display is not required.

Currently available: administrator sign-in, music profiles, YouTube video links, favourites, profile search, song selection and sequential embedded playback. This is not yet the complete application: karaoke sessions, local file playback, integrated online search, complete playlist management, full playback controls, backups and a verified Windows installer remain unfinished. Do not rely on this development version for irreplaceable data.

Install dependencies using `npm.cmd install`, build with `npm.cmd run build`, and launch with `npm.cmd start`.

Supabase: set `VITE_SUPABASE_URL` to the project URL and `VITE_SUPABASE_ANON_KEY` to a publishable or legacy anon key in `.env.local`, then rebuild. These values are embedded in the desktop application and must never contain a service-role or secret key. The connection check verifies access to the project's Auth health endpoint. Create the administrator in Supabase Auth and disable public signups in Supabase; the app itself has no registration. Existing user-scoped policies alone do not restrict access to one admin account.
