document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');
  const revealItems = document.querySelectorAll('.reveal');
  const toast = document.getElementById('toast');
  const form = document.getElementById('problemForm');
  const formFeedback = document.getElementById('formFeedback');
  const photoInput = document.getElementById('reportPhoto');
  const imagePreview = document.getElementById('imagePreview');

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
    if (backToTop) {
      backToTop.classList.toggle('is-visible', window.scrollY > 420);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('is-open')) {
          mainNav.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
          document.body.style.overflow = '';
        }
      });
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  if (photoInput && imagePreview) {
    photoInput.addEventListener('change', () => {
      const [file] = photoInput.files;
      if (!file) {
        imagePreview.innerHTML = '<p>Nenhuma foto selecionada.</p>';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.innerHTML = `<img src="${event.target.result}" alt="Pré-visualização da foto do problema" />`;
      };
      reader.readAsDataURL(file);
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = form.querySelector('#reportName').value.trim();
      const area = form.querySelector('#reportArea').value.trim();
      const category = form.querySelector('#reportCategory').value;
      const time = form.querySelector('#reportTime').value;
      const description = form.querySelector('#reportDescription').value.trim();
      const urgent = form.querySelector('#reportUrgent').checked;

      if (!name || !area || !category || !time || !description) {
        formFeedback.textContent = 'Preencha todos os campos obrigatórios antes de enviar.';
        return;
      }

      const urgencyText = urgent ? 'urgente' : 'não urgente';
      formFeedback.textContent = `Relato registrado com sucesso para ${area}. Categoria: ${category}. Situação ${urgencyText}.`;
      showToast('Problema enviado com sucesso para Olinda.');
      form.reset();

      if (imagePreview) {
        imagePreview.innerHTML = '<p>Nenhuma foto selecionada.</p>';
      }
    });
  }

  document.querySelectorAll('.signal-toggle').forEach((btn) => {
    const target = btn.nextElementSibling;
    if (!target) return;

    btn.addEventListener('click', () => {
      const isHidden = target.hasAttribute('hidden');
      if (isHidden) {
        target.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Ocultar causa';
      } else {
        target.setAttribute('hidden', 'hidden');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = 'Entender possível causa';
      }
    });
  });

  const stageTrack = document.getElementById('stageTrack');
  const stagePrev = document.querySelector('.stage-prev');
  const stageNext = document.querySelector('.stage-next');

  if (stageTrack && stagePrev && stageNext) {
    const scrollAmount = () => (stageTrack.querySelector('.stage-card')?.offsetWidth || 260) + 18;
    stagePrev.addEventListener('click', () => stageTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    stageNext.addEventListener('click', () => stageTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  }

  const revealBtn = document.getElementById('revealAnswerBtn');
  const revealText = document.getElementById('revealAnswerText');

  if (revealBtn && revealText) {
    revealBtn.addEventListener('click', () => {
      const isHidden = revealText.hasAttribute('hidden');
      if (isHidden) {
        revealText.removeAttribute('hidden');
        revealBtn.setAttribute('aria-expanded', 'true');
        revealBtn.textContent = 'Ocultar resposta';
      } else {
        revealText.setAttribute('hidden', 'hidden');
        revealBtn.setAttribute('aria-expanded', 'false');
        revealBtn.textContent = 'Entenda a diferença';
      }
    });
  }

  const baRange = document.getElementById('baRange');
  const baAfterWrap = document.getElementById('baAfterWrap');
  const baHandle = document.getElementById('baHandle');

  const updateBaSlider = (value) => {
    if (!baAfterWrap || !baHandle) return;
    baAfterWrap.style.width = `${value}%`;
    baHandle.style.left = `${value}%`;
  };

  if (baRange) {
    updateBaSlider(baRange.value);
    baRange.addEventListener('input', (event) => updateBaSlider(event.target.value));
  }
});
