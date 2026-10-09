(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Copy phone number
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { var old = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = old; }, 1600); };
      var fallback = function () {
        var target = document.getElementById(btn.getAttribute('data-copy-target'));
        if (target) { var r = document.createRange(); r.selectNodeContents(target); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
    });
  });

  // Contact form.
  // DEVELOPER NOTE: this form has no backend yet. Point it at your form handler
  // (e.g. a PHP mailer, Formspree, HubSpot or your CRM) and replace the message below.
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('form-note');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      note.hidden = false;
      note.textContent = 'This form is not connected to an inbox yet, so your message was not sent. Please call +1 (407) 760-8000 and our team will help you right away.';
    });
  }
})();
