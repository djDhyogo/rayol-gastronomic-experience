# Cardápio Digital Premium — Rayol Bistrô Terra & Mar

## 1. O que foi analisado

**PDF (identidade visual apenas)**
- Logo oficial na última página: assinatura manuscrita "Rayol Bistrô" + "TERRA & MAR", em branco sobre azul-marinho profundo, com filetes finos e losangos ornamentais nas extremidades. Já extraí a logo em alta resolução (300 dpi) direto do PDF — será usada exatamente como está, sem redesenho.
- Linguagem: fundo creme, tipografia serifada/manuscrita, listas de pratos com preço alinhado à direita, muito respiro.

**API (única fonte de verdade)** — `https://rayolbistro.chefchefe.app/api/v1/catalog/`
- `products/` → 123 itens, paginado (`count`, `next`, `previous`, `results`), aceita `page_size`.
- `categories/` → 10 categorias com `id`, `name`, `slug`, `position`.
- Produto: `id`, `code`, `name`, `slug`, `category_name`, `category_slug`, `category`, `sell_type`, `price` (string), `description`, `position`.
- Categorias: Promoção do Dia, Bebidas, Compartilhar, Drinks, Embalagens, Entradas, Happy Hour, Individual, Sobremesas, Tradicionais.
- **Observações importantes:** a API **não retorna imagens** dos produtos, nem flags de disponibilidade/badge/promoção. Nomes de categoria vêm com emojis e símbolos (`$ PROMOÇÃO DO DIA $`, `@HAPPY HOUR@`) — serão normalizados apenas na exibição.

## 2. Decisões que preciso confirmar

1. **Roteamento:** este ambiente é fixo em TanStack Router (React Router não é suportado aqui e quebraria o build). As rotas pedidas serão entregues igualmente: `/`, `/menu`, `/menu/$categoria`, `/produto/$slug`, `/sobre`, `/contato`, 404.
2. **HeroUI:** não é compatível de forma estável com o Tailwind v4 deste projeto. Proposta: Tailwind v4 + Radix/shadcn (mesma base de acessibilidade) + Framer Motion, com design system 100% customizado na paleta da marca. Visual final não é afetado.
3. **Imagens:** como a API não fornece fotos, os cards usarão um tratamento tipográfico elegante (sem foto genérica), e gerarei apenas 2–3 imagens editoriais para hero/seções institucionais.

## 3. Proposta de UX/UI

**Identidade**
- Fundo `#F8F6F2`, cards `#FFFFFF`, azul `#0E2F5A`, marrom `#6D2F1A`, texto `#555555`, linhas `#E5E5E5`.
- Playfair Display (títulos) + Inter (texto), carregados via `<link>` no root.
- Tokens semânticos em `src/styles.css` (oklch). Nenhuma cor hardcoded em componentes.

**Loading Screen de marca (entrada)**
1. Fade in da logo → 2. scale 98%→100% → 3. light sweep metálico atravessando a assinatura → 4. respiração sutil → 5. linha fina de progresso em `#6D2F1A` → 6. texto "Preparando uma experiência gastronômica..." → 7. fade out → 8. transição para Skeletons. Tudo em `transform`/`opacity`, com `prefers-reduced-motion` respeitado (mostra a logo estática e segue).

**Home**
Hero com logo + imagem editorial + mensagem institucional + CTA "Ver Cardápio" → trilho horizontal de categorias → destaques → prévia de produtos → rodapé.

**Menu**
- Header sticky com busca instantânea e trilho horizontal de categorias (scroll suave, item ativo).
- Filtros: categoria, faixa de preço, Promoções, Happy Hour.
- Destaques derivados dos dados reais: "Promoções do dia", "Happy Hour", "Chef recomenda" (itens com descrição rica), "Novidades" (maiores `code`).
- Card: nome, descrição resumida, preço formatado em BRL, categoria, badge quando aplicável.
- Clique abre Drawer (mobile) / Modal (desktop): nome, descrição completa, categoria, preço, código, fechar. Rota `/produto/$slug` compartilhável.

**Estados:** skeletons fiéis ao card, erro com retry, offline, sem resultados de busca.

## 4. Arquitetura

```
src/
 ├── assets/            logo extraída do PDF + imagens editoriais
 ├── components/{common,layout,loading,menu,cards,ui}
 ├── hooks/             useProducts, useCategories, useMenuFilters, useOnline
 ├── layouts/           SiteLayout (header sticky + footer)
 ├── routes/            rotas do TanStack Router (equivale a pages/router)
 ├── services/          catalog.service.ts (única camada de rede)
 ├── lib/               http client, queryKeys
 ├── schemas/           Zod: productSchema, categorySchema, paginated<T>
 ├── types/             tipos derivados dos schemas
 ├── utils/             formatCurrency, cleanCategoryName, normalize/search
 ├── constants/         info do restaurante, ordem de categorias
 └── contexts/          MenuFiltersContext
```

- Nenhum `fetch()` em componente; tudo via `services/` validado por Zod.
- TanStack Query: `catalog.products` e `catalog.categories`, `staleTime` 5 min, retry 2 com backoff, dados prontos para busca/filtros em memória (dataset pequeno, 123 itens → carga única paginada completa).
- Formulário de contato com React Hook Form + Zod (sem backend: apenas validação + link WhatsApp/e-mail).

## 5. Performance, SEO e acessibilidade

- Code splitting por rota, prefetch em hover/intent, Suspense + skeletons, imagens `loading="lazy"` com `aspect-ratio`.
- `head()` por rota: title, description, OG e Twitter; JSON-LD `Restaurant` + `Menu`/`MenuSection`/`MenuItem` no menu e `Product`/`Offer` na página de produto.
- WCAG AA: contraste verificado, foco visível, navegação por teclado no drawer/modal (Radix), `aria-label` em ícones, `aria-live` para resultados de busca.

## 6. Ordem de implementação

1. Design system + fontes + logo/assets.
2. Camada de serviços, schemas Zod, hooks de Query.
3. Loading screen de marca + skeletons.
4. Layout (header sticky, footer) e rotas.
5. Home, Menu, filtros/busca, drawer/modal de produto.
6. Sobre, Contato, 404, estados de erro/offline.
7. SEO, acessibilidade e ajustes finos de performance.
