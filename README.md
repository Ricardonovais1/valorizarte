# Valorizarte — Next.js + Sanity

Reconstrução do site institucional [valorizarte.com.br](https://valorizarte.com.br) (hoje em WordPress) em Next.js, com um CMS (Sanity) embutido no próprio app para o Gilvan editar o blog, depoimentos, logos, galeria e páginas institucionais sozinho, e um cadastro de newsletter funcional de ponta a ponta.

Este projeto **já roda sem nenhuma configuração** — `npm install && npm run dev` funciona imediatamente, usando conteúdo semente (`src/content/seed.ts`) com textos reais coletados do site atual. Quando você criar o projeto Sanity de verdade e preencher o `.env.local`, o site passa a usar o conteúdo do CMS automaticamente, sem mudar nenhum código.

## 1. Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

O painel do Sanity (Studio) **não** fica embutido no Next — ele roda separado, com `npm run studio:dev` (abre em http://localhost:3333). Antes do passo 2, ele vai pedir o Project ID, o que é esperado.

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

Rode `npm run studio:dev` de novo — agora deve abrir o painel de verdade, pedindo login (Google, GitHub ou e-mail).

## 3. Populando o conteúdo

Duas fontes, dependendo do tipo de conteúdo:

**Blog** — os 21 posts do WordPress **já estão importados** e no ar, sem depender do Sanity. Quem faz isso é:

```bash
npm run import:blog
```

Ele baixa as imagens para `public/images/blog/` (otimizadas: teto de 1600px e JPEG quando não há transparência — as originais somavam 61 MB, ficaram em 5,3 MB) e gera `src/content/blogPosts.ts`, que a camada de dados serve como conteúdo semente. Rode de novo sempre que o Gilvan publicar um post novo lá.

Para levar o mesmo conteúdo ao Sanity, quando o projeto estiver criado:

```bash
npm run migrate -- --dry-run          # confere a conversão sem gravar nada (não precisa de credencial)
npm run migrate -- --dataset=staging  # ensaio num dataset separado
npm run migrate                       # produção
```

Os dois scripts usam a **mesma** conversão de HTML para Portable Text (`scripts/lib/wordpress.ts`), então o conteúdo no Studio sai idêntico ao que já está no ar: títulos, listas aninhadas, negrito, itálico, sublinhado, links e as imagens dentro do texto — que sobem como assets e viram blocos de imagem, editáveis pelo Studio como qualquer outra. O `--dry-run` confirma isso: 910 blocos e 24 imagens no corpo pelos dois caminhos.

A migração é idempotente (cada post e categoria tem `_id` derivado do ID do WordPress, e cada imagem sobe uma vez só por URL de origem), então pode rodar quantas vezes quiser. Ainda assim, rode o `--dataset=staging` primeiro e confira uns 3-4 posts no Studio antes de ir para produção.

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
- **Hospedagem**: decidido — Cloudflare Workers, de graça. Ver seção 7 para a comparação e o passo a passo. O código não ficou amarrado a isso: continua rodando em qualquer hospedagem Node.js (Vercel, Hostinger, etc.) se um dia vocês quiserem trocar.

## 7. Hospedagem: Cloudflare Workers (grátis)

### Por que Cloudflare

Comparado com Vercel Pro (~R$110/mês) ou AWS (~R$3-4/mês, mas com um dia de configuração — Route 53 pago para apontar o domínio raiz, EC2/Amplify, certificado, etc.), a Cloudflare sai de graça:

- **Plano gratuito do Workers**: 100 mil requisições/dia (~3 milhões/mês) que executam código no servidor. Arquivos estáticos (imagens, CSS, JS) são ilimitados e **não contam** nessa cota.
- **Sem cobrança de transferência de dados** (egress), em nenhum plano — nem no pago.
- **DNS, certificado SSL, CDN e proteção contra DDoS**: grátis.
- **Domínio .com.br**: continua registrado no Registro.br; só os *nameservers* apontam para a Cloudflare. Resolve de brinde o problema de apontar o domínio raiz para a hospedagem, que na AWS exigiria o Route 53 pago.

Sobre uso comercial (o ponto que gera mais dúvida): a antiga cláusula dos termos de serviço que gerava a confusão sobre conteúdo "HTML vs. não-HTML" foi aposentada em 2023. O que resta de restrição no plano gratuito vale só para o CDN servindo vídeo/arquivos grandes hospedados fora da Cloudflare — não é o caso de um site institucional com blog. É diferente da Vercel, cujos termos tratam receber pagamento para criar/hospedar um site como uso comercial, o que exige plano pago.

O adaptador usado é o [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare), que cobre tudo que este projeto usa: App Router, Server Actions (cadastro de newsletter), ISR/revalidação sob demanda (publicação instantânea de posts), Route Handlers (webhook) e Next.js 16.

### O teste do tamanho do Worker (já feito)

O Worker tem limite de tamanho comprimido: **3 MiB no plano gratuito**, 10 MiB no plano pago (US$ 5/mês). O risco identificado antes de decidir foi o Sanity Studio embutido em `/studio` — ele carrega os schemas e plugins do editor junto com o resto do app.

Testado neste projeto (`npx wrangler deploy --dry-run`):

| Configuração | Tamanho comprimido |
|---|---|
| App completo **com** `/studio` embutido | 4,37 MiB — **passa** do limite grátis |
| App **sem** `/studio` embutido | 1,49 MiB — folga confortável no limite grátis |

Ou seja: o Studio embutido por si só usa quase 2,9 MiB do orçamento de 3 MiB. Por isso a decisão abaixo.

### Decisão: Studio hospedado pelo próprio Sanity, não embutido

Em vez de manter `/studio` dentro do Next (o que exigiria o plano pago de US$ 5/mês só por causa do tamanho), o Studio foi tirado do app e passa a ser hospedado de graça pelo próprio Sanity, com `npm run studio:deploy`. O Gilvan acessa em **valorizarte.sanity.studio** em vez de `valorizarte.com.br/studio`. Perde-se um pouco de charme no endereço, mas o Worker do site fica pequeno e leve, e continua tudo custando R$ 0,00/mês.

(Alternativa, se um dia preferirem o painel no mesmo domínio: reintroduzir uma rota `/studio` com `NextStudio` — ver histórico do git para o código removido — e assinar o Workers Paid a US$ 5/mês. Ainda sairia ~4x mais barato que a Vercel Pro.)

### Passo a passo do deploy

**Pré-requisitos**, uma vez só:

1. Conta gratuita na Cloudflare ([dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)).
2. No domínio `valorizarte.com.br` no Registro.br, trocar os *nameservers* pelos que a Cloudflare indicar ao adicionar o site no painel dela (Websites -> Add a site).
3. Login do wrangler na máquina que vai fazer o deploy:
   ```bash
   npx wrangler login
   ```
4. Criar os recursos que o Worker usa (nomes já configurados em `wrangler.jsonc`):
   ```bash
   npx wrangler r2 bucket create valorizarte-cache
   npx wrangler d1 create valorizarte-tag-cache
   ```
   O segundo comando imprime um `database_id` — copie e cole em `wrangler.jsonc`, no campo `database_id` de `d1_databases` (está com o placeholder `<PREENCHER_APOS_WRANGLER_D1_CREATE>`).
5. Configurar as variáveis de ambiente do Worker (os mesmos valores do `.env.local`, ver seção 2):
   ```bash
   npx wrangler secret put SANITY_API_WRITE_TOKEN
   npx wrangler secret put SANITY_REVALIDATE_SECRET
   npx wrangler secret put BREVO_API_KEY
   ```
   As variáveis públicas (`NEXT_PUBLIC_*`) e as demais não sensíveis (`BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `NEXT_PUBLIC_SITE_URL`) podem ir direto em `wrangler.jsonc` num bloco `"vars"`, já que não são segredo.
6. Publicar o Studio (grátis, na infraestrutura do Sanity):
   ```bash
   npm run studio:deploy
   ```

**Deploy do site** (repete a cada atualização):

```bash
npm run cf:deploy
```

Isso builda o Next.js, adapta com o OpenNext e publica no Cloudflare. Para só testar localmente antes de publicar, use `npm run cf:preview` (roda o build de produção num Workers runtime local, via Miniflare).

**Depois do primeiro deploy**: configure o webhook de revalidação em manage.sanity.io (API -> Webhooks) apontando para `https://valorizarte.com.br/api/revalidate` — os detalhes exatos (secret, projection) já estão documentados nos comentários de `src/app/api/revalidate/route.ts`.

## Scripts disponíveis

```bash
npm run dev            # ambiente de desenvolvimento do site
npm run build          # build de produção do Next.js (testado com sucesso neste projeto)
npm run start           # roda o build de produção localmente
npm run lint            # ESLint
npm run import:blog     # importa os posts do WordPress para o conteúdo local (sem credencial)
npm run migrate         # sobe os mesmos posts para o Sanity (aceita --dry-run e --dataset=)
npm run studio:dev      # painel do Sanity em localhost:3333 (separado do site)
npm run studio:deploy   # publica o painel em valorizarte.sanity.studio
npm run cf:build        # builda e adapta o site para Cloudflare (só build, sem publicar)
npm run cf:preview      # builda e testa localmente num runtime Cloudflare (Miniflare)
npm run cf:deploy       # builda e publica o site na Cloudflare (produção)
```

## Estrutura do projeto

```
src/
  app/                    # rotas (App Router)
    [slug]/               # posts e páginas institucionais na raiz (preserva URLs do WP)
    empresas/[slug]/      # as 10 páginas de serviço
    blog/                 # listagem do blog
    midia/                # estrutura inicial da seção Mídia
    api/revalidate/       # webhook de revalidação sob demanda
  components/             # componentes de UI
  content/seed.ts          # conteúdo real/rascunho usado até o Sanity estar populado
  content/blogPosts.ts     # GERADO por `npm run import:blog` — os 21 posts do blog
  lib/data.ts              # camada de dados (Sanity com fallback pro seed)
  lib/newsletter.ts         # ponto único de integração do cadastro de newsletter
  sanity/schemaTypes/       # todos os schemas do Studio, em português
scripts/lib/wordpress.ts    # conversão WordPress -> Portable Text, usada pelos dois scripts abaixo
scripts/import-blog.ts      # importa os posts para o conteúdo local (public/ + content/blogPosts.ts)
scripts/migrate-wp.ts       # sobe os mesmos posts para o Sanity, com as imagens do corpo
sanity.config.ts            # configuração do Studio (hospedado à parte, ver seção 7)
open-next.config.ts         # adaptação do Next para rodar em Cloudflare Workers
wrangler.jsonc               # configuração do Worker (bindings de R2, D1, assets)
```
