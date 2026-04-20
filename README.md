# Lead Send Hub - Plain Vite React + Cloudflare Pages

## Local development

```bash
npm install
npm run dev
```

## Cloudflare Pages settings

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

## Required Pages environment variable

Add this in Cloudflare Pages > Settings > Variables and Secrets:

- `N8N_WEBHOOK_URL` = your **production** n8n webhook URL

The frontend posts to `/api/lead`, and the Pages Function forwards the uploaded CSV and fields to n8n.

## Important

Do not rename these form fields in the frontend because the n8n workflow expects them exactly:

- `attach`
- `When do you need these sent by?`
- `timezone`
