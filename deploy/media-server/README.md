# CMS media server (VPS)

Serves public media files and accepts authenticated uploads/deletes from the Next.js admin UI.

## Layout

| Path | Role |
|------|------|
| `/var/www/cms-media` | Static files (`videos/`, `employees/`) |
| `/opt/cms-media-server` | This Node service |
| nginx | HTTPS + static + proxy `/upload` and `/files` |

## Deploy

```bash
# On the VPS
sudo mkdir -p /var/www/cms-media /opt/cms-media-server
sudo chown -R www-data:www-data /var/www/cms-media

# Copy this folder to /opt/cms-media-server (rsync/scp)
cd /opt/cms-media-server
cp .env.example .env   # set MEDIA_UPLOAD_SECRET + CORS_ORIGINS
npm install --omit=dev

sudo cp cms-media.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now cms-media

# Configure nginx from nginx.conf.example, then:
sudo certbot --nginx -d media.example.com
sudo nginx -t && sudo systemctl reload nginx
```

Use the **same** `MEDIA_UPLOAD_SECRET` on Vercel.

## Vercel env

```
NEXT_PUBLIC_MEDIA_BASE_URL=https://media.example.com
MEDIA_UPLOAD_SECRET=<same-secret>
MEDIA_UPLOAD_URL=https://media.example.com/upload
MEDIA_DELETE_URL=https://media.example.com/files
```

## Auth

Next.js verifies the Firebase ID token, then mints an HMAC token:

`{exp}.{hmac}` where HMAC is over `METHOD\npathname\exp`.

The browser sends the file with:

- `X-Media-Token`
- `X-Media-Pathname`
- `Content-Type`
