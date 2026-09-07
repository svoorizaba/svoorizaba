(function () {
  // ---------- Toasts ----------
  window.mostrarToast = function (mensaje) {
    const cont = document.getElementById('toastContainer');
    if (!cont) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = mensaje;
    cont.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'all .25s ease';
      setTimeout(() => el.remove(), 250);
    }, 2800);
  };

  // ---------- FAQ accordion ----------
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const abierto = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
      if (!abierto) item.classList.add('is-open');
    });
  });

  // ---------- Testimonio spotlight ----------
  const dots = document.querySelectorAll('.spotlight-dot');
  const slides = document.querySelectorAll('.spotlight-slide');
  if (dots.length && slides.length) {
    let actual = 0;
    function mostrarSlide(idx) {
      slides.forEach(s => s.classList.toggle('is-active', Number(s.dataset.index) === idx));
      dots.forEach(d => d.classList.toggle('is-active', Number(d.dataset.index) === idx));
      actual = idx;
    }
    dots.forEach(d => d.addEventListener('click', () => mostrarSlide(Number(d.dataset.index))));
    setInterval(() => mostrarSlide((actual + 1) % slides.length), 6000);
  }

  // ---------- Filtro de portafolio ----------
  const filtros = document.getElementById('portafolioFiltros');
  const grid = document.getElementById('portafolioGrid');
  if (filtros && grid) {
    filtros.addEventListener('click', (e) => {
      const btn = e.target.closest('.filtro-btn');
      if (!btn) return;
      filtros.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.cat;
      grid.querySelectorAll('.mockup-card').forEach(card => {
        const coincide = cat === 'Todos' || card.dataset.cat === cat;
        card.hidden = !coincide;
      });
    });
  }

  // ---------- Formulario de contacto ----------
  const form = document.getElementById('formContacto');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const boton = form.querySelector('button[type="submit"]');
      const textoOriginal = boton.textContent;
      boton.disabled = true;
      boton.textContent = 'Enviando...';

      const datos = Object.fromEntries(new FormData(form).entries());
      try {
        const res = await fetch('/api/contacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        if (!res.ok) throw new Error('Error al enviar');
        mostrarToast('Mensaje enviado. Te contactaremos pronto.');
        form.reset();
      } catch (err) {
        mostrarToast('No se pudo enviar el mensaje. Intenta de nuevo.');
      } finally {
        boton.disabled = false;
        boton.textContent = textoOriginal;
      }
    });
  }
})();
