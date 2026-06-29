# KITE360º — Instruções de Desenvolvimento (Antigravity 2.0)

> Documento de especificação técnica e funcional para construção da plataforma **KITE360º**: marketplace de compra e venda focado em esportes aquáticos (kitesurf, wingfoil, kitefoil, kitewave), no formato OLX / Mercado Livre, com portal web + apps Android/iOS.

---

## 0. Visão Geral

KITE360º é um marketplace vertical (nicho de esportes aquáticos) cujo diferencial é **segurança nas negociações** e **comunidade segmentada**. O sistema deve ser construído com foco em:

- Anúncios de equipamentos (estilo OLX/Mercado Livre)
- Chat interno **bloqueado para troca de contato externo**
- Reputação/avaliações
- Selo de verificação/segurança
- Monetização via anúncios em destaque, banners publicitários, assinaturas e comissão
- Espaços de publicidade vendáveis para grandes marcas (esporte, imobiliárias, pousadas, hotéis, corretores, restaurantes, bares)

**Toda página/tela deve ser gerada via Google Stitch (MCP já configurado no Antigravity 2.0).** Use o MCP do Stitch para gerar o design/layout de cada tela antes de implementar o front-end.

---

## 1. Stack Técnica Obrigatória

| Camada | Tecnologia | Observação |
|---|---|---|
| Orquestração | **Docker Compose** | Todas as portas internas; **apenas 1 porta exposta**, definida via `.env` |
| Geração de UI | **Google Stitch (MCP)** | Toda tela passa pelo Stitch antes da implementação |
| Editor de texto (WYSIWYG) | **TipTap** | Áreas de texto/descrição de anúncios, com suporte a inserção de imagens |
| Envio de e-mail | **Resend** | Fallback para SMTP do próprio servidor quando a cota acabar |
| Armazenamento de imagens/arquivos | **Local (filesystem)** | Salvar imagens e arquivos localmente, com volume Docker persistente |
| Mapas | **Open source** (Leaflet + OpenStreetMap / MapLibre) | **NÃO usar Google Maps API** (evitar custo) |
| Captcha | **Cloudflare Turnstile** | Em cadastro, login, publicação de anúncio e formulários públicos |
| Publicidade | Sistema próprio de banners | Banners rotativos, poucos espaços premium, sem poluir |

> **Decisões de stack livres (sugeridas):** Backend Node.js (NestJS) ou Python (FastAPI/Django); Front web Next.js/React; Banco PostgreSQL; Cache/filas Redis. Mobile React Native ou Flutter (mesmo backend/API). Ajuste conforme preferência, mantendo os itens obrigatórios acima.

---

## 2. Arquitetura Docker Compose

### Regras
1. **Somente uma porta exposta ao host**, configurável por variável de ambiente (ex.: `APP_PORT`).
2. Todos os demais serviços comunicam-se **apenas pela rede interna do Docker** (sem `ports:` publicados).
3. A porta exposta vai para um **reverse proxy** (Nginx/Traefik/Caddy) que distribui internamente para web, API e estáticos.
4. Volumes persistentes para: banco de dados, uploads (imagens/arquivos) e configurações.

### Serviços sugeridos
```
- proxy        (Nginx/Traefik/Caddy)  -> ÚNICO com porta exposta (${APP_PORT})
- web          (front-end Next.js)    -> interno
- api          (backend)              -> interno
- db           (PostgreSQL)           -> interno + volume
- redis        (cache/filas)          -> interno
- worker       (jobs: e-mail, etc.)   -> interno
- storage      (volume local p/ uploads)
```

### Exemplo de `docker-compose.yml` (esqueleto)
```yaml
services:
  proxy:
    image: nginx:alpine
    ports:
      - "${APP_PORT}:80"   # ÚNICA porta exposta
    depends_on: [web, api]
    networks: [internal]
    volumes:
      - ./proxy/nginx.conf:/etc/nginx/nginx.conf:ro

  web:
    build: ./web
    expose: ["3000"]       # interno, sem publicar
    env_file: .env
    networks: [internal]

  api:
    build: ./api
    expose: ["8000"]
    env_file: .env
    depends_on: [db, redis]
    networks: [internal]
    volumes:
      - uploads:/app/uploads

  worker:
    build: ./api
    command: ["npm","run","worker"]   # ajuste ao seu runtime
    env_file: .env
    depends_on: [redis, db]
    networks: [internal]
    volumes:
      - uploads:/app/uploads

  db:
    image: postgres:16-alpine
    env_file: .env
    networks: [internal]
    volumes:
      - dbdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    networks: [internal]

networks:
  internal:
    driver: bridge

volumes:
  dbdata:
  uploads:
```

### `.env` (modelo)
```env
# Porta única exposta
APP_PORT=8080

# App
APP_ENV=production
APP_URL=https://kite360.exemplo.com
JWT_SECRET=troque-isto

# Banco
POSTGRES_USER=kite360
POSTGRES_PASSWORD=troque-isto
POSTGRES_DB=kite360
DATABASE_URL=postgres://kite360:troque-isto@db:5432/kite360

# Redis
REDIS_URL=redis://redis:6379

# E-mail (Resend + fallback)
RESEND_API_KEY=
EMAIL_FROM=no-reply@kite360.exemplo.com
EMAIL_FALLBACK_ENABLED=true
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Uploads locais
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_MB=15

# Cloudflare Turnstile (captcha)
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Mapas (open source - sem chave Google)
MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

---

## 3. Geração de Telas via Google Stitch (MCP)

> **Regra:** Para **cada tela/página** abaixo, primeiro acione o MCP do Google Stitch no Antigravity 2.0 para gerar o design. Depois implemente o componente com base no resultado.

Telas mínimas a gerar no Stitch:

**Públicas / Auth**
- Home (vitrine de anúncios + busca + banners)
- Listagem/Resultados de busca (com filtros)
- Página de anúncio (detalhe do produto)
- Login / Cadastro (com Turnstile)
- Recuperação de senha

**Usuário logado**
- Dashboard do usuário
- Criar/editar anúncio (com **TipTap** na descrição + upload de imagens)
- Meus anúncios (gerenciamento)
- Chat interno
- Perfil público do vendedor (com reputação/avaliações)
- Configurações de conta / Verificação (selo de segurança)

**Monetização / Admin**
- Tela de destaque/patrocínio de anúncio
- Tela de assinatura/planos
- Painel administrativo (moderação, banners, usuários, denúncias)
- Gestor de banners publicitários (upload, agendamento, rotação, espaços premium)

Para cada uma: manter identidade visual coerente com a logomarca (que ainda passará por ajustes) e o estilo das peças definido pela Mix Comunicação.

---

## 4. Funcionalidades Principais (Marketplace estilo OLX/Mercado Livre)

### 4.1 Cadastro e Perfis
- Cadastro de usuário com e-mail verificado (via Resend), perfil personalizado.
- Tipos de perfil: comprador, vendedor (pode ser o mesmo), e futuramente lojista.
- **Selo de verificação/segurança** (monetizável): KYC leve, validação de documento/telefone.

### 4.2 Anúncios
- Publicação e gerenciamento de anúncios.
- Campos: título, categoria (kitesurf, wingfoil, kitefoil, kitewave, acessórios…), marca, modelo, estado (novo/usado), condição, preço, localização, fotos, descrição.
- **Descrição via TipTap** (WYSIWYG), permitindo formatação e inserção de imagens.
- Upload de múltiplas imagens, **armazenadas localmente** (volume Docker), com geração de thumbnails.
- Status do anúncio: rascunho, ativo, pausado, vendido, expirado, em moderação.

### 4.3 Busca e Filtros
- Busca avançada por categoria, marca, localização, modalidade, faixa de preço, condição.
- Ordenação: relevância, mais recentes, menor/maior preço.
- Anúncios patrocinados/destaque aparecem priorizados (marcados como "Patrocinado").

### 4.4 Chat Interno (com bloqueio de contato externo)
- Chat entre comprador e vendedor dentro da plataforma.
- **REGRA CRÍTICA:** Bloquear envio de:
  - Números de telefone (qualquer formato, incluindo por extenso ou com separadores)
  - E-mails
  - Links externos / URLs
  - Handles de redes sociais (@, WhatsApp, Instagram, Telegram etc.)
- Implementar via filtros (regex + heurística) **no backend** (não confiar só no front).
- Mensagens com tentativa de troca de contato: mascarar/bloquear e registrar para moderação. Avisos automáticos ao usuário ("Por segurança, não compartilhe contato fora da plataforma").
- Logar tentativas reincidentes para o painel admin (possível penalização).

### 4.5 Avaliações e Reputação
- Sistema de notas + comentários após negociação.
- Reputação exibida no perfil público do vendedor.
- Bloquear avaliações sem transação/interação real (anti-fraude básico).

### 4.6 Segurança e Verificação
- Área de segurança: dicas, denúncia de anúncio/usuário, status de verificação.
- Selo visível em anúncios de vendedores verificados.

### 4.7 Pagamentos (fase futura)
- Estrutura preparada para intermediação de pagamento e comissão sobre vendas.
- Inicialmente, deixar o módulo desacoplado (interface de gateway) para plugar depois.

### 4.8 Integração com Comunidades
- Integração/divulgação com grupos e comunidades do WhatsApp (links de divulgação premium controlados pela plataforma — **não confundir** com troca de contato no chat).

---

## 5. Monetização

Implementar múltiplas fontes de receita:

1. **Selo de segurança/verificação** — pago, para usuários/vendedores.
2. **Anúncios em destaque / tráfego pago interno** — impulsionamento de anúncios.
3. **Banners publicitários** (ver seção 6) — venda de espaço para marcas.
4. **Divulgação premium** em grupos/comunidades de WhatsApp.
5. **Comissão** sobre vendas realizadas pela plataforma (fase de pagamentos).
6. **Assinatura/Taxa anual de adesão** — acesso a recursos exclusivos.

Cada modalidade deve ter: registro de transação, status, validade e refletir nos privilégios do usuário/anúncio.

---

## 6. Sistema de Banners Publicitários

> Requisito do cliente (Denilson / Mix Comunicação): além do tráfego pago interno, vender espaços para grandes marcas — do esporte e de ramos ligados (imobiliárias, pousadas, hotéis, corretores, restaurantes, bares). **Sem poluir.** Banners rotativos e poucos espaços premium (mais caros).

### Requisitos
- **Poucos slots fixos**, posicionados sem poluir a interface (ex.: topo, lateral, entre blocos de listagem).
- **Rotação automática** de banners por slot (varia entre vários anunciantes).
- **Slots premium** = exclusivos / sem rotação (mais caros).
- Gestor admin de banners: upload de imagem, link de destino, segmentação (categoria/local), agendamento (início/fim), peso/prioridade, limite de impressões.
- Métricas: impressões e cliques por banner.
- Banners também salvos **localmente** (mesmo padrão de uploads).
- Responsivo (web e app).

### Estrutura de dados (sugestão)
```
ad_slot        (id, nome, posicao, premium: bool, max_rotacao)
ad_campaign    (id, anunciante, segmento, inicio, fim, ativo)
ad_banner      (id, campaign_id, slot_id, imagem_path, link, peso,
                impressoes, cliques, status)
```

---

## 7. E-mail (Resend + Fallback)

- Provedor principal: **Resend** (`RESEND_API_KEY`).
- **Fallback automático:** quando a cota da Resend acabar (ou retornar erro de limite), o sistema deve enviar usando o **SMTP do próprio servidor** (`SMTP_*`).
- Implementar como serviço de e-mail com estratégia de provider:
  1. Tenta Resend.
  2. Se cota esgotada / falha de limite → usa SMTP local.
  3. Loga qual provider foi usado.
- E-mails transacionais: verificação de conta, recuperação de senha, notificações de anúncio/chat, confirmações de pagamento/assinatura.
- Enfileirar envios via worker (Redis) para não travar requisições.

---

## 8. Uploads / Armazenamento Local

- Imagens e arquivos **salvos localmente** em volume Docker (`UPLOAD_DIR`).
- Estrutura organizada por tipo: `/uploads/anuncios/{id}/...`, `/uploads/banners/...`, `/uploads/perfis/...`.
- Gerar thumbnails/variações para performance.
- Validar: tipo MIME, tamanho (`MAX_UPLOAD_MB`), extensão.
- Servir estáticos pelo proxy interno (cache).
- Não usar storage de nuvem pago — manter local.

---

## 9. Mapas (Open Source — sem Google)

- Usar **Leaflet** ou **MapLibre GL** com tiles do **OpenStreetMap** (`MAP_TILE_URL`).
- **Proibido** usar Google Maps API (evitar custo).
- Usos: localização do anúncio (aproximada, por segurança), filtro por região, mapa do evento KITE360º (presencial).
- Geocoding open source (ex.: Nominatim) se necessário — respeitando limites de uso ou self-host.

---

## 10. Captcha (Cloudflare Turnstile)

- Usar **Cloudflare Turnstile** em: cadastro, login, recuperação de senha, publicação de anúncio e formulários públicos/contato.
- Validar o token **no backend** com `TURNSTILE_SECRET_KEY`.
- Bloquear ação se a validação falhar.

---

## 11. TipTap (WYSIWYG)

- Usar **TipTap** nas áreas de texto (descrição de anúncio e onde houver conteúdo rico).
- Funcionalidades: formatação básica (negrito, itálico, listas, títulos), inserção de imagens (upload local), links **controlados** (atenção: na descrição pública, avaliar política de links para não virar brecha de contato externo — preferir sanitização/whitelist).
- Sanitizar o HTML gerado antes de salvar/renderizar (evitar XSS).

---

## 12. Regras de Segurança Gerais

- Sanitização de todo conteúdo gerado pelo usuário (anúncios, chat, perfil).
- Rate limiting em endpoints sensíveis (login, cadastro, chat, publicação).
- Validação de Turnstile no backend.
- Filtro anti-contato no chat (seção 4.4) aplicado server-side.
- Moderação: fila de anúncios/usuários denunciados no painel admin.
- Logs de auditoria para ações administrativas.
- Senhas com hash forte (Argon2/bcrypt). JWT/refresh com expiração.

---

## 13. Painel Administrativo

- Gestão de usuários (banir, verificar, conceder selo).
- Moderação de anúncios e denúncias.
- Gestor de banners e campanhas (seção 6).
- Gestão de planos/assinaturas e destaques.
- Métricas: anúncios ativos, receita por fonte, impressões/cliques de banners, tentativas bloqueadas no chat.

---

## 14. Evento Presencial KITE360º (módulo opcional / landing)

Há também o evento presencial **KITE360º** (encontro de kitesurf no Norte/Nordeste). Prever uma **landing page/seção** dentro da plataforma para divulgação do evento:
- Programação (downwinds, palestras, painéis, demo day, shows, ativações).
- Expositores/marcas patrocinadoras (reaproveitar sistema de banners/patrocínio).
- Mapa do local (mapa open source).
- Inscrição/contato (com Turnstile).

> Tratar como módulo separado e desativável por env/flag, já que o foco principal é o marketplace.

---

## 15. Ordem Sugerida de Implementação

1. Infra: `docker-compose.yml`, `.env`, proxy com porta única, db, redis.
2. Auth + cadastro + verificação de e-mail (Resend + fallback) + Turnstile.
3. CRUD de anúncios + upload local + TipTap.
4. Busca/filtros + listagem + página de anúncio.
5. Chat interno **com filtro anti-contato**.
6. Avaliações/reputação + selo de verificação.
7. Monetização: destaques + assinaturas.
8. Sistema de banners + painel admin.
9. Mapas open source.
10. Apps mobile (consumindo a mesma API).
11. Módulo do evento (opcional).

> Lembrete final: **cada tela deve ser gerada primeiro no Google Stitch via MCP** no Antigravity 2.0, mantendo a identidade visual da Mix Comunicação. Manter a interface limpa — publicidade presente, porém **sem poluir**.
