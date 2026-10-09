# Selwyn Rail Road — selwynrailroadgroup.com

Static HTML site. Every push to `main` uploads the site to the web host over FTP (see `.github/workflows/deploy.yml`).

## One-time setup

1. **Repository secrets** (Settings → Secrets and variables → Actions → *Secrets*):
   - `FTP_SERVER` — FTP host, e.g. `ftp.selwynrailroadgroup.com` (no `ftp://`)
   - `FTP_USERNAME` — FTP user
   - `FTP_PASSWORD` — FTP password
2. **Optional repository variables** (same page → *Variables*):
   - `FTP_SERVER_DIR` — folder that serves the domain, ending in `/`. Default `public_html/`.
     If your FTP account already opens inside the site folder, set this to `./`.
   - `FTP_PROTOCOL` — `ftps` (default) or `ftp` if your host doesn't support FTPS.
3. **DNS** — point `selwynrailroadgroup.com` and `www` to the host (A record or the host's nameservers).
4. **SSL** — turn on the free SSL certificate in the hosting panel (AutoSSL / Let's Encrypt). `.htaccess` then redirects everything to `https://selwynrailroadgroup.com`.

## Deploy

Push to `main`, or run **Actions → Deploy to selwynrailroadgroup.com → Run workflow**.

## Before launch

- Connect the contact form in `script.js` to an email handler or CRM (it does not send messages yet).
- Add company history, leadership and service area to `about.html` (see the HTML comment there).
