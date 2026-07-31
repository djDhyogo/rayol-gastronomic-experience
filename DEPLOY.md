# Deploy — Rayol Bistrô

Build multi-host via Nitro (`NITRO_PRESET`). Default sem env = **Cloudflare** (compatível com Lovable).

## Comandos locais

```bash
bun install

# Cloudflare (default)
bun run build                 # ou: bun run build:cloudflare
bun run preview               # http://localhost:8787 (Wrangler)

# Netlify
bun run build:netlify         # gera dist/ + .netlify/functions-internal/

# Vercel
bun run build:vercel          # gera .vercel/output/ (Build Output API)

# Node / Railway / Docker
bun run build:node
bun run preview:node          # ou: bun start → http://localhost:3000
```

## Netlify

Arquivo: [`netlify.toml`](netlify.toml)

- Build: `bun run build:netlify`
- Publish: `dist`
- Funções SSR: geradas em `.netlify/functions-internal/` (Nitro)

No painel: Node 22, connectar o repo e fazer deploy.

## Vercel

Arquivo: [`vercel.json`](vercel.json)

- Build: `bun run build:vercel`
- Artefato: `.vercel/output` (detectado automaticamente)

## Cloudflare

- Build: `bun run build` / `build:cloudflare`
- Preview: `bun run preview`
- Deploy: a partir de `.output/` com Wrangler (`npx wrangler deploy` no diretório do artefato gerado)

## Presets

| Script | `NITRO_PRESET` | Saída principal |
|--------|----------------|-----------------|
| `build` / `build:cloudflare` | `cloudflare-module` | `.output/` + Wrangler |
| `build:netlify` | `netlify` | `dist/` + `.netlify/` |
| `build:vercel` | `vercel` | `.vercel/output/` |
| `build:node` | `node-server` | `.output/server/index.mjs` |

## Notas

- API do cardápio: `https://rayolbistro.chefchefe.app/api/v1` (em `src/services/api-client.ts`).
- Builds Lovable continuam forçando Cloudflare no editor; overrides acima valem em CI/self-host.
- Não use `vite preview` como preview SSR deste stack (espera `dist/server`, que o Nitro Cloudflare não gera).
