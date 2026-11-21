document.documentElement.classList.add('js');

const navigation = document.querySelector('.nav-links');
const toggle = document.querySelector('.menu-toggle');
const links = [...navigation.querySelectorAll('a')];
const mobile = window.matchMedia('(max-width: 720px)');
toggle.hidden = false;

function closeMenu(returnFocus = false) {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) toggle.focus();
}

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});

links.forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-bar')) closeMenu();
});
mobile.addEventListener('change', () => closeMenu());

// Follow the section at the reading position, without changing keyboard focus.
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let framePending = false;
function updateCurrentSection() {
  framePending = false;
  const readingLine = Math.min(window.innerHeight * .32, 220);
  let current = null;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= readingLine) current = section.id;
  }
  links.forEach(link => {
    if (link.getAttribute('href') === `#${current}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => {
  if (!framePending) {
    framePending = true;
    requestAnimationFrame(updateCurrentSection);
  }
}, { passive: true });
window.addEventListener('resize', updateCurrentSection);
updateCurrentSection();
