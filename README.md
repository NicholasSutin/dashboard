This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

```bash
npm run dev
```

---

# APIs:
- [Cloudflare CDN-CGI](https://www.cloudflare.com/cdn-cgi/trace)
- [Finnhub](https://finnhub.io/dashboard) for .env.local: FINNHUB_API_KEY=
- [Strava](https://strava.com) for STRAVA_CLIENT_ID=, STRAVA_CLIENT_SECRET=, STRAVA_VERIFY_TOKEN=, STRAVA_REFRESH_TOKEN=. (find refresh token at /api/strava/auth?debug=1, tried to make debug only work on localhost)
    - Requires you to create a [Strava API](https://www.strava.com/settings/api)
    - see your strava activities at /api/strava/activities
- [Google Apps Script](https://script.google.com/) for GOOGLE_APPS_SCRIPT_URL= (calendar data)
    - Note that I will do my best not to require google cloud/console projects because many organizations are afraid of allowing their users to develop. I'd really like to later find an auth app that can send google scopes to be managed from here (This might require a review by google themselves because it would be a public project accessing OAuth scopes / advanced (personal) APIs)

# Data:

Data is in public/mydata.json. change name, tickers, and ticker refresh rate there.
- "preferredStravaMonth": 8 (for August/any #) or "preferredStravaMonth": null for current month.
    - will probably put interactivity in components/strava/Distance.tsx to make this visual
