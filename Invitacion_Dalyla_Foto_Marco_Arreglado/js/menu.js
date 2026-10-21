// Menú desplegable en todas las pantallas; conserva el resto de la invitación.
document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('menuPrincipal');
  const boton = document.querySelector('.navbar-dalyla-dropdown .navbar-toggler');
  if (!panel || !boton || !window.bootstrap?.Collapse) return;
  const collapse = bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false });
  panel.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', evento => {
      const href = enlace.getAttribute('href') || '';
      if (href.startsWith('#') && href.length > 1) {
        const destino = document.getElementById(href.slice(1));
        if (destino) {
          evento.preventDefault();
          collapse.hide();
          const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          destino.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth', block: 'start' });
          history.replaceState(null, '', href);
          return;
        }
      }
      collapse.hide();
    });
  });
  document.addEventListener('click', evento => {
    if (!panel.contains(evento.target) && !boton.contains(evento.target)) collapse.hide();
  });
  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') { collapse.hide(); boton.focus(); }
  });
  const enlaces = [...panel.querySelectorAll('a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const secciones = enlaces.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
    const observador = new IntersectionObserver(entradas => {
      const actual = entradas.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!actual) return;
      enlaces.forEach(a => {
        const activo = a.hash === '#' + actual.target.id;
        a.classList.toggle('active', activo);
        if (activo) a.setAttribute('aria-current','location');
        else a.removeAttribute('aria-current');
      });
    }, {rootMargin:'-110px 0px -45% 0px', threshold:[0,.1,.4]});
    secciones.forEach(s => observador.observe(s));
  }
});
