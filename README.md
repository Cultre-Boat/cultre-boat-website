# Cultre Boat website

Next.js 16 (App Router) site for Cultre Boat.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Production

```bash
npm run build
npm start
```

Requires Node.js 20.9 or newer.

### Environment variables

Set these in your hosting provider (for example Vercel → Project → Settings → Environment Variables):

| Variable | Required | Purpose |
| --- | --- | --- |
| `EMAIL_USER` | yes | Gmail address that sends contact-form emails |
| `EMAIL_PASS` | yes | Gmail **App Password** for that account (not the normal password) |
| `CONTACT_TO` | no | Inbox that receives submissions (defaults to `EMAIL_USER`) |
| `NEXT_PUBLIC_SITE_URL` | yes | Live URL, e.g. `https://cultreboat.com`; used for canonical links, sitemap and social previews |

### Adding images

- Keep images in `public/` under about 2–3 MB and at most ~2560 px on the long side. Larger files load slowly, and the image optimiser rejects anything over 50 MB.
- Paths are **case-sensitive** in production: `/Grids/Kelby/main.png` and `/Grids/kelby/main.png` are different files on the server, even though they work the same on a Mac.
- Brand galleries are configured in `app/Brands/Data.js`.
