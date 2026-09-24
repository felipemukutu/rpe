// All site interactivity lives here. Loaded on every page.

// Lets CSS hide animated elements only when JS is running
document.documentElement.classList.add('js');

// Quem Somos first fills its text and photos from Sanity (cms.js), so everything
// below measures and animates the final content. Other pages start right away.
const initSite = () => {
  (() => {
    // Map entrance animation (Quem Somos): play once when the map scrolls into view
    const map = document.querySelector('.map');

    if (map) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            map.classList.add('is-visible');
            observer.disconnect();
          }
        }, { threshold: 0.35 });
        observer.observe(map);
      } else {
        map.classList.add('is-visible');
      }
    }

    // Mobile menu: open/close the navigation panel
    const toggle = document.querySelector('.site-nav__toggle');
    const menu = document.getElementById('site-nav-menu');

    if (toggle && menu) {
      // links and button rise in one after another when the menu opens
      [...menu.children].forEach((item, i) => item.style.setProperty('--menu-d', `${i * 40}ms`));

      const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        menu.classList.toggle('is-open', open);
        // stop the page behind the full-screen menu from scrolling
        document.body.classList.toggle('menu-open', open);
        // smooth scroll (lenis.js) moves the page itself, so pause it too
        if (window.SScroll) open ? window.SScroll.stop() : window.SScroll.start();
      };

      toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setOpen(false);
      });
    }

    // Team carousel: arrows scroll one card at a time and
    // fade out (disabled) at the start and end of the list
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
      const track = carousel.querySelector('[data-carousel-track]');
      const prev = carousel.querySelector('[data-carousel-prev]');
      const next = carousel.querySelector('[data-carousel-next]');
      const firstCard = track.querySelector('li');

      const step = () => {
        const gap = parseFloat(getComputedStyle(firstCard.parentElement).columnGap) || 0;
        return firstCard.offsetWidth + gap;
      };

      const updateButtons = () => {
        const maxScroll = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= maxScroll;
      };

      prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
      next.addEventListener('click', () => track.scrollBy({ left: step() }));
      track.addEventListener('scroll', updateButtons, { passive: true });
      window.addEventListener('resize', updateButtons);
      // let the slider reach both screen edges while cards stay aligned to the container
      const setBleed = () => {
        const bleed = (document.documentElement.clientWidth - carousel.clientWidth) / 2;
        carousel.style.setProperty('--bleed', `${bleed}px`);
      };

      setBleed();    window.addEventListener('resize', setBleed);
      updateButtons();

      // Click-and-drag scrolling with the mouse (touch already scrolls natively)
      let isDragging = false;
      let dragMoved = false;
      let dragStartX = 0;
      let dragStartScroll = 0;

      track.addEventListener('mousedown', (event) => {
        isDragging = true;
        dragMoved = false;
        dragStartX = event.pageX;
        dragStartScroll = track.scrollLeft;
        track.classList.add('is-dragging');
      });

      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('is-dragging');
      };

      window.addEventListener('mouseup', endDrag);
      track.addEventListener('mouseleave', endDrag);

      track.addEventListener('mousemove', (event) => {
        if (!isDragging) return;
        event.preventDefault();
        const delta = event.pageX - dragStartX;
        if (Math.abs(delta) > 5) dragMoved = true;
        track.scrollLeft = dragStartScroll - delta;
      });

      // don't let a drag also trigger a click on the card underneath
      track.addEventListener('click', (event) => {
        if (dragMoved) {
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);

      track.addEventListener('dragstart', (event) => event.preventDefault());
    });
  })();

  // Partners orbit: entrance when in view, then rings spin forever (logos stay still)
  (function () {
    const orbit = document.querySelector('.orbit');
    if (!orbit || !window.gsap || !window.ScrollTrigger) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const rings = [1, 2, 3, 4].map((n) => orbit.querySelector('.orbit__ring--' + n)).filter(Boolean);
    const main = orbit.querySelector('.orbit__main');
    const logos = orbit.querySelectorAll('.partner-logo');
    const spin = [{ dir: 1, dur: 60 }, { dir: -1, dur: 80 }, { dir: 1, dur: 100 }, { dir: -1, dur: 120 }];
    const loops = [];

    gsap.set(main, { autoAlpha: 0, scale: 0.6 });
    rings.forEach((ring, i) => gsap.set(ring, { autoAlpha: 0, scale: 0.8, rotation: -spin[i].dir * 30 }));
    gsap.set(logos, { autoAlpha: 0, scale: 0.6 });

    const intro = gsap.timeline({
      paused: true,
      onComplete() {
        rings.forEach((ring, i) => {
          loops.push(gsap.to(ring, {
            rotation: (spin[i].dir > 0 ? '+=' : '-=') + 360,
            duration: spin[i].dur,
            ease: 'none',
            repeat: -1,
          }));
        });
      },
    });
    intro
      .to(main, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.6)' })
      .to(rings, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'power3.out', stagger: 0.15 }, '-=0.6')
      .to(logos, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)', stagger: { each: 0.06, from: 'random' } }, '-=0.8');

    // Each logo rides the ring it sits on: its position is rotated around the
    // main circle by that ring's current angle, while the logo stays upright.
    let riders = [];
    function measure() {
      const cx = main.offsetLeft + main.offsetWidth / 2;
      const cy = main.offsetTop + main.offsetHeight / 2;
      riders = Array.from(logos).map((logo) => {
        const dx = logo.offsetLeft + logo.offsetWidth / 2 - cx;
        const dy = logo.offsetTop + logo.offsetHeight / 2 - cy;
        const r = Math.hypot(dx, dy);
        let ring = rings[0];
        rings.forEach((rg) => {
          if (Math.abs(rg.offsetWidth / 2 - r) < Math.abs(ring.offsetWidth / 2 - r)) ring = rg;
        });
        return { logo, ring, dx, dy };
      });
    }
    measure();
    window.addEventListener('resize', measure);

    gsap.ticker.add(() => {
      riders.forEach(({ logo, ring, dx, dy }) => {
        const a = (gsap.getProperty(ring, 'rotation') * Math.PI) / 180;
        const cos = Math.cos(a), sin = Math.sin(a);
        gsap.set(logo, { x: dx * cos - dy * sin - dx, y: dx * sin + dy * cos - dy });
      });
    });

    ScrollTrigger.create({
      trigger: orbit,
      start: 'top 75%',
      once: true,
      onEnter: () => intro.play(),
    });

    // Pause the spinning while the section is off screen
    ScrollTrigger.create({
      trigger: orbit,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => loops.forEach((t) => (self.isActive ? t.play() : t.pause())),
    });
  })();

  // Image transition parallax (Quem Somos): the photo band scrolls slower than
  // the page, so the "Sobre nós" section below slides up over it
  (() => {
    const band = document.querySelector('.img-transition');
    if (!band) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SPEED = 0.4; // 0 = normal scroll, 1 = stuck in place
    let ticking = false;

    const update = () => {
      ticking = false;
      // measure the layout position (ignores the transform we apply)
      const top = band.offsetTop - window.scrollY;
      const passed = Math.min(Math.max(-top, 0), band.offsetHeight);
      band.style.setProperty('--parallax-y', `${passed * SPEED}px`);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  // Scroll reveal (Quem Somos): elements fade up and settle as they enter the
  // screen, once. A group reveals its items in order: its direct children, or,
  // for data-reveal-group="deep", the [data-reveal-item]s and titles inside it.
  // Anything after a word-by-word title waits for it to start forming.
  (() => {
    const groups = document.querySelectorAll('[data-reveal-group]');
    // elements inside a group are revealed by their group, not on their own
    const targets = [...document.querySelectorAll('[data-reveal], [data-reveal-group]')]
      .filter((el) => !el.parentElement.closest('[data-reveal-group]'));
    if (!targets.length) return;

    const MAX_STEPS = 6;     // after 6 items, no extra delay
    const TITLE_HOLD = 300;  // ms the items after a split title wait

    const itemsOf = (group) => (group.dataset.revealGroup === 'deep'
      ? [...group.querySelectorAll('[data-reveal-item], [data-reveal="words"]')]
      : [...group.children]);

    groups.forEach((group) => {
      const stagger = parseFloat(getComputedStyle(group).getPropertyValue('--reveal-stagger')) || 70;
      let hold = 0;
      itemsOf(group).forEach((item, i) => {
        item.style.setProperty('--d', `${Math.min(i, MAX_STEPS) * stagger + hold}ms`);
        if (item.matches('[data-reveal="words"]')) hold += TITLE_HOLD;
      });
    });

    // mark as revealed and tell each item (the title animation listens for this)
    const show = (el) => {
      const items = el.matches('[data-reveal-group]') ? itemsOf(el) : [];
      [el, ...items].forEach((node) => {
        node.classList.add('is-revealed');
        node.dispatchEvent(new CustomEvent('reveal'));
      });
    };

    if (!('IntersectionObserver' in window)) {
      targets.forEach(show);
      return;
    }

    const reveal = (el) => {
      show(el);
      observer.unobserve(el);
    };

    // fire once the element's top passes the line 25% above the bottom of the
    // screen, so the motion plays where the eye already is
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && reveal(entry.target));
    }, { rootMargin: '0px 0px -25% 0px', threshold: 0 });

    targets.forEach((el) => observer.observe(el));

    // the last elements (footer) may never reach that line; reveal them at the page end
    const onScroll = () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 2) return;
      targets.forEach((el) => !el.classList.contains('is-revealed') && reveal(el));
      window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  // Page intro + title words (Quem Somos), with GSAP SplitText.
  // - On load: the nav drops in, then the hero badge, title and button rise in a
  //   short cascade while the side line art draws itself in, line by line, and
  //   the photo band below rises into place.
  // - On scroll: every other h1/h2 splits into words, each rising out of a mask
  //   Without GSAP or with reduced motion, CSS fades handle both.
  (() => {
    const root = document.documentElement;
    const introDone = () => root.classList.add('intro-done');
    const canAnimate = window.gsap && window.ScrollTrigger && window.SplitText
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canAnimate) {
      // wait a frame so the CSS fade has a starting point
      requestAnimationFrame(() => requestAnimationFrame(introDone));
      return;
    }
    root.classList.add('intro-anim');
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const EASE = 'expo.out';

    const splitWords = (title) => {
      const split = SplitText.create(title, { type: 'words', mask: 'words', wordsClass: 'split-word' });
      title.classList.add('is-split');
      // long titles keep the whole cascade under ~0.8s
      const each = Math.min(0.04, 0.8 / split.words.length);
      return gsap.from(split.words, {
        yPercent: 100,
        opacity: 0,
        duration: 0.9,
        ease: EASE,
        stagger: each,
        onComplete: () => split.revert(),
      });
    };

    // wait for Poppins so words are measured at their real width
    document.fonts.ready.then(() => {
      const intro = document.querySelectorAll('[data-intro]');
      const heroTitle = document.querySelector('[data-intro="title"]');
      const q = (name) => document.querySelectorAll(`[data-intro="${name}"]`);

      const tl = gsap.timeline({
        delay: 0.1,
        onComplete: () => {
          introDone();
          gsap.set(intro, { clearProps: 'opacity,transform' });
        },
      });
      // fromTo, not from: CSS keeps these at opacity 0 until the intro is done,
      // so the end values must be explicit
      const rise = (targets, at, from, extra = {}) => tl.fromTo(targets,
        { opacity: 0, ...from },
        { opacity: 1, x: 0, y: 0, duration: 0.8, ease: EASE, ...extra }, at);

      rise(q('nav'), 0, { y: -12 }, { duration: 0.7, stagger: 0.04 });
      // line art: no fade or slide, the lines draw themselves like a pen,
      // one after another, both sides at once. Each path has pathLength="1", so
      // a dash of 1 is the whole line; duration follows the real length so the
      // "pen" keeps a steady speed (short lines quick, long curves slower).
      // Own timeline, so the rest of the intro doesn't wait for it.
      const art = [...q('lines-left'), ...q('lines-right')];
      if (art.length) {
        const draw = gsap.timeline({ delay: 0.3 });
        tl.set(art, { opacity: 1 }, 0);
        art.forEach((side) => {
          side.querySelectorAll('path').forEach((path, i) => {
            gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
            const duration = gsap.utils.clamp(0.5, 1.8, path.getTotalLength() / 450);
            draw.to(path, { strokeDashoffset: 0, duration, ease: 'power1.inOut' }, i * 0.14);
          });
        });
        draw.eventCallback('onComplete', () => {
          gsap.set(art.map((side) => [...side.querySelectorAll('path')]).flat(),
            { clearProps: 'strokeDasharray,strokeDashoffset' });
        });
      }
      // hero: badge → title → button
      rise(q('hero')[0], 0.15, { y: 24 });
      if (heroTitle) tl.add(splitWords(heroTitle), 0.3);
      rise(q('hero')[1], 0.6, { y: 24 });
      // photo band: the image rises into place (the band itself keeps its parallax)
      rise(q('band'), 0.55, { y: 60 }, { duration: 1.5 });

      // scroll titles play when the reveal script reaches them, keeping their
      // place in their group's order (--d)
      document.querySelectorAll('[data-reveal="words"]').forEach((title) => {
        const play = () => splitWords(title).delay(0.1 + (parseFloat(title.style.getPropertyValue('--d')) || 0) / 1000);
        if (title.classList.contains('is-revealed')) play();
        else title.addEventListener('reveal', play, { once: true });
      });
    });
  })();
};

(window.cmsReady || Promise.resolve()).then(initSite);
