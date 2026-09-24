# RPE

> Experiência e inovação para transformar o varejo. E o seu negócio.

RPE is a retail technology company with 20+ years of experience. It offers a modular set of solutions covering a store's whole digital operation, from integrated management to wider access to credit. The site is in Brazilian Portuguese.

Design source: Figma file "RPE test". Page "03. Quem Somos" is the layout, and the **Foundations** page holds the colors, type, spacing and radius rules.

## Brand Identity
- **Personality:** confident, modern, close to its clients. Headlines are light, with the key words in **semibold**.
- **Colors** (all are CSS variables at the top of `styles.css`, named as in Figma):
  - Orange `#FF6633`: accent (badge dots, map pins, the "Current page" dot, photo circles)
  - Blue `#2A56A5`: main buttons and links (hover `#2F60B8`, pressed `#303E58`)
  - Grays: text `#393939` / `#515151` / `#4A5157` / `#80868D`; borders `#D5D7D9` / `#AFB7BF`
  - Page background light gray `#F2F2F2`, cards white or blush `#F7F3F5`
  - Navy gradient in the values/footer area
- **Font:** Poppins (Regular 400, Medium 500, SemiBold 600, Bold 700), with slightly tight letter spacing (-4%).
- **Type sizes (desktop → phone):** 42→30, 32→24, 28→22, 24→20, 18→16. 16, 14 and 12 stay the same.
- **Spacing:** page side margin 82px (20px on phones). Section top/bottom 112px (56px on phones). Gap between blocks 20px (12px on phones).
- **Corner rounding:** 18px (cards), 56px, 72px (big panels), fully round (buttons and badges).

## Pages
- **Quem Somos** (`quem-somos.html`), the About page, built from the Figma design:
  1. Top menu (logo + links, with an orange dot on the current page). On phones and tablets it becomes a ☰ icon that opens a full-screen menu with a "Fale Conosco" button
  2. Hero with the "Quem Somos" badge, headline and the "Converse com a gente" button, plus line art on both sides
  3. Full-width team photo: one image (`images/img-transition.png`, 1920×821) where the people "break out" above the photo. On smaller screens the sides are cropped, but the two people always stay in frame
  4. "Sobre nós": the company intro
  5. "Nossa Diretoria": 8 directors in a slider with ← → arrows
  6. "Onde estamos": card with text plus a map of Brazil with pins
  7. "Nossos valores": 6 cards (5 values + 1 photo)
  8. "Nossos parceiros": partner logos orbiting a center circle
  9. Footer with links, legal info and the Mukutu credit
- **Homepage** (`index.html`) and `about.html`: still the original starter placeholders. They haven't been redesigned yet.

## Phone version
Phone layouts follow the Figma frames "03. Quem Somos — Mobile" (390px) and "Mobile / Menu aberto". A few images have a separate phone version, named `images/m-...` (hero line art, "Diretoria" outline, a zoomed-in Brazil map). The partners orbit keeps the same layout at 72% size, stays centered on the middle circle and is cut off at the sides, with the title inside the circle at 24px.

## Images
All images are in the `images/` folder and were exported from Figma. Team photos come in two layers each (`team-NAME-bg.png` inside the orange circle and `team-NAME-head.png` on top).

## Conteúdo pelo Sanity (CMS)
O conteúdo da página Quem Somos é editado sem mexer no código, pelo painel **https://rpe-quem-somos.sanity.studio** (entre com a conta GitHub). Edite e clique em **Publish**. O site mostra a mudança na próxima vez que a página for carregada.

A primeira coluna do painel ("Content") tem 3 itens:
- **Diretoria** (collection): um item por diretor (nome, cargo, ordem, 2 fotos). Para adicionar, clique no **+** da coluna do meio. Qualquer página que tiver o slider de diretoria usa essa mesma lista.
- **Parceiros** (collection): um item por parceiro (nome, ordem, logo). Pode ser reusada em outras páginas (Home, Soluções…).
- **Página Quem Somos**: os textos da página, separados em abas (Topo, Sobre nós, Diretoria, Onde estamos, Valores, Parceiros). Existe só um documento dessa página: não use o **+** para criar outro, o site não vai ler a cópia.

Regras:
- **Ordem:** diretores e parceiros aparecem pelo número do campo "Ordem" (1 primeiro). Sem número, vão para o fim, em ordem alfabética.
- **Negrito:** escreva `**palavra**`. **Quebra de linha:** aperte Enter (nos campos maiores).
- **Diretores:** os 8 atuais têm o enquadramento da foto ajustado à mão, enquanto usarem os arquivos originais (`team-NOME-bg.png` / `team-NOME-head.png`). Um diretor novo, ou uma foto trocada, usa o enquadramento automático: a foto 1 preenche o círculo laranja e a foto 2 (PNG recortado, sem fundo) fica por cima.
- **Valores:** até 5 cards. Os ícones ficam fixos na ordem (medalha, pessoas, barras, pessoa, mão).
- **Parceiros:** a órbita mostra os 12 primeiros (tem 12 lugares). Os atuais mantêm lugar e tamanho enquanto usarem o logo original (`partner-NOME.png`). Um parceiro novo ocupa o lugar de um que foi removido, com o logo ajustado ao círculo.
- **Rascunho e publicado:** o que você edita fica como rascunho (Draft) até clicar em Publish. O site só mostra o que está publicado.
- **Se o Sanity estiver fora do ar ou lento** (mais de 2 segundos), a página mostra os textos e fotos que já estão escritos no HTML. Por isso o HTML continua com o conteúdo original.
- **Arquivos técnicos:** `cms.js` busca o conteúdo e preenche a página; o `script.js` espera isso terminar antes de começar as animações. Projeto Sanity `2b7mccfz`, dataset `production`.
- **Ao publicar o site num domínio próprio**, esse endereço precisa ser liberado no Sanity (em sanity.io/manage → API → CORS origins). Hoje só o preview local (`localhost`) está liberado.

## Recent Changes
- 2026-09-24: Sanity — Diretoria e Parceiros viraram collections próprias (um item por diretor/parceiro, com campo "Ordem"), para poderem ser usadas em outras páginas. A "Página Quem Somos" no painel agora é separada em abas por seção, com textos de ajuda em cada campo. O parceiro 10 ganhou o nome provisório "Parceiro Exemplo".
- 2026-09-24: Página Quem Somos ligada ao Sanity (CMS). Criado o painel de edição em https://rpe-quem-somos.sanity.studio com todos os textos atuais já cadastrados. As 29 fotos da página (faixa do time, diretores, logos de parceiros e foto dos valores) também foram enviadas e já vêm do Sanity. As cópias na pasta `images/` continuam lá como reserva, caso o Sanity não responda.
- 2026-09-23: Menu do celular/tablet agora tem animação de abertura: o painel branco aparece em fade e os links sobem um a um (0,04s entre cada), com o botão "Fale Conosco" por último. É o mesmo movimento das outras animações da página (fade + subida, sem desfoque). Ao fechar, o painel some rápido, sem cascata. O ícone ☰ vira X com a mesma curva suave. Quem prefere menos movimento vê só o fade. Também corrigido o "pulo" da página ao abrir o menu: ao travar a rolagem, a barra de rolagem sumia e a página ficava ~15px mais larga. Agora o espaço da barra fica sempre reservado (`scrollbar-gutter` no styles.css) e fica branco enquanto o menu está aberto.
- 2026-09-23: Rolagem suave (Lenis) em todas as páginas: a rolagem com mouse/trackpad agora desliza de forma suave, com duração de 1s e desaceleração no final. No celular a rolagem continua a nativa do aparelho. O script fica no arquivo `lenis.js` (uma cópia do script da Offbrand, ajustada para funcionar fora do Webflow) e é configurado pelos atributos `data-...` na tag `<script>` no fim de cada página. Quando o menu do celular está aberto, a rolagem suave pausa junto com a página. Extras: um elemento com `data-lenis-prevent` rola normalmente (sem o efeito); botões com `data-scroll="stop"`, `"start"` ou `"toggle"` pausam/retomam a rolagem; um link com `data-scrolllink="#id-da-secao"` desliza suavemente até aquela seção.
- 2026-09-23: Quem Somos — as linhas decorativas das laterais do topo agora se desenham na tela na abertura da página, como se uma caneta fosse riscando: cada traço (arcos, círculos e retas) aparece um após o outro, em velocidade constante (traços curtos são rápidos, curvas longas levam mais tempo), nos dois lados ao mesmo tempo. Elas não deslizam nem aparecem em fade — só se desenham. Leva cerca de 3,5 segundos e não atrasa o resto da abertura. Para isso o desenho deixou de ser uma imagem e foi colado direto na página (mesmo traço de `images/hero-lines.svg`; no celular é o mesmo desenho em metade do tamanho). Os arquivos `hero-lines.svg` e `m-hero-lines-*.svg` ficam na pasta de imagens só como referência. Quem prefere menos movimento vê só um fade.
- 2026-09-23: Quem Somos — "Nossos valores": o card com foto agora entra igual aos outros 5 cards (sobe e aparece, em sequência), sem o efeito de cortina que tinha antes.
- 2026-09-23: Quem Somos — "Sobre nós" agora entra em sequência clara: etiqueta → título (palavra por palavra) → texto, com o texto esperando o título começar a se formar. Nos outros cabeçalhos de seção, o título agora também espera a etiqueta entrar primeiro. Para montar uma sequência assim em outra seção: coloque `data-reveal-group="deep"` na seção e `data-reveal-item` em cada elemento (os títulos com `data-reveal="words"` entram na ordem automaticamente).
- 2026-09-23: Quem Somos — a faixa de fotos do time foi simplificada: em vez de várias camadas (foto de fundo, pessoas recortadas, manchas e formas decorativas, com versão separada para celular), agora é uma única imagem que já vem com o efeito das pessoas "saindo" da foto (`images/img-transition.png`). Em telas menores a imagem é cortada nas laterais — mais do lado do notebook — sem cortar as pessoas. A entrada suave na abertura da página e o parallax ao rolar continuam.
- 2026-09-23: Quem Somos — a faixa de fotos do time agora também entra na abertura da página: logo depois do botão do hero, o fundo sobe suavemente de baixo e, em seguida, a foto das pessoas sobe de um pouco mais longe (sensação leve de profundidade). O parallax ao rolar continua igual. Quem prefere menos movimento vê só um fade.
- 2026-09-23: Quem Somos — removido o desfoque (blur) de todas as animações de entrada. Agora os elementos só sobem e aparecem (fade + deslocamento), na abertura da página e ao rolar.
- 2026-09-23: Quem Somos — nova animação de abertura da página: o menu do topo desce suavemente (logo e depois cada link, um a um) e, no hero, a etiqueta "Quem Somos", o título (palavra por palavra) e o botão "Converse com a gente" entram em sequência, enquanto as linhas decorativas deslizam das laterais. Antes só o título animava. Também corrigido um "pisca" no carregamento (os elementos apareciam, sumiam e depois animavam). Quem prefere menos movimento vê só um fade.
- 2026-09-23: Quem Somos — animações de entrada começam um pouco mais tarde: só disparam quando o elemento chega a ~75% da altura da tela (antes era logo ao entrar pela borda de baixo), com mais 0,1s de espera. Assim dá tempo de vê-las ao rolar. O rodapé aparece ao chegar no fim da página. Para ajustar a espera, mude `--reveal-delay` no styles.css.
- 2026-09-23: Quem Somos — títulos animados palavra por palavra: removido o desfoque (agora só sobem e aparecem) e corrigido o "pulo" da página. No Safari as linhas do título ficavam mais altas durante a animação e encolhiam no final; agora mantêm a altura original do começo ao fim.
- 2026-09-23: Quem Somos — animações de entrada em todas as seções, no estilo Apple: ao rolar, etiquetas, textos, cards e botões "entram em foco" (saem de um leve desfoque e sobem até o lugar), um após o outro em cascata. Os títulos principais entram palavra por palavra (GSAP SplitText). A foto do card de valores se revela de cima para baixo e as linhas do topo deslizam das laterais. Cada animação acontece uma vez só. Quem prefere menos movimento vê só um fade suave. Para ativar em um elemento novo: adicione `data-reveal` (sozinho), `data-reveal-group` (filhos em cascata) ou `data-reveal="words"` (título por palavra).
- 2026-09-23: Quem Somos — a faixa de fotos do time agora rola mais devagar que a página (efeito parallax leve) e a seção "Sobre nós" sobe por cima dela. Desligado para quem prefere menos movimento.
- 2026-09-23: Página Quem Somos — os ícones dos cards de valores agora se animam ao passar o mouse (medalha gira, pessoas pulam, barras crescem, pessoa do centro sobe inteira, mão cumprimenta). Os ícones foram colados direto no HTML para permitir isso.
- 2026-09-23: Quem Somos — corrigido o contorno "Diretoria" no desktop (um caractere invisível no estilo impedia o posicionamento; agora fica centralizado e cortado em cima).
- 2026-09-23: Quem Somos — no tablet/celular o contorno "Diretoria" agora fica logo acima da etiqueta "Time" (24px de folga), sem encostar no título; só a parte de baixo aparece.
- 2026-09-23: Quem Somos — o contorno "Diretoria" da seção Time agora mantém o tamanho do desktop (mesma espessura de traço e posição) no tablet e celular, cortado nas laterais e no topo.
- 2026-09-23: Página Quem Somos — as órbitas de parceiros agora têm animação de entrada ao aparecer na tela e depois giram sem parar (cada anel num sentido); os logos orbitam junto com o anel em que estão, sempre de pé. Usa GSAP.
- 2026-09-23: Quem Somos — o mapa agora tem animação de entrada ao rolar até ele: a grade aparece, os estados sobem, depois a sombra cinza desce e "assenta" atrás deles (efeito de profundidade), os pontos surgem um a um e por fim entra a tag "São Paulo" com um pulso laranja. O mapa foi dividido em dois arquivos (brazil-map-shadow.svg e brazil-map-states.svg, e versões m- para celular) para animar a sombra separadamente. Quem prefere menos movimento no sistema vê o mapa direto, sem animação.
- 2026-09-23: Seção "Sobre nós" (Quem Somos) agora usa o grid de 12 colunas do Figma de forma flexível — não corta mais em telas desktop menores.
- 2026-09-23: Quem Somos — no desktop, o card do mapa agora acompanha sempre a altura total da coluna ao lado ("Onde estamos" + imagem); o desenho do mapa se ajusta e fica centralizado.
- 2026-09-23: Improved the "Nossa Diretoria" slider: cards can now be dragged with the mouse (a hand/grab cursor shows this), and on phones it now shows one director centered at a time with a peek of the next one, instead of bleeding off the right edge only.
- 2026-09-23: Fixed the slider's phone centering (the first director was sitting off to one side instead of centered) On desktop/tablet the slider now runs all the way to the screen edges (as in Figma): the first card lines up with the title, and the next cards continue past the container until the edge of the screen instead of being cut at the container.
- 2026-09-23: Removed the thin gray line between sections (the 1px gap from the Figma frame) on all screen sizes.
- 2026-09-23: Matched the phone layout to the Figma mobile frames: full-screen mobile menu, new phone images, zoomed map, and a scaled partners orbit with the title inside the circle.
- 2026-09-23: Built the Quem Somos page from Figma. Replaced `styles.css` with the RPE design system (tokens from the Foundations page) and added the mobile menu and team slider to `script.js`.

## To Do / Open Items
- Menu links for Soluções, Contato, Trabalhe Conosco, Trust Center and RCV-RPE point nowhere (`#`) until those pages exist.
- "Converse com a gente", the footer social links, Privacy and Cookies links also need real destinations.
- The footer CNPJ is a placeholder (`00000000000000`). The 10th partner in the orbit is named "Parceiro Exemplo" (placeholder) until the real brand is known. Change it in the Sanity panel.

## How to Customize
- Para mudar a velocidade da rolagem suave: altere `data-duration` (em segundos) na tag do `lenis.js` no fim de cada página.
- **Change colors or sizes:** edit the variables at the top of `styles.css`
- **Change a director, value, partner or page text:** use the Sanity panel (see "Conteúdo pelo Sanity" above)
- **Add a page:** copy `quem-somos.html`, keep the menu and footer, and replace the middle content
