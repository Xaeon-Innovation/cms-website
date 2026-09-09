# After cutover from Vercel Blob

1. Deploy `deploy/media-server` on the VPS (see that folder’s README).
2. Set Vercel env: `NEXT_PUBLIC_MEDIA_BASE_URL`, `MEDIA_UPLOAD_SECRET`, optional `MEDIA_UPLOAD_URL` / `MEDIA_DELETE_URL`.
3. Seed (optional):
   ```bash
   set MEDIA_UPLOAD_SECRET=...
   set NEXT_PUBLIC_MEDIA_BASE_URL=https://media.example.com
   npm run seed:videos
   npm run seed:employees
   ```
4. Or re-upload via Admin → Media / Employees.
5. In the Vercel dashboard, delete the old Blob stores (`cms-website-blob`, `images`) so usage stops growing.
