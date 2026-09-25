// Quem Somos content from Sanity (edited at https://rpe-quem-somos.sanity.studio).
// Fills the page before script.js starts the animations. If Sanity is slow or
// unreachable, the text and images already written in the HTML stay as they are.
window.cmsReady = (() => {
  const PROJECT = '2b7mccfz';
  const DATASET = 'production';
  const TIMEOUT = 2000;

  // Directors and partners are their own collections, so other pages can reuse them
  const QUERY = `{
    "page": *[_id == "quemSomosPage"][0]{
      ...,
      "teamBandImage": teamBandImage.asset->url,
      "valuesPhoto": valuesPhoto.asset->url,
      "seo": seo{ title, description, noIndex, "image": image.asset->url }
    },
    "directors": *[_type == "director"] | order(coalesce(order, 999) asc, name asc){
      name, role,
      "photoBg": photoBg.asset->{ url, originalFilename },
      "photoHead": photoHead.asset->{ url, originalFilename }
    },
    "partners": *[_type == "partner" && defined(logo)] | order(coalesce(order, 999) asc, name asc)[0...12]{
      name,
      "logo": logo.asset->{ url, originalFilename }
    }
  }`;

  const escape = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  // **word** becomes bold and Enter becomes a line break
  const rich = (s) => escape(s).replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>').replace(/\n/g, '<br>');
  const sized = (url, width) => `${url}?w=${width}&auto=format`;

  const $ = (selector) => document.querySelector(selector);
  const setRich = (el, value) => { if (el && value) el.innerHTML = rich(value); };
  const setText = (el, value) => { if (el && value) el.textContent = value; };
  const setImg = (el, url, width) => { if (el && url) el.src = sized(url, width); };

  const fill = ({ page, directors, partners }) => {
    if (page) fillPage(page);
    if (directors?.length) fillDirectors(directors);
    if (partners?.length) fillPartners(partners);
  };

  // SEO tab: browser tab title, Google snippet and link-sharing preview
  const setMeta = (selector, value) => { const el = $(selector); if (el && value) el.content = value; };
  const fillSeo = (seo) => {
    const { title, description, image, noIndex } = seo || {};
    if (title) document.title = title;
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:description"]', description);
    if (image) setMeta('meta[property="og:image"]', `${image}?w=1200&h=630&fit=crop&auto=format`);
    setMeta('meta[name="robots"]', noIndex ? 'noindex, nofollow' : null);
  };

  const fillPage = (d) => {
    fillSeo(d.seo);
    setText($('.hero .badge__label'), d.heroBadge);
    setRich($('.hero__title'), d.heroTitle);
    setText($('.hero__content .button'), d.heroButtonLabel);
    setImg($('.img-transition__img'), d.teamBandImage, 1920);

    setText($('.about .badge__label'), d.aboutBadge);
    setRich($('.about__lead'), d.aboutLead);
    setText($('.about__text'), d.aboutText);

    setRich($('.team .section-header__title'), d.teamTitle);
    setRich($('.team__intro'), d.teamIntro);

    setText($('.local .badge__label'), d.localBadge);
    setRich($('.local .section-header__title'), d.localTitle);
    setRich($('.local__text'), d.localText);

    setText($('.values > .section-header .badge__label'), d.valuesBadge);
    setRich($('.values > .section-header .section-header__title'), d.valuesTitle);
    if (d.valueCards?.length) fillValues(d.valueCards);
    setImg($('.value-card__graphic img'), d.valuesPhoto, 1000);

    setText($('.orbit .badge__label'), d.partnersBadge);
    setRich($('.orbit .section-header__title'), d.partnersTitle);
  };

  // The original 8 directors keep their hand-tuned photo framing while they use
  // their original photo files (team-NAME-bg.png / -head.png). New directors or
  // new photos get the automatic framing (.team-card--auto).
  const framingOf = (dir) => {
    const key = dir.photoBg?.originalFilename?.match(/^team-(\w+?)(-bg)?\.png$/)?.[1];
    const headOk = !dir.photoHead || dir.photoHead.originalFilename === `team-${key}-head.png`;
    return key && headOk ? key : null;
  };

  const fillDirectors = (directors) => {
    const track = $('.carousel__track');
    const existing = new Map([...track.children].map((li) => [li.className.match(/team-card--(\w+)/)?.[1], li]));

    track.replaceChildren(...directors.map((dir) => {
      const key = framingOf(dir);
      let li = existing.get(key);
      existing.delete(key);
      if (!li) {
        li = document.createElement('li');
        li.className = 'team-card team-card--auto';
        li.innerHTML = `
          <div class="team-card__photo">
            <div class="team-card__mask"><img class="team-card__bg" alt=""></div>
            ${dir.photoHead ? '<img class="team-card__head" alt="">' : ''}
          </div>
          <div class="team-card__info">
            <h3 class="team-card__name"></h3>
            <p class="team-card__role"></p>
          </div>`;
      }
      const head = li.querySelector('img.team-card__head, .team-card__head img');
      setImg(li.querySelector('.team-card__bg'), dir.photoBg?.url, 1200);
      setImg(head, dir.photoHead?.url || (head?.closest('.team-card__head--crop') && dir.photoBg?.url), 600);
      if (head && dir.name) head.alt = `Foto de ${dir.name}`;
      setText(li.querySelector('.team-card__name'), dir.name);
      setText(li.querySelector('.team-card__role'), dir.role);
      return li;
    }));
  };

  // Each value card's icon is fixed in the HTML, so the texts fill the cards in order
  const fillValues = (cards) => {
    document.querySelectorAll('.values__grid article.value-card').forEach((article, i) => {
      if (!cards[i]) return article.remove();
      setRich(article.querySelector('.value-card__title'), cards[i].title);
      setText(article.querySelector('.value-card__text'), cards[i].text);
    });
  };

  // The orbit has 12 fixed spots. The original partners keep their spot and logo
  // size while they use their original logo file (partner-NAME.png); any other
  // partner takes the spot of one that was removed, with an automatic logo size.
  const fillPartners = (partners) => {
    const list = $('.orbit__logos');
    const slots = [...list.children];
    const existing = new Map(slots.map((li) => [li.className.match(/partner-logo--(?!glass\b)(\w+)/)?.[1], li]));
    const kept = [];
    const added = [];

    partners.forEach((p) => {
      const li = existing.get(p.logo.originalFilename?.match(/^partner-(\w+)\.png$/)?.[1]);
      if (!li || kept.includes(li)) return added.push(p);
      const img = li.querySelector('img');
      setImg(img, p.logo.url, 300);
      if (p.name) img.alt = p.name;
      kept.push(li);
    });

    const free = slots.filter((li) => !kept.includes(li));
    added.forEach((p) => {
      const li = free.shift();
      if (!li) return;
      li.classList.remove('partner-logo--glass');
      li.classList.add('partner-logo--auto');
      const img = document.createElement('img');
      img.src = sized(p.logo.url, 300);
      img.alt = p.name || '';
      li.replaceChildren(img);
      kept.push(li);
    });

    list.replaceChildren(...kept);
  };

  const url = `https://${PROJECT}.apicdn.sanity.io/v2025-02-19/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  return fetch(url, { signal: controller.signal })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then(({ result }) => result && fill(result))
    .catch((error) => console.warn('Sanity: usando o conteúdo do HTML.', error))
    .finally(() => clearTimeout(timer));
})();
