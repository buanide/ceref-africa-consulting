const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
}));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
  });
}));
document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#interest').value = link.dataset.interest;
}));
const dialog = document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  dialog.querySelector('img').src = `assets/visuel-${button.dataset.image}.jpeg`;
  dialog.querySelector('img').alt = button.querySelector('img').alt;
  dialog.showModal();
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = `Demande CEREF — ${data.get('interest')}`;
  const body = `Bonjour CEREF Africa Consulting,\n\n${data.get('message')}\n\nProjet : ${data.get('interest')}\nNom : ${data.get('name')}\nE-mail : ${data.get('email')}`;
  window.location.href = `mailto:cerefcontact@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#form-status').textContent = 'Votre application e-mail peut maintenant s’ouvrir. Vérifiez le message puis envoyez-le. Si elle ne s’ouvre pas, contactez cerefcontact@gmail.com directement.';
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Alternance : langue, contact, service, deux langues, contact, formation…
(() => {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;
  const container = carousel.querySelector('.hero-slides');
  const languages = {
    fe: ['feefee-cameroun.svg', 'Fe’efe’e'], med: ['medumba-cameroun.svg', 'Medumba'],
    du: ['duala-cameroun.svg', 'Duala'], ba: ['bassa-cameroun.svg', 'Bassa'],
    ew: ['ewondo-cameroun.svg', 'Ewondo'], gh: ['ghomala-cameroun.svg', 'Ghomalaʼ'],
    ye: ['yemba-cameroun.svg', 'Yemba'], en: ['anglais-plusieurs-pays.svg', 'Anglais'],
    li: ['lingala-plusieurs-pays.svg', 'Lingala'], de: ['allemand-plusieurs-pays.svg', 'Allemand'],
    zh: ['mandarin-plusieurs-pays.svg', 'Mandarin'], sw: ['swahili-plusieurs-pays.svg', 'Swahili'], fu: ['fulfulde-plusieurs-pays.svg', 'Fulfulde']
  };
  const services = {
    meeting: ['salle-reunion.svg', 'Salle de réunion', 'Un espace pour vos échanges professionnels.', 'Salle de réunion'],
    training: ['langues-internationales.svg', 'Formations en langues', 'Un projet personnel, professionnel ou culturel ?', 'Langues internationales'],
    management: ['management.svg', 'Management & savoir-faire', 'Faites progresser vos équipes et vos projets.', 'Management et formation'],
    advice: ['langues-locales.svg', 'Conseil & études', 'Échangeons sur vos besoins et vos objectifs.', 'Conseil et bureau d’études']
  };
  const sequence = ['fe','contact','meeting','med','du','contact','training','ba','ew','contact','management','gh','ye','contact','advice','en','li','contact','meeting','de','zh','contact','training','sw','fu','contact'];
  sequence.forEach(key => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'diapositive');
    slide.hidden = true;
    if (key === 'contact') {
      slide.classList.add('contact-slide');
      slide.setAttribute('aria-label', 'Contactez CEREF');
      slide.innerHTML = '<span class="contact-slide-mark" aria-hidden="true">↗</span><h3>Et si on en parlait ?</h3><p>Votre prochain projet commence par un échange.</p><a href="tel:+237687177877">+237 687 17 78 77</a><a href="mailto:cerefcontact@gmail.com">cerefcontact@gmail.com</a><a class="slide-action" href="#contact">Contactez-nous →</a>';
    } else if (languages[key]) {
      const [file, label] = languages[key];
      slide.classList.add('language-slide');
      slide.setAttribute('aria-label', label);
      const img = document.createElement('img');
      img.src = `assets/${file}`;
      img.alt = `${label} — ${file.includes("plusieurs-pays") ? "drapeaux des principaux pays et territoires de présence" : "nom de la langue et drapeau du Cameroun"}`;
      img.width = 1600; img.height = 900;
      slide.append(img);
    } else {
      const [file, title, description, interest] = services[key];
      slide.classList.add('service-slide');
      slide.setAttribute('aria-label', title);
      const img = document.createElement('img');
      img.src = `assets/${file}`; img.alt = ''; img.width = 600; img.height = 360;
      const heading = document.createElement('h3'); heading.textContent = title;
      const text = document.createElement('p'); text.textContent = description;
      const link = document.createElement('a'); link.className = 'slide-action'; link.href = '#contact'; link.textContent = 'Parlons de votre projet →';
      link.addEventListener('click', () => { document.querySelector('#interest').value = interest; });
      slide.append(img, heading, text, link);
    }
    container.append(slide);
  });
  const slides = [...container.children];
  const counter = carousel.querySelector('.hero-slide-count');
  const pause = carousel.querySelector('[data-carousel="pause"]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, paused = motion.matches, hovered = false, focused = false, timer;
  function schedule() {
    clearTimeout(timer);
    if (!paused && !hovered && !focused && !document.hidden) timer = setTimeout(() => show(index + 1), 3000);
  }
  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== index; slide.setAttribute('aria-label', `${i + 1} sur ${slides.length} : ${slide.dataset.label || (slide.dataset.label = slide.getAttribute('aria-label'))}`); });
    carousel.closest('.hero-art').classList.toggle('show-greeting', index === 0);
    counter.textContent = `${index + 1} / ${slides.length}`;
    schedule();
  }
  function updatePause() { pause.textContent = paused ? 'Reprendre' : 'Pause'; pause.setAttribute('aria-label', paused ? 'Reprendre le défilement automatique' : 'Mettre le défilement en pause'); schedule(); }
  carousel.querySelector('[data-carousel="previous"]').addEventListener('click', () => show(index - 1));
  carousel.querySelector('[data-carousel="next"]').addEventListener('click', () => show(index + 1));
  pause.addEventListener('click', () => { paused = !paused; updatePause(); });
  carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  carousel.addEventListener('focusin', () => { focused = true; schedule(); });
  carousel.addEventListener('focusout', event => { focused = carousel.contains(event.relatedTarget); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', event => { paused = event.matches; updatePause(); });
  updatePause(); show(0);
})();
