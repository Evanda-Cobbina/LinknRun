const header = document.querySelector('.site-header');
const route = document.querySelector('.route-line span');
const menu = document.querySelector('.menu-button');
const nav = document.querySelector('.desktop-nav');

function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  if (route) route.style.transform = `scaleY(${Math.min(progress, 1)})`;
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

if (menu && nav) menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  if (!open) {
    nav.style.display = 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '70px';
    nav.style.left = '20px';
    nav.style.right = '20px';
    nav.style.margin = '0';
    nav.style.padding = '18px';
    nav.style.flexDirection = 'column';
    nav.style.background = 'var(--surface)';
    nav.style.border = '1px solid var(--line)';
    nav.style.borderRadius = '18px';
  } else {
    nav.removeAttribute('style');
  }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      if (menu) menu.setAttribute('aria-expanded', 'false');
      if (nav) nav.removeAttribute('style');
    }
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) observer.unobserve(entry.target), entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const reelScroll = document.querySelector('.reel-scroll');
const reelTrack = document.querySelector('.reel-track');
const reelSlides = document.querySelectorAll('.reel-slide');
const reelDots = document.querySelectorAll('.reel-dots .dot');
const reelVideos = document.querySelectorAll('.reel-slide video');

let reelActiveIndex = -1;
let reelTicking = false;

function setActiveSlide(index) {
  if (index === reelActiveIndex) return;
  reelActiveIndex = index;
  reelDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  reelSlides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === index);
    const video = slide.querySelector('video');
    const btn = slide.querySelector('.reel-play');
    if (!video) return;
    if (i === index) {
      video.play().catch(() => {});
      if (btn) btn.classList.add('is-playing');
    } else {
      video.pause();
      video.currentTime = 0;
      if (btn) btn.classList.remove('is-playing');
    }
  });
}

function updateReel() {
  reelTicking = false;
  if (!reelScroll || !reelTrack || !reelSlides.length) return;
  const rect = reelScroll.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
  const lastIndex = reelSlides.length - 1;
  const index = Math.min(lastIndex, Math.round(progress * lastIndex));
  setActiveSlide(index);
}
function onReelScroll() {
  if (reelTicking) return;
  reelTicking = true;
  requestAnimationFrame(updateReel);
}
window.addEventListener('scroll', onReelScroll, { passive: true });
window.addEventListener('resize', updateReel);
if (reelScroll) reelScroll.style.height = `${reelSlides.length * 100}vh`;
updateReel();

reelVideos.forEach(video => {
  const btn = video.parentElement.querySelector('.reel-play');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
      btn.classList.add('is-playing');
    } else {
      video.pause();
      btn.classList.remove('is-playing');
    }
  });
});
