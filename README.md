# Valorizarte — Next.js + Sanity

Reconstrução do site institucional [valorizarte.com.br](https://valorizarte.com.br) (hoje em WordPress) em Next.js, com um CMS (Sanity) embutido no próprio app para o Gilvan editar o blog, depoimentos, logos, galeria e páginas institucionais sozinho, e um cadastro de newsletter funcional de ponta a ponta.

Este projeto **já roda sem nenhuma configuração** — `npm install && npm run dev` funciona imediatamente, usando conteúdo semente (`src/content/seed.ts`) com textos reais coletados do site atual. Quando você criar o projeto Sanity de verdade e preencher o `.env.local`, o site passa a usar o conteúdo do CMS automaticamente, sem mudar nenhum código.

## 1. Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. A rota `/studio` também funciona sem configuração — ela vai mostrar uma tela pedindo o Project ID assim que você tentar logar, o que é esperado antes do passo 2.

## 2. Criando o projeto Sanity real

Isso é algo que **você** (ou o Gilvan) deve fazer, para que o projeto e todo o conteúdo fiquem na conta dele, não na sua — evita ficar de intermediário obrigatório no futuro.

```bash
npx sanity init
```

Escolha "Create new project", dê o nome que quiser (ex: "Valorizarte"), dataset `production`. O comando vai perguntar se quer usar a configuração já existente (`sanity.config.ts`) — diga que sim.

Depois, copie `.env.local.example` para `.env.local` e preencha:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` e `NEXT_PUBLIC_SANITY_DATASET` — aparecem no terminal depois do `sanity init`, ou em manage.sanity.io.
- `SANITY_API_WRITE_TOKEN` — crie em manage.sanity.io → seu projeto → API → Tokens → "Add API token", com permissão **Editor**. Guarde esse valor com cuidado, ele não aparece de novo depois de criado.
- `SANITY_REVALIDATE_SECRET` — qualquer string aleatória forte, por exemplo gerada com `openssl rand -hex 32`.

Rode `npm run dev` de novo e acesse `/studio` — agora deve abrir o painel de verdade, pedindo login (Google, GitHub ou e-mail).

## 3. Populando o conteúdo

Duas fontes, dependendo do tipo de conteúdo:

**Blog** — rode a migração automática, que puxa todos os posts reais do WordPress via a REST API dele e sobe pro Sanity:

```bash
npm run migrate
```

O script é idempotente (pode rodar de novo sem duplicar nada) e está documentado em `scripts/migrate-wp.ts`. **Importante:** ele não pôde ser testado de ponta a ponta contra o site de produção no ambiente onde este projeto foi montado (um sandbox com acesso de rede restrito) — rode primeiro contra um dataset de teste e confira uns 3-4 posts publicados manualmente antes de rodar contra produção. O corpo dos posts que inspecionei veio limpo (sem contaminação de Elementor/Kadence), o que é uma boa notícia, mas vale a conferência.

**Tudo o resto** (depoimentos, logos de clientes, galeria, serviços, páginas institucionais, configurações do site, menu) — é cadastrado manualmente pelo Studio (`/studio`), com a interface já em português e organizada por assunto. Não há como automatizar isso porque esse conteúdo vive dentro de templates do Elementor no site atual e não é recuperável via API de forma confiável (ver seção 5).

## 4. Cadastro de newsletter

Já está funcionando de ponta a ponta: formulário (`src/components/NewsletterForm.tsx`) → Server Action com validação e honeypot anti-spam (`src/lib/actions/newsletter.ts`) → gravação no Sanity como um documento `newsletterSubscriber` (`src/lib/newsletter.ts`).

Isso dá uma lista real, visível e exportável dentro do próprio Studio (menu "Inscritos na newsletter"), **sem depender de já ter escolhido** uma ferramenta de e-mail marketing — o cadastro funciona desde o primeiro clique. Quando vocês decidirem qual ferramenta usar para efetivamente *enviar* e-mails (Mailchimp, MailerLite, RD Station, ou continuar com algo como o MailPoet que o WordPress atual já usa), a integração entra num único lugar: `src/lib/newsletter.ts`. Nenhum outro arquivo precisa mudar.

O que falta para ficar 100% equivalente ao que existe hoje: o site atual (via MailPoet) envia um e-mail de confirmação de inscrição (double opt-in) — percebi isso ao inspecionar o texto real da página `/quemsomos/`, que reaproveita um formulário de newsletter com a mensagem "verifique sua caixa de entrada... para confirmar sua assinatura". Este projeto ainda não envia esse e-mail de confirmação (isso depende de qual ferramenta de envio for escolhida, item do parágrafo acima).

## 5. Duas descobertas importantes durante a pesquisa

**A página `/quemsomos/` do site atual nunca foi preenchida** — ainda mostra o texto de exemplo padrão do WordPress ("Esta é uma página de exemplo... Como um novo usuário do WordPress, você deve..."). Por isso, neste projeto, essa página está deliberadamente vazia no conteúdo semente: inventar um texto institucional seria colocar palavras na boca do cliente sem ele revisar. É a única peça de conteúdo do site inteiro que precisa ser **escrita**, não migrada — vale um retorno de vocês para o Gilvan escrever (ou gravar em áudio e eu transcrevo/organizo) esse texto antes do go-live.

**O corpo dos posts do blog vem limpo**, sem contaminação de Elementor/Kadence — o construtor de página parece ter sido usado só nas páginas institucionais (Quem Somos, Para Empresas, etc.), não no editor de posts. Isso é uma boa notícia para a migração automática, mas também confirma que as páginas institucionais realmente precisam ser recriadas manualmente no Studio (não dá para puxar da API de forma confiável), com o texto real que aparece na tela do site publicado.

## 6. O que este projeto NÃO decide por você

- **Descrições dos 10 serviços** (Conselho Consultivo, Coaching, etc.) em `src/content/seed.ts` são rascunhos genéricos escritos a partir do nome de cada serviço — não são o texto real do site (inacessível via API pelo motivo acima). Revise e reescreva pelo Studio antes de publicar.
- **Política de Privacidade**: o texto em `src/content/seed.ts` é a versão real do site atual, com um ajuste — troquei a menção nominal ao "MailPoet" por uma redação genérica ("ferramentas de e-mail marketing"), já que o processador de dados muda com a migração. Isso é uma mudança de fundo jurídico, não só de redação: vale uma revisão (idealmente com quem cuida do jurídico, ainda que informalmente) antes de publicar.
- **Hospedagem**: este código roda tanto na Vercel quanto em qualquer hospedagem Node.js (incluindo o plano Hostinger que vocês estão avaliando) — nenhuma decisão de hospedagem está amarrada no código.

## Scripts disponíveis

```bash
npm run dev        # ambiente de desenvolvimento
npm run build      # build de produção (testado com sucesso neste projeto)
npm run start      # roda o build de produção localmente
npm run lint       # ESLint
npm run migrate    # migração de posts do WordPress para o Sanity
```

## Estrutura do projeto

```
src/
  app/                    # rotas (App Router)
    [slug]/               # posts e páginas institucionais na raiz (preserva URLs do WP)
    empresas/[slug]/      # as 10 páginas de serviço
    blog/                 # listagem do blog
    midia/                # estrutura inicial da seção Mídia
    studio/[[...tool]]/   # Sanity Studio embutido
    api/revalidate/       # webhook de revalidação sob demanda
  components/             # componentes de UI
  content/seed.ts          # conteúdo real/rascunho usado até o Sanity estar populado
  lib/data.ts              # camada de dados (Sanity com fallback pro seed)
  lib/newsletter.ts         # ponto único de integração do cadastro de newsletter
  sanity/schemaTypes/       # todos os schemas do Studio, em português
scripts/migrate-wp.ts       # migração automática de posts do WordPress
```
