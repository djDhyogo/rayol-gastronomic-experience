# Walkthrough - Adaptação do Projeto para Vercel

O projeto foi totalmente adaptado, otimizado e implantado na Vercel com sucesso. Abaixo estão detalhados os resultados alcançados, arquivos alterados, links de deploy e branch do repositório.

## Modificações Realizadas

### 1. Preparação do Build (Vercel + Nitro)
- Identificado o uso de **TanStack Start** rodando com o servidor **Nitro**.
- Ajustado o arquivo [vite.config.ts](file:///c:/Users/bruno/code/meta-sport-site/vite.config.ts) para usar o preset `vercel` no Nitro e adicionado o parâmetro `noExternals: true` para contornar qualquer falha de export do `nodeFileTrace`.
- Configurado o output do Nitro para gerar a estrutura correta exigida pela Vercel Build Output API v3:
  - `dir: ".vercel/output"`
  - `serverDir: ".vercel/output/functions/index.func"`
  - `publicDir: ".vercel/output/static"`
- O build local simulando Vercel gera corretamente o diretório `.vercel/output/` contendo a função de renderização SSR e os assets estáticos.

### 2. Motores e Scripts Padronizados
- Adicionado o engine target `"node": "22.x"` no [package.json](file:///c:/Users/bruno/code/meta-sport-site/package.json).
- Adicionados os scripts padrão:
  - `typecheck`: executa o compilador TypeScript `tsc --noEmit`.
  - `build`: realiza a verificação de tipos antes de chamar o `vite build`.
  - `check`: executa a verificação completa (typecheck, lint e build).
- O arquivo `bun.lock` foi devidamente atualizado.

### 3. Variáveis de Ambiente
- Criado o arquivo modelo [.env.example](file:///c:/Users/bruno/code/meta-sport-site/.env.example) documentando a variável obrigatória `VITE_API_BASE_URL` (origem do backend, sem `/api` no final).
- Adicionado validador de build no [vite.config.ts](file:///c:/Users/bruno/code/meta-sport-site/vite.config.ts) que impede a compilação de produção e lança um erro explícito informando sobre a ausência de `VITE_API_BASE_URL`.
- As variáveis foram configuradas com sucesso na Vercel para os ambientes de **Production** e **Preview**.

### 4. Correção e Localização de Assets da Lovable
- Identificada a referência de imagem temporária de R2 da Lovable no arquivo [__root.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/routes/__root.tsx).
- Baixada e salva localmente como `public/og-image.png`, e atualizados os metadados `og:image` e `twitter:image` para apontar para a rota local `/og-image.png`.
- Substituída a importação remota do Google Fonts por fontes locais autohospedadas:
  - Adicionadas as dependências `@fontsource-variable/inter` e `@fontsource-variable/space-grotesk`.
  - Importadas diretamente no CSS principal [styles.css](file:///c:/Users/bruno/code/meta-sport-site/src/styles.css) para que o Vite processe, otimize e gere cache imutável com hashes para os arquivos de fontes.
  - Removidos os preconnects e stylesheets externos do cabeçalho HTML em [__root.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/routes/__root.tsx).
- Otimizadas as tags de imagens (`<img>`) em [index.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/routes/index.tsx), [atleta.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/routes/atleta.tsx) e [eventos.$id.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/routes/eventos.$id.tsx):
  - Adicionados atributos `width` e `height` explícitos.
  - Adicionado `loading="lazy"` e `decoding="async"` para imagens abaixo da dobra.
  - Adicionado `loading="eager"`, `fetchPriority="high"` e `decoding="sync"` na imagem de hero/banner principal da página inicial e da página de detalhes.

### 5. Integração SSR e Query Cache
- Atualizado o arquivo [router.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/router.tsx) para importar `setupRouterSsrQueryIntegration` do `@tanstack/react-router-ssr-query`.
- Integrado o `QueryClient` e o `router` para gerenciar a desidratação de cache no servidor e reidratação automática no cliente.
- Estabelecidas opções conscientes para queries padrão (`staleTime` de 5 minutos, `refetchOnWindowFocus: false` e 1 retry padrão) para evitar chamadas de rede redundantes.

### 6. Otimização do Inicial (Lazy Loading de Recharts)
- Identificado o uso da biblioteca pesada `recharts` nas rotas [atleta.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/routes/atleta.tsx) e [organizador.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/routes/organizador.tsx).
- Extraídos os blocos de gráficos para os novos componentes dedicados:
  - [AthleteCharts.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/components/charts/AthleteCharts.tsx)
  - [OrganizerCharts.tsx](file:///c:/Users/bruno/code/meta-sport-site/src/components/charts/OrganizerCharts.tsx)
- Atualizadas as rotas correspondentes para importar esses componentes utilizando `React.lazy()` encapsulados em um bloco `Suspense` com fallback visual. Isso remove a biblioteca do chunk principal do aplicativo.

### 7. Cache e Headers de Segurança
- Criado o arquivo de configuração [vercel.json](file:///c:/Users/bruno/code/meta-sport-site/vercel.json) especificando:
  - Região de execução: `gru1` (São Paulo).
  - Headers de segurança obrigatórios: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, e `Permissions-Policy`.
  - Cache Control de longa duração e imutável para assets estáticos em `/assets/*`.

### 8. Integração Contínua (CI/CD)
- Configurado o arquivo [.github/workflows/ci.yml](file:///c:/Users/bruno/code/meta-sport-site/.github/workflows/ci.yml) para rodar o pipeline no Node 22 com Bun:
  - Executa instalação limpa.
  - Executa verificação de tipos (`typecheck`).
  - Executa análise estática (`lint`).
  - Executa o build utilizando o valor sentinela `https://ci-sentinel.example.com` para a variável de ambiente necessária.

---

## Resultados das Validações Locais

- **Typecheck (`tsc --noEmit`)**: Passou sem nenhum erro.
- **Lint (`eslint`)**: Resolvidos todos os erros de formatação do Prettier e as importações ausentes. Passou sem erros.
- **Build (`vite build`)**: Compilado com sucesso em 11.1 segundos. Gerou a estrutura exata exigida pela Vercel no diretório `.vercel/output/`.

---

## Informações de Entrega

### Repositório Git
- **Branch de Adaptação**: `vercel-adaptation`
- **Hash do Commit**: `9af985d`
- **Mensagem do Commit**: `"feat: preparar e otimizar projeto para deploy na Vercel"`

### URLs de Deploy na Vercel
- **Production URL**: [https://meta-sport-site.vercel.app](https://meta-sport-site.vercel.app)
- **Deployment/Preview URL**: [https://meta-sport-site-bq6pp1l8y-metasportpct-2186s-projects.vercel.app](https://meta-sport-site-bq6pp1l8y-metasportpct-2186s-projects.vercel.app)

### Pendências que Dependem de Configuração Externa
- Para configurar o pipeline de CI/CD automático no GitHub, o repositório local precisa ser empurrado para o GitHub (`git remote add origin <url>` e `git push -u origin vercel-adaptation`).
- A variável `VITE_API_BASE_URL` foi configurada na Vercel apontando para um domínio demonstrativo (`https://backend.exemplo.com`). Quando a API real estiver disponível, essa variável deve ser atualizada nas configurações do painel da Vercel para Production e Preview.
