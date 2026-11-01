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
