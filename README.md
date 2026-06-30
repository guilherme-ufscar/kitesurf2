# KITE360º — Marketplace de Esportes Aquáticos

Plataforma de compra e venda de equipamentos de kitesurf, wingfoil, kitefoil, kitewave e acessórios.

## Stack

- **Frontend**: Next.js 14 (App Router, standalone output)
- **Backend**: NestJS + Prisma + PostgreSQL + Redis
- **Infra**: Docker Compose + nginx (proxy reverso)
- **Auth**: JWT (access + refresh token) + Cloudflare Turnstile
- **Chat**: Socket.IO (namespace `/chat`)
- **E-mail**: Resend (primário) + SMTP (fallback)

## Pré-requisitos

- Docker + Docker Compose
- Git

## Subir em produção

```bash
# 1. Clone o repositório
git clone https://github.com/guilherme-ufscar/kitesurf2.git
cd kitesurf2

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 3. Suba os containers
docker compose up -d --build

# 4. (Opcional) Popular banco com dados iniciais
docker exec kite-api-1 node -e "require('./dist/src/prisma.module')" # ou rode o seed manualmente
```

Acesse em `http://localhost:8080` (ou a porta definida em `APP_PORT`).

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
|---|---|
| `APP_PORT` | Porta exposta (padrão: 8080) |
| `APP_URL` | URL pública da aplicação |
| `JWT_SECRET` | Segredo JWT (mínimo 32 chars) |
| `DATABASE_URL` | String de conexão PostgreSQL |
| `REDIS_URL` | String de conexão Redis |
| `RESEND_API_KEY` | API key do Resend (e-mail) |
| `TURNSTILE_SITE_KEY` | Chave pública do Cloudflare Turnstile |
| `TURNSTILE_SECRET_KEY` | Chave secreta do Cloudflare Turnstile |

> Sem `RESEND_API_KEY`, e-mails não são enviados e contas já nascem verificadas (útil para dev).

## Estrutura

```
├── api/          # NestJS backend
├── web/          # Next.js frontend
├── proxy/        # Configuração nginx
├── docker-compose.yml
└── .env.example
```

## Funcionalidades

- Anúncios com fotos, categorias e busca geográfica
- Chat interno com filtro anti-contato externo
- Sistema de avaliações e reputação
- Favoritos
- Planos de assinatura (Free / Pro / Premium)
- Verificação de conta (e-mail + documento)
- Painel administrativo (usuários, anúncios, moderação, banners)
- Impulsionamento de anúncios
