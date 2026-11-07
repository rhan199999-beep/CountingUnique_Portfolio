# Studio reports — daily refresh

The Studio section (watch hours, devices, demographics, states, cities,
traffic sources) is **private channel data**. Subscribers and uploads are
public and already refresh hourly; these charts are not, and there is no
public endpoint for them.

The only automated source is the [YouTube Analytics API][api]. It needs the
channel owner to authorize once, then the site pulls the trailing 28 days
once a day. Without that authorization the section shows the last Studio
export with its capture date, so it never pretends stale numbers are live.

[api]: https://developers.google.com/youtube/analytics

## How the site uses it

- `src/lib/studio.ts` reads `YT_OAUTH_CLIENT_ID`, `YT_OAUTH_CLIENT_SECRET`
  and `YT_OAUTH_REFRESH_TOKEN`.
- With them it queries both channels over the last 28 full days and maps
  views, watch time, average view duration, subscribers gained, devices,
  provinces, age/gender and traffic sources into the charts.
- Results are cached for 24 hours. The page revalidates hourly, so
  subscribers stay fresh while these charts update once a day.
- If auth, quota or any single query fails, that chart falls back to the
  snapshot and the section keeps rendering.

The UI labels the section **Live · refreshed daily** with the read date, or
**Snapshot** with the export date.

## One-time setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) with the
   Google account that owns **both** channels.
2. Create (or pick) a project, then enable **YouTube Analytics API**.
3. Configure the OAuth consent screen:
   - User type: **External**
   - Scopes: `https://www.googleapis.com/auth/yt-analytics.readonly`
   - Add that Google account under **Test users**.
4. Create credentials → **OAuth client ID** → type **Web application**.
5. Get a refresh token. The quickest route is the
   [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/):
   - Gear icon → check **Use your own OAuth credentials** → paste the client
     ID and secret.
   - Authorize the `yt-analytics.readonly` scope with the channel owner
     account.
   - Exchange the authorization code for tokens, then copy the
     **refresh token**.
6. Add the three values to `.env.local` locally and to the project env vars
   on Vercel:

```bash
YT_OAUTH_CLIENT_ID=...
YT_OAUTH_CLIENT_SECRET=...
YT_OAUTH_REFRESH_TOKEN=...
```

7. Redeploy. Within one render the charts switch to live data and show
   **Live · refreshed daily**.

The same refresh token works for both channels because they belong to the
same Google account; the site passes each channel ID explicitly.

## Notes

- The Analytics API reports the last 28 **complete** days (yesterday and
  back), matching Studio's default window.
- Do not commit `.env.local`. Rotate the refresh token if it leaks.
- If you ever want a new snapshot instead of OAuth, update the Studio
  constants in `src/data/channels.ts` and bump `STUDIO_UPDATED_AT`.
